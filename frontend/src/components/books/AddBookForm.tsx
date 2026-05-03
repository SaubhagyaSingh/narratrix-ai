"use client";
import { useState } from "react";
import { Shelf } from "@/types";

interface Props {
  shelves: Shelf[];
  onSubmit: (data: { title: string; author: string; theme?: string; tags: string[]; shelf_id?: string }) => Promise<any>;
  onClose: () => void;
}

export default function AddBookForm({ shelves, onSubmit, onClose }: Props) {
  const [form, setForm] = useState({ title: "", author: "", theme: "", tags: "", shelf_id: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.author) return;
    setLoading(true);
    try {
      await onSubmit({
        title: form.title,
        author: form.author,
        theme: form.theme || undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        shelf_id: form.shelf_id || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(["title", "author", "theme"] as const).map((field) => (
        <div key={field}>
          <label className="block text-xs font-bold tracking-widest uppercase mb-1">{field}</label>
          <input
            className="w-full border-[3px] border-base-300 px-3 py-2 font-body text-sm bg-base-200 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={`Enter ${field}...`}
            value={form[field]}
            onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          />
        </div>
      ))}

      <div>
        <label className="block text-xs font-bold tracking-widest uppercase mb-1">Tags (comma separated)</label>
        <input
          className="w-full border-[3px] border-base-300 px-3 py-2 font-body text-sm bg-base-200 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g. fiction, drama, 1920s"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
        />
      </div>

      {shelves.length > 0 && (
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase mb-1">Shelf</label>
          <select
            className="w-full border-[3px] border-base-300 px-3 py-2 font-body text-sm bg-base-200 focus:outline-none"
            value={form.shelf_id}
            onChange={(e) => setForm((p) => ({ ...p, shelf_id: e.target.value }))}
          >
            <option value="">No shelf</option>
            {shelves.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          className="bg-base-200 border-[3px] border-base-300 px-5 py-2 font-comic text-lg tracking-wide shadow-comic hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          onClick={onClose}
        >CANCEL</button>
        <button
          className="flex-1 bg-secondary text-white border-[3px] border-base-300 py-2 font-comic text-lg tracking-wide shadow-comic hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.author}
        >
          {loading ? "ADDING..." : "ADD BOOK ⚡"}
        </button>
      </div>
    </div>
  );
}