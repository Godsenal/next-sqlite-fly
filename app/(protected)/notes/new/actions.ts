"use server";
import { validateRequest } from "@/auth/utils";
import { db } from "@/db";
import { noteTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createNoteSchema = createInsertSchema(noteTable, {
  userId: (schema) => schema.userId.optional(),
  title: (schema) => schema.title.min(1),
  description: (schema) => schema.description.min(1),
});

export async function createNote(prevState: any, formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/google/login");
  }

  const rawFormData = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const note = createNoteSchema.safeParse(rawFormData);

  if (!note.success) {
    return {
      errors: note.error.flatten().fieldErrors,
    };
  }

  await db.insert(noteTable).values({
    ...note.data,
    userId: user.id,
  });

  revalidatePath("/notes");
  redirect("/notes");
}
