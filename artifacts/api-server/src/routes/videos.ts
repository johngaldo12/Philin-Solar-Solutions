import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, galleryVideosTable } from "@workspace/db";
import { requireAdmin, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/gallery/videos", async (req, res) => {
  try {
    const videos = await db.query.galleryVideosTable.findMany({
      orderBy: [asc(galleryVideosTable.sortOrder), asc(galleryVideosTable.id)],
    });
    res.json({ videos });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch gallery videos");
    res.status(500).json({ error: "Failed to fetch gallery videos" });
  }
});

router.get("/admin/gallery/videos", requireAdmin, async (req, res) => {
  try {
    const videos = await db.query.galleryVideosTable.findMany({
      orderBy: [asc(galleryVideosTable.sortOrder), asc(galleryVideosTable.id)],
    });
    res.json({ videos });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch admin gallery videos");
    res.status(500).json({ error: "Failed to fetch gallery videos" });
  }
});

router.post("/admin/gallery/videos", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { src, title, description, category, sortOrder } = req.body;
    if (!src || !title?.trim()) {
      res.status(400).json({ error: "src and title are required" });
      return;
    }
    if (!src.startsWith("/api/storage/objects/videos/")) {
      res.status(400).json({ error: "Video must be stored in the videos directory" });
      return;
    }

    const [video] = await db.insert(galleryVideosTable).values({
      src,
      title: title.trim(),
      description: description?.trim() || null,
      category: category || "events",
      sortOrder: sortOrder ?? 0,
    }).returning();
    res.status(201).json({ video });
  } catch (err) {
    req.log.error({ err }, "Failed to add gallery video");
    res.status(500).json({ error: "Failed to add gallery video" });
  }
});

router.delete("/admin/gallery/videos/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [video] = await db.delete(galleryVideosTable)
      .where(eq(galleryVideosTable.id, id))
      .returning();
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery video");
    res.status(500).json({ error: "Failed to delete gallery video" });
  }
});

export default router;