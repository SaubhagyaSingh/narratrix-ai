"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import { useShelves } from "@/hooks/useShelves";
import { Shelf } from "@/types";
import ComicModal from "@/components/ui/ComicModal";
import AddBookForm from "@/components/books/AddBookForm";
import { useRouter } from "next/navigation";

const SHELF_COLORS = ["#FFD23F", "#FF3B3B", "#4FC3F7", "#4CAF50", "#9C27B0", "#FF9800"];
const BOOK_COVER_COLORS = ["#FFD23F", "#FF3B3B", "#4FC3F7", "#4CAF50", "#9C27B0", "#FF9800"];
const BOOK_EMOJIS = ["📖", "📚", "📕", "📗", "📘", "📙"];

export default function DashboardPage() {
  const router = useRouter();
  const [activeShelf, setActiveShelf] = useState<string | undefined>(undefined);
  const { books, loading: booksLoading, addBook, removeBook } = useBooks(activeShelf);
  const { shelves, addShelf } = useShelves();
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [addShelfOpen, setAddShelfOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [shelfLoading, setShelfLoading] = useState(false);

  const handleAddShelf = async () => {
    if (!newShelfName.trim()) return;
    setShelfLoading(true);
    try {
      await addShelf(newShelfName.trim());
      setNewShelfName("");
      setAddShelfOpen(false);
    } finally {
      setShelfLoading(false);
    }
  };

  const openBook = (book: any) => {
    if (book.has_pdf) router.push(`/books/${book._id}/chat`);
    else router.push(`/books/${book._id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8E7] text-black">
      {/* ─── Decorative BG ─── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FFD23F]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#FF3B3B]/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        {/* ─── HERO ─── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 overflow-hidden rounded-3xl border-[3px] border-black bg-gradient-to-br from-[#FFD23F] via-[#FF9800] to-[#FF3B3B] p-8 shadow-[8px_8px_0_0_#000] lg:p-12"
        >
          {/* dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          {/* speed lines */}
          <div className="pointer-events-none absolute right-0 top-0 flex h-full w-1/2 flex-col items-end justify-center gap-2 pr-6 opacity-60">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full bg-black"
                style={{ width: `${40 + i * 10}%` }}
              />
            ))}
          </div>

          <div className="relative">
            <span className="inline-block rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000]">
              ⚡ Welcome back
            </span>
            <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-tight drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)] sm:text-6xl lg:text-8xl">
              MY LIBRARY
            </h1>
            <p className="mt-4 max-w-xl text-base font-semibold text-black/80 sm:text-lg">
              Your personal AI-powered reading universe — upload, organize, and chat with every book.
            </p>
          </div>

          {/* stats */}
          <div className="relative mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
            {[
              { num: shelves.length, label: "SHELVES", color: "#4FC3F7" },
              { num: books.length, label: "BOOKS", color: "#FFD23F" },
            ].map(({ num, label, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, rotate: -1 }}
                className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_0_#000]"
              >
                <div
                  className="text-4xl font-black sm:text-5xl"
                  style={{ color }}
                >
                  {num}
                </div>
                <div className="mt-1 text-xs font-black uppercase tracking-widest text-black/70">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── SHELVES ─── */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              📚 My Shelves
            </h2>
            <button
              onClick={() => setAddShelfOpen(true)}
              className="rounded-xl border-[3px] border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#FFD23F] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#FFD23F] sm:text-sm"
            >
              + New Shelf
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* All Books card */}
            <motion.button
              whileHover={{ y: -6, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveShelf(undefined)}
              className={`group relative overflow-hidden rounded-2xl border-[3px] border-black p-5 text-left shadow-[5px_5px_0_0_#000] transition-all ${
                !activeShelf ? "bg-black text-white" : "bg-white"
              }`}
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#FFD23F] opacity-40 blur-xl" />
              <div className="text-3xl">🌟</div>
              <div className="mt-3 text-lg font-black uppercase">All Books</div>
              <div className="text-xs font-bold opacity-70">{books.length} books</div>
            </motion.button>

            {/* Dynamic shelves */}
            {shelves.map((shelf: Shelf, i: number) => {
              const color = SHELF_COLORS[i % SHELF_COLORS.length];
              const isActive = activeShelf === shelf._id;
              return (
                <motion.button
                  key={shelf._id}
                  whileHover={{ y: -6, rotate: 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveShelf(shelf._id)}
                  className={`group relative overflow-hidden rounded-2xl border-[3px] border-black p-5 text-left shadow-[5px_5px_0_0_#000] transition-all ${
                    isActive ? "ring-4 ring-black ring-offset-2 ring-offset-[#FFF8E7]" : ""
                  }`}
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-black/10" />
                  <div className="text-3xl">📚</div>
                  <div className="mt-3 line-clamp-2 text-lg font-black uppercase">
                    {shelf.name}
                  </div>
                </motion.button>
              );
            })}

            {/* Ghost add card */}
            <motion.button
              whileHover={{ y: -6 }}
              onClick={() => setAddShelfOpen(true)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-dashed border-black/60 bg-white/40 p-5 text-black/60 transition-all hover:border-black hover:bg-white hover:text-black"
            >
              <div className="text-4xl font-black">+</div>
              <div className="text-xs font-black uppercase tracking-widest">New Shelf</div>
            </motion.button>
          </div>
        </section>

        {/* ─── BOOKS ─── */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              📕{" "}
              {activeShelf
                ? shelves.find((s) => s._id === activeShelf)?.name?.toUpperCase() ?? "SHELF"
                : "All Books"}
            </h2>
            <button
              onClick={() => setAddBookOpen(true)}
              className="rounded-xl border-[3px] border-black bg-[#FF3B3B] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] sm:text-sm"
            >
              + Add Book
            </button>
          </div>

          {booksLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border-[3px] border-dashed border-black/40 bg-white/50">
              <div className="animate-pulse text-lg font-black uppercase tracking-widest">
                Loading books...
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-[3px] border-black bg-white p-12 text-center shadow-[6px_6px_0_0_#000]">
              <div className="text-6xl">📭</div>
              <div className="text-2xl font-black uppercase">No books yet</div>
              <div className="text-sm font-semibold text-black/60">
                Hit <span className="font-black">+ ADD BOOK</span> to get started
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {books.map((book, i) => {
                  const color = BOOK_COVER_COLORS[i % BOOK_COVER_COLORS.length];
                  return (
                    <motion.div
                      key={book._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -6, rotate: -0.5 }}
                      onClick={() => openBook(book)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0_0_#000] transition-all hover:shadow-[9px_9px_0_0_#000]"
                    >
                      {/* Cover */}
                      <div
                        className="relative flex h-40 items-center justify-center overflow-hidden border-b-[3px] border-black"
                        style={{ backgroundColor: color }}
                      >
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            backgroundImage:
                              "radial-gradient(#000 1px, transparent 1px)",
                            backgroundSize: "10px 10px",
                          }}
                        />
                        <div className="relative text-6xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
                          {BOOK_EMOJIS[i % BOOK_EMOJIS.length]}
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBook(book._id);
                          }}
                          className="absolute right-2 top-2 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase opacity-0 shadow-[2px_2px_0_0_#000] transition hover:bg-[#FF3B3B] hover:text-white group-hover:opacity-100"
                        >
                          ✕ Del
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBook(book);
                          }}
                          className="absolute bottom-2 right-2 rounded-md border-2 border-black bg-black px-2 py-1 text-[10px] font-black uppercase text-white shadow-[2px_2px_0_0_#fff] opacity-0 transition group-hover:opacity-100"
                        >
                          💬 Chat
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-sm font-black uppercase leading-tight">
                          {book.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-black/60">
                          {book.author}
                        </p>
                        {book.tags?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {book.tags.slice(0, 2).map((tag: string) => (
                              <span
                                key={tag}
                                className="rounded-full border border-black bg-[#FFD23F] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                              >
                                {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Ghost add book */}
              <motion.button
                whileHover={{ y: -6 }}
                onClick={() => setAddBookOpen(true)}
                className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-[3px] border-dashed border-black/50 bg-white/40 p-6 text-black/60 transition hover:border-black hover:bg-white hover:text-black"
              >
                <div className="text-5xl">📘</div>
                <div className="text-xs font-black uppercase tracking-widest">
                  Add New Book
                </div>
              </motion.button>
            </div>
          )}
        </section>
      </div>

      {/* ─── ADD BOOK MODAL ─── */}
      <ComicModal
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        title="📘 ADD NEW BOOK"
      >
        <AddBookForm
          shelves={shelves}
          onSubmit={addBook}
          onClose={() => setAddBookOpen(false)}
        />
      </ComicModal>

      {/* ─── ADD SHELF MODAL ─── */}
      <ComicModal
        open={addShelfOpen}
        onClose={() => setAddShelfOpen(false)}
        title="📚 NEW SHELF"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest">
              Shelf Name
            </label>
            <input
              type="text"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddShelf()}
              autoFocus
              placeholder="e.g. Sci-Fi Classics"
              className="w-full rounded-xl border-[3px] border-black bg-white px-4 py-3 text-base font-bold shadow-[4px_4px_0_0_#000] outline-none transition focus:-translate-y-0.5 focus:shadow-[6px_6px_0_0_#000]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddShelfOpen(false)}
              className="rounded-xl border-[3px] border-black bg-white px-5 py-2 text-sm font-black uppercase shadow-[3px_3px_0_0_#000] transition hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              onClick={handleAddShelf}
              disabled={shelfLoading}
              className="rounded-xl border-[3px] border-black bg-[#FFD23F] px-5 py-2 text-sm font-black uppercase shadow-[3px_3px_0_0_#000] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {shelfLoading ? "Creating…" : "Create ⚡"}
            </button>
          </div>
        </div>
      </ComicModal>
    </div>
  );
}
