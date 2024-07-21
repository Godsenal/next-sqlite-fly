"use server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createNoteSchema = createInsertSchema(notes);

export async function createNote(formData: FormData) {
  const rawFormData = {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
  };

  const note = await createNoteSchema.parseAsync(rawFormData);

  const result = await db.insert(notes).values(note);

  revalidatePath("/notes");
  redirect("/notes");
}
