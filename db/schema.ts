import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const noteTable = sqliteTable("notes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  profileImage: text("profile_image"),
  googleId: text("google_id"),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});
