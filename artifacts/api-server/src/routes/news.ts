import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, newsPostsTable } from "@workspace/db";
import { requireAdmin, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/news", async (req, res) => {
  try {
    const posts = await db.query.newsPostsTable.findMany({
      orderBy: [desc(newsPostsTable.publishedAt)],
      where: (posts, { eq }) => eq(posts.isPublished, true),
    });
    res.json({ posts });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch news");
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

router.get("/news/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const post = await db.query.newsPostsTable.findFirst({
      where: eq(newsPostsTable.id, id),
    });
    if (!post) {
      res.status(404).json({ error: "News post not found" });
      return;
    }
    res.json({ post });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch news post");
    res.status(500).json({ error: "Failed to fetch news post" });
  }
});

router.post("/admin/news", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, slug, excerpt, content, imageUrl } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const [post] = await db.insert(newsPostsTable).values({
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content,
      imageUrl: imageUrl || null,
      publishedAt: new Date(),
    }).returning();
    res.status(201).json({ post });
  } catch (err: any) {
    req.log.error({ err }, "Failed to create news post");
    if (err.code === "23505") {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create news post" });
  }
});

router.put("/admin/news/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const updateData: Record<string, any> = {};
    const fields = ["title", "slug", "excerpt", "content", "imageUrl", "isPublished"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    }
    if (updateData.isPublished === true && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    }
    updateData.updatedAt = new Date();
    const [post] = await db.update(newsPostsTable).set(updateData).where(eq(newsPostsTable.id, id)).returning();
    if (!post) {
      res.status(404).json({ error: "News post not found" });
      return;
    }
    res.json({ post });
  } catch (err: any) {
    req.log.error({ err }, "Failed to update news post");
    if (err.code === "23505") {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update news post" });
  }
});

router.delete("/admin/news/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [post] = await db.delete(newsPostsTable).where(eq(newsPostsTable.id, id)).returning();
    if (!post) {
      res.status(404).json({ error: "News post not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete news post");
    res.status(500).json({ error: "Failed to delete news post" });
  }
});

export default router;
