import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { requireAdmin, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

function isAllowedMediaOrigin(req: Request): boolean {
  const requestOrigin = `${req.protocol}://${req.get("host")}`;
  const configuredOrigins = (process.env.MEDIA_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const replitOrigins = [process.env.REPLIT_DEV_DOMAIN, ...(process.env.REPLIT_DOMAINS || "").split(",")]
    .filter(Boolean)
    .flatMap((domain) => [`https://${domain}`, `http://${domain}`]);
  const allowedOrigins = new Set([requestOrigin, ...configuredOrigins, ...replitOrigins]);
  const origin = req.headers.origin || req.headers.referer || "";
  return !origin || allowedOrigins.has(origin) || origin.startsWith(`${requestOrigin}/`);
}

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * Protected: only authenticated admins can request upload URLs.
 */
router.post("/storage/uploads/request-url", requireAdmin, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  // Validate file type: only images allowed for gallery uploads
  const { name, size, contentType } = parsed.data;
  if (!contentType.startsWith("image/")) {
    res.status(400).json({ error: "Only image uploads are allowed" });
    return;
  }
  if (size > 10 * 1024 * 1024) {
    res.status(400).json({ error: "File size exceeds 10MB limit" });
    return;
  }

  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * POST /storage/video-uploads/request-url
 *
 * Request a presigned URL for a video upload. Video objects are kept in their
 * own directory under PRIVATE_OBJECT_DIR so they can be managed separately
 * from gallery photos and other uploads.
 */
router.post("/storage/video-uploads/request-url", requireAdmin, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  const { name, size, contentType } = parsed.data;
  if (!contentType.startsWith("video/")) {
    res.status(400).json({ error: "Only video uploads are allowed" });
    return;
  }
  if (size > 250 * 1024 * 1024) {
    res.status(400).json({ error: "Video size exceeds 250MB limit" });
    return;
  }

  try {
    const uploadURL = await objectStorageService.getVideoEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating video upload URL");
    res.status(500).json({ error: "Failed to generate video upload URL" });
  }
});

/**
 * PUT /storage/local-uploads/:directory/:objectId
 *
 * Upload endpoint used when running outside Replit. The URL is returned by
 * the request-url endpoints and is same-origin, so the admin session cookie
 * is sent with the upload.
 */
router.put(
  "/storage/local-uploads/:directory/:objectId",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!objectStorageService.isLocalProvider()) {
      res.status(404).json({ error: "Local storage is not enabled" });
      return;
    }

    const rawDirectory = req.params.directory;
    const rawObjectId = req.params.objectId;
    const directory = Array.isArray(rawDirectory) ? rawDirectory[0] : rawDirectory;
    const objectId = Array.isArray(rawObjectId) ? rawObjectId[0] : rawObjectId;
    if (
      (directory !== "uploads" && directory !== "videos") ||
      !/^[0-9a-f-]{36}$/i.test(objectId)
    ) {
      res.status(400).json({ error: "Invalid upload path" });
      return;
    }

    try {
      await objectStorageService.saveLocalUpload(
        directory,
        objectId,
        req.headers["content-type"] || "application/octet-stream",
        req,
      );
      res.status(201).json({ success: true });
    } catch (error) {
      req.log.error({ err: error }, "Error saving local upload");
      res.status(400).json({ error: "Failed to save upload" });
    }
  },
);

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR.
 * These objects are uploaded via the admin panel and are intended for public
 * gallery display. We validate the request is same-origin to mitigate abuse.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    if (!isAllowedMediaOrigin(req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (objectStorageService.isLocalProvider()) {
      const localObject = await objectStorageService.getLocalObject(objectPath);
      const range = parseRange(req.headers.range, localObject.size);
      res.setHeader("Content-Type", localObject.contentType);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=3600");
      if (range) {
        res.status(206);
        res.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${localObject.size}`);
        res.setHeader("Content-Length", range.end - range.start + 1);
        objectStorageService.createLocalReadStream(localObject.filePath, range).pipe(res);
      } else {
        res.setHeader("Content-Length", localObject.size);
        objectStorageService.createLocalReadStream(localObject.filePath).pipe(res);
      }
      return;
    }

    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

function parseRange(
  header: string | undefined,
  size: number,
): { start: number; end: number } | null {
  if (!header?.startsWith("bytes=")) return null;
  const [startText, endText] = header.slice("bytes=".length).split("-", 2);
  let start = Number(startText);
  let end = endText ? Number(endText) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (!startText) {
    const suffixLength = Number(endText);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  }
  if (start < 0 || end < start || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

export default router;
