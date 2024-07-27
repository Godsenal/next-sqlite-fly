"use server";

import { db } from "@/db";
import { noteTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteNote = async (formData: FormData) => {
  const id = z.string().parse(formData.get("id"));
  await db.delete(noteTable).where(eq(noteTable.id, Number(id)));

  revalidatePath("/notes");
};
