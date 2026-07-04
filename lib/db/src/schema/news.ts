import { pgTable, serial, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsPostsTable = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }).defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const insertNewsPostSchema = createInsertSchema(newsPostsTable)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/i, "Slug must be alphanumeric with hyphens"),
  });

export const updateNewsPostSchema = insertNewsPostSchema.partial();

export type NewsPost = typeof newsPostsTable.$inferSelect;
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;
export type UpdateNewsPost = z.infer<typeof updateNewsPostSchema>;
