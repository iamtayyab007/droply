import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  // basic file/folder information
  name: text("name").notNull(),
  path: text("path").notNull(), // folder/file path
  size: integer("size").notNull(),
  type: text("type").notNull(), // folder
  // storage information
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  // ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"),
  // file/folder flags
  isFolder: boolean("is_folder").notNull().default(false),
  isStarred: boolean("is_starred").notNull().default(false),
  isTrash: boolean("is_trash").notNull().default(false),
  // timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  children: many(files),
}));

// type definitions

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
