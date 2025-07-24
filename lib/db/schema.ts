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
  thumbnailUrl: text("thumbnail_url").notNull(),
  // ownership
  userId: uuid("user_id").notNull(),
  parentId: uuid("parent_id"),
  // file/folder flags
  isFolder: boolean("is_folder").notNull().default(false),
  is_starred: boolean("is_starred").notNull().default(false),
  is_trash: boolean("is_trash").notNull().default(false),
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

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;
