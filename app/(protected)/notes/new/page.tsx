"use client";

import { createNote } from "@/app/(protected)/notes/new/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function NewNote() {
  const [state, formAction] = useFormState(createNote, {
    errors: {},
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(false);
  }, [state]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Note</h1>
      <form
        action={formAction}
        className="space-y-4"
        onChange={() => setDirty(true)}
      >
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border rounded-md text-black"
          />
          {dirty && state.errors.title && (
            <p className="text-red-500">{state.errors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border rounded-md text-black"
            required
            rows={4}
          ></textarea>
          {dirty && state.errors.description && (
            <p className="text-red-500">{state.errors.description}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Create Note
        </button>
      </form>
    </div>
  );
}
