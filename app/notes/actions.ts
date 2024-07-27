"use server";

import { db } from "@/db";
import { noteTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { validateRequest } from "@/auth/utils";

export const deleteNote = async (formData: FormData) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = z.string().parse(formData.get("id"));
  await db
    .delete(noteTable)
    .where(and(eq(noteTable.id, Number(id)), eq(noteTable.userId, user.id)));

  revalidatePath("/notes");
};
