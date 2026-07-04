import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("ceremonial"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotosTable)
  .omit({ id: true, createdAt: true });

export type GalleryPhoto = typeof galleryPhotosTable.$inferSelect;
export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
