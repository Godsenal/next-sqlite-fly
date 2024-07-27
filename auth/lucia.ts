import { db } from "@/db";
import { sessionTable, userTable } from "@/db/schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      googleId: databaseUserAttributes.googleId,
      profileImage: databaseUserAttributes.profileImage,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof userTable.$inferSelect;
  }
}
