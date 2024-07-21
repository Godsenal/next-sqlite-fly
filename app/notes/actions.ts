"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteNote = async (formData: FormData) => {
  const id = z.string().parse(formData.get("id"));
  await db.delete(notes).where(eq(notes.id, Number(id)));

  revalidatePath("/notes");
};
