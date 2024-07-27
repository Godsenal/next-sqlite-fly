"use server";
import { db } from "@/db";
import { noteTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createNoteSchema = createInsertSchema(noteTable);

export async function createNote(formData: FormData) {
  const rawFormData = {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
  };

  const note = await createNoteSchema.parseAsync(rawFormData);

  const result = await db.insert(noteTable).values(note);

  revalidatePath("/notes");
  redirect("/notes");
}
