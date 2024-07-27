import { deleteNote } from "@/app/notes/actions";
import { db } from "@/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Notes() {
  const notes = await db.query.noteTable.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {notes.map((note) => (
        <div key={note.id} className="mb-4 p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p>{note.description}</p>
          <form action={deleteNote}>
            <input type="hidden" name="id" value={note.id} />
            <button
              type="submit"
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              삭제
            </button>
          </form>
        </div>
      ))}
      <Link href="/notes/new">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create Note
        </button>
      </Link>
    </main>
  );
}
