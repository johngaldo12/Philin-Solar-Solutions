import { Router, type IRouter } from "express";
import { ADMIN_USERNAME, ADMIN_PASSWORD, requireAdmin, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.post("/admin/login", (req: AuthenticatedRequest, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.cookie("admin_session", ADMIN_USERNAME, {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({ success: true, username: ADMIN_USERNAME });
    return;
  }
  res.status(401).json({ error: "Invalid username or password" });
});

router.post("/admin/logout", (req: AuthenticatedRequest, res) => {
  res.clearCookie("admin_session");
  res.json({ success: true });
});

router.get("/admin/me", (req: AuthenticatedRequest, res) => {
  const sessionUser = req.signedCookies?.["admin_session"];
  if (sessionUser === ADMIN_USERNAME) {
    res.json({ authenticated: true, username: sessionUser });
    return;
  }
  res.json({ authenticated: false });
});

router.get("/admin/news", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const { db, newsPostsTable } = await import("@workspace/db");
  const { desc } = await import("drizzle-orm");
  const posts = await db.query.newsPostsTable.findMany({
    orderBy: [desc(newsPostsTable.createdAt)],
  });
  res.json({ posts });
});

router.get("/admin/gallery", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const { db, galleryPhotosTable } = await import("@workspace/db");
  const { asc } = await import("drizzle-orm");
  const photos = await db.query.galleryPhotosTable.findMany({
    orderBy: [asc(galleryPhotosTable.sortOrder), asc(galleryPhotosTable.id)],
  });
  res.json({ photos });
});

export default router;
