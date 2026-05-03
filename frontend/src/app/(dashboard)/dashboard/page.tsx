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

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 halftone opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="bg-ink border-[3px] border-ink p-7 mb-10 relative overflow-hidden flex items-center justify-between shadow-comic-xl">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, #FFD23F 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
          <div className="relative z-10">
            <h1 className="font-comic text-5xl text-accent tracking-widest leading-none">MY LIBRARY</h1>
            <p className="text-gray-400 text-sm mt-2">Your personal AI-powered reading universe</p>
          </div>
          <div className="relative z-10 flex gap-5">
            {[
              { num: shelves.length, label: "SHELVES" },
              { num: books.length, label: "BOOKS" },
            ].map(({ num, label }) => (
              <div key={label} className="border-[2px] border-gray-600 px-5 py-3 text-center">
                <div className="font-comic text-4xl text-accent leading-none">{num}</div>
                <div className="text-xs text-gray-500 font-bold tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SHELVES */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-comic text-xl tracking-widest bg-accent border-[3px] border-ink px-4 py-1 shadow-comic -rotate-[0.5deg] inline-block">
            📚 MY SHELVES
          </span>
          <motion.button
            className="bg-white border-[3px] border-ink px-4 py-2 font-comic text-base tracking-wide shadow-comic"
            whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a", backgroundColor: "#4FC3F7" }}
            whileTap={{ x: 2, y: 2 }}
            onClick={() => setAddShelfOpen(true)}
          >+ NEW SHELF</motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
          {/* All books */}
          <motion.div
            className={`border-[3px] border-ink p-4 cursor-pointer shadow-comic relative overflow-hidden
              ${!activeShelf ? "bg-accent" : "bg-white hover:bg-yellow-50"}`}
            whileHover={{ x: -3, y: -3, boxShadow: "7px 7px 0 #1a1a1a" }}
            whileTap={{ x: 1, y: 1 }}
            onClick={() => setActiveShelf(undefined)}
          >
            <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: "#FFD23F" }} />
            <div className="text-3xl mb-2 mt-1">🌟</div>
            <div className="font-comic text-lg tracking-wide">ALL BOOKS</div>
            <div className="text-xs text-gray-500 mt-1">{books.length} books</div>
          </motion.div>

          {shelves.map((shelf: Shelf, i: number) => (
            <motion.div
              key={shelf._id}
              className={`border-[3px] border-ink p-4 cursor-pointer shadow-comic relative overflow-hidden
                ${activeShelf === shelf._id ? "bg-accent" : "bg-white hover:bg-yellow-50"}`}
              whileHover={{ x: -3, y: -3, boxShadow: "7px 7px 0 #1a1a1a" }}
              whileTap={{ x: 1, y: 1 }}
              onClick={() => setActiveShelf(shelf._id)}
            >
              <div className="absolute top-0 left-0 right-0 h-[5px]"
                style={{ background: SHELF_COLORS[i % SHELF_COLORS.length] }} />
              <div className="text-3xl mb-2 mt-1">📚</div>
              <div className="font-comic text-lg tracking-wide leading-tight">{shelf.name}</div>
            </motion.div>
          ))}

          {/* Add shelf */}
          <motion.div
            className="border-[3px] border-dashed border-ink p-4 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[100px]"
            whileHover={{ backgroundColor: "#fff", x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a", borderStyle: "solid" }}
            onClick={() => setAddShelfOpen(true)}
          >
            <div className="text-2xl text-gray-400">+</div>
            <span className="font-comic text-sm tracking-wide text-gray-400">NEW SHELF</span>
          </motion.div>
        </div>

        {/* BOOKS */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-comic text-xl tracking-widest bg-pop text-white border-[3px] border-ink px-4 py-1 shadow-comic rotate-[0.5deg] inline-block">
            📕 {activeShelf ? shelves.find((s) => s._id === activeShelf)?.name.toUpperCase() : "ALL BOOKS"}
          </span>
          <motion.button
            className="bg-pop text-white border-[3px] border-ink px-4 py-2 font-comic text-base tracking-wide shadow-comic"
            whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" }}
            whileTap={{ x: 2, y: 2 }}
            onClick={() => setAddBookOpen(true)}
          >+ ADD BOOK</motion.button>
        </div>

        {booksLoading ? (
          <div className="text-center py-16 font-comic text-2xl tracking-wide text-gray-400">
            LOADING BOOKS...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            <AnimatePresence>
              {books.map((book, i) => (
                <motion.div
                  key={book._id}
                  className="border-[3px] border-ink bg-white shadow-comic cursor-pointer overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: -3, y: -3, boxShadow: "7px 7px 0 #1a1a1a" }}
                  onClick={() => router.push(`/books/${book._id}`)}
                >
                  {/* Cover */}
                  <div
                    className="h-28 flex items-center justify-center text-4xl border-b-[3px] border-ink relative"
                    style={{ background: BOOK_COVER_COLORS[i % BOOK_COVER_COLORS.length] }}
                  >
                    {BOOK_EMOJIS[i % BOOK_EMOJIS.length]}
                    <button
                      className="absolute top-1.5 right-1.5 bg-pop text-white border-[2px] border-ink text-[9px] font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); removeBook(book._id); }}
                    >✕ DEL</button>
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <div className="font-comic text-base tracking-wide leading-tight">{book.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{book.author}</div>
                    {book.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {book.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-panel border-[1.5px] border-ink text-[9px] font-bold px-1.5 py-0.5 tracking-wide">
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add book card */}
            <motion.div
              className="border-[3px] border-dashed border-ink flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer"
              whileHover={{ backgroundColor: "#fff", x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a", borderStyle: "solid" }}
              onClick={() => setAddBookOpen(true)}
            >
              <div className="text-4xl">📘</div>
              <span className="font-comic text-sm tracking-wide text-gray-400">ADD NEW BOOK</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* ADD BOOK MODAL */}
      <ComicModal open={addBookOpen} onClose={() => setAddBookOpen(false)} title="📘 ADD NEW BOOK">
        <AddBookForm
          shelves={shelves}
          onSubmit={addBook}
          onClose={() => setAddBookOpen(false)}
        />
      </ComicModal>

      {/* ADD SHELF MODAL */}
      <ComicModal open={addShelfOpen} onClose={() => setAddShelfOpen(false)} title="📚 NEW SHELF">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1">Shelf Name</label>
            <input
              className="w-full border-[3px] border-ink px-3 py-2 font-body text-sm bg-panel focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Classics, Sci-Fi..."
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddShelf()}
            />
          </div>
          <div className="flex gap-3 mt-1">
            <button
              className="bg-panel border-[3px] border-ink px-5 py-2 font-comic text-lg tracking-wide shadow-comic"
              onClick={() => setAddShelfOpen(false)}
            >CANCEL</button>
            <button
              className="flex-1 bg-accent border-[3px] border-ink py-2 font-comic text-lg tracking-wide shadow-comic disabled:opacity-50"
              onClick={handleAddShelf}
              disabled={shelfLoading || !newShelfName.trim()}
            >
              {shelfLoading ? "CREATING..." : "CREATE ⚡"}
            </button>
          </div>
        </div>
      </ComicModal>
    </div>
  );
}