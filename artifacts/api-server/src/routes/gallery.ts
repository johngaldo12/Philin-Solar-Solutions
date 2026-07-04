import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, galleryPhotosTable } from "@workspace/db";
import { requireAdmin, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/gallery", async (req, res) => {
  try {
    const photos = await db.query.galleryPhotosTable.findMany({
      orderBy: [asc(galleryPhotosTable.sortOrder), asc(galleryPhotosTable.id)],
    });
    res.json({ photos });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch gallery");
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.post("/admin/gallery", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { src, alt, category, sortOrder } = req.body;
    if (!src || !alt) {
      res.status(400).json({ error: "src and alt are required" });
      return;
    }
    const [photo] = await db.insert(galleryPhotosTable).values({
      src,
      alt,
      category: category || "ceremonial",
      sortOrder: sortOrder ?? 0,
    }).returning();
    res.status(201).json({ photo });
  } catch (err) {
    req.log.error({ err }, "Failed to add gallery photo");
    res.status(500).json({ error: "Failed to add gallery photo" });
  }
});

router.delete("/admin/gallery/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [photo] = await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, id)).returning();
    if (!photo) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery photo");
    res.status(500).json({ error: "Failed to delete gallery photo" });
  }
});

export default router;
