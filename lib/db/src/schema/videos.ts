import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryVideosTable = pgTable("gallery_videos", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull().default("events"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const insertGalleryVideoSchema = createInsertSchema(galleryVideosTable)
  .omit({ id: true, createdAt: true });

export type GalleryVideo = typeof galleryVideosTable.$inferSelect;
export type InsertGalleryVideo = z.infer<typeof insertGalleryVideoSchema>;