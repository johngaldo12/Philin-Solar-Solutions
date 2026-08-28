import { Storage, File } from "@google-cloud/storage";
import { Readable, Transform } from "stream";
import { randomUUID } from "crypto";
import { createReadStream, createWriteStream } from "fs";
import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises";
import { dirname, extname, join, resolve } from "path";
import { pipeline } from "stream/promises";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
    credentials: {
      audience: "replit",
      subject_token_type: "access_token",
      token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
      type: "external_account",
      credential_source: {
        url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
        format: {
          type: "json",
          subject_token_field_name: "access_token",
        },
      },
      universe_domain: "googleapis.com",
    },
    projectId: "",
});

type StorageProvider = "replit" | "local";
type LocalObject = {
  filePath: string;
  contentType: string;
  size: number;
};

const LOCAL_UPLOAD_LIMITS = {
  uploads: 10 * 1024 * 1024,
  videos: 250 * 1024 * 1024,
} as const;

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  getProvider(): StorageProvider {
    const configured = process.env.MEDIA_STORAGE_PROVIDER?.trim().toLowerCase();
    if (configured === "replit" || configured === "local") {
      return configured;
    }

    // Replit provisions PRIVATE_OBJECT_DIR automatically. Other hosts use the
    // local provider unless a provider is explicitly configured.
    return process.env.PRIVATE_OBJECT_DIR ? "replit" : "local";
  }

  isLocalProvider(): boolean {
    return this.getProvider() === "local";
  }

  getLocalStorageDir(): string {
    return resolve(
      process.env.MEDIA_STORAGE_DIR ||
        process.env.UPLOAD_DIR ||
        join(process.cwd(), "uploads"),
    );
  }

  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<File | null> {
    if (this.isLocalProvider()) {
      return null;
    }

    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  async downloadObject(file: File, cacheTtlSec: number = 3600): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const aclPolicy = await getObjectAclPolicy(file);
    const isPublic = aclPolicy?.visibility === "public";

    const nodeStream = file.createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      "Content-Type": (metadata.contentType as string) || "application/octet-stream",
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
    };
    if (metadata.size) {
      headers["Content-Length"] = String(metadata.size);
    }

    return new Response(webStream, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    return this.getUploadURL("uploads");
  }

  async getVideoEntityUploadURL(): Promise<string> {
    return this.getUploadURL("videos");
  }

  private async getUploadURL(directory: "uploads" | "videos"): Promise<string> {
    const objectId = randomUUID();
    if (this.isLocalProvider()) {
      // A relative URL keeps uploads same-origin on Render and local hosts,
      // while Replit continues to use its signed cross-origin URL.
      return `/api/storage/local-uploads/${directory}/${objectId}`;
    }

    const privateObjectDir = this.getPrivateObjectDir();
    const fullPath = `${privateObjectDir}/${directory}/${objectId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);

    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    });
  }

  async saveLocalUpload(
    directory: "uploads" | "videos",
    objectId: string,
    contentType: string,
    source: AsyncIterable<Uint8Array>,
  ): Promise<void> {
    if (!this.isLocalProvider()) {
      throw new Error("Local uploads are not enabled for the current storage provider");
    }

    const filePath = this.getLocalFilePath(`/objects/${directory}/${objectId}`);
    const metadataPath = `${filePath}.meta.json`;
    const maxSize = LOCAL_UPLOAD_LIMITS[directory];
    let bytesWritten = 0;

    await mkdir(dirname(filePath), { recursive: true });
    try {
      const counter = new Transform({
        transform(chunk: Buffer, _encoding, callback) {
          bytesWritten += chunk.length;
          if (bytesWritten > maxSize) {
            callback(new Error(`File exceeds the ${maxSize} byte limit`));
            return;
          }
          callback(null, chunk);
        },
      });

      await pipeline(source, counter, createWriteStream(filePath, { flags: "wx" }));
      await writeFile(
        metadataPath,
        JSON.stringify({ contentType: contentType || "application/octet-stream" }),
        "utf8",
      );
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      await unlink(metadataPath).catch(() => undefined);
      throw error;
    }

  }

  async getLocalObject(objectPath: string): Promise<LocalObject> {
    if (!this.isLocalProvider()) {
      throw new ObjectNotFoundError();
    }

    const filePath = this.getLocalFilePath(objectPath);
    try {
      const fileStats = await stat(filePath);
      if (!fileStats.isFile()) {
        throw new ObjectNotFoundError();
      }
      let contentType = "application/octet-stream";
      try {
        const metadata = JSON.parse(await readFile(`${filePath}.meta.json`, "utf8")) as {
          contentType?: string;
        };
        contentType = metadata.contentType || contentType;
      } catch {
        const extension = extname(filePath).toLowerCase();
        if (extension === ".jpg" || extension === ".jpeg") contentType = "image/jpeg";
        if (extension === ".png") contentType = "image/png";
        if (extension === ".webp") contentType = "image/webp";
        if (extension === ".mp4") contentType = "video/mp4";
        if (extension === ".webm") contentType = "video/webm";
      }
      return { filePath, contentType, size: fileStats.size };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new ObjectNotFoundError();
      }
      throw error;
    }
  }

  createLocalReadStream(filePath: string, range?: { start: number; end: number }) {
    return range
      ? createReadStream(filePath, { start: range.start, end: range.end })
      : createReadStream(filePath);
  }

  private getLocalFilePath(objectPath: string): string {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const relativePath = objectPath.slice("/objects/".length);
    const root = this.getLocalStorageDir();
    const filePath = resolve(root, relativePath);
    if (filePath !== root && !filePath.startsWith(`${root}/`)) {
      throw new ObjectNotFoundError();
    }
    return filePath;
  }

  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (this.isLocalProvider()) {
      throw new ObjectNotFoundError();
    }

    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (this.isLocalProvider() && rawPath.startsWith("/api/storage/local-uploads/")) {
      const entityId = rawPath.slice("/api/storage/local-uploads/".length);
      return `/objects/${entityId}`;
    }

    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }

    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;

    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }

    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    if (this.isLocalProvider()) {
      return true;
    }

    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30_000),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`
    );
  }

  const data = (await response.json()) as { signed_url: string };
  return data.signed_url;
}
