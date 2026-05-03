"use client";
import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface Props {
  onSend: (msg: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="border-t-[3px] border-ink bg-white p-4 flex-shrink-0">
      <div className="flex gap-3">
        <input
          className="flex-1 border-[3px] border-ink px-4 py-2.5 font-body text-sm bg-panel focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Ask something about the book..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
        />
        <motion.button
          className={`bg-pop text-white border-[3px] border-ink px-6 font-comic text-xl tracking-wide shadow-comic
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={!loading ? { x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" } : {}}
          whileTap={!loading ? { x: 2, y: 2, boxShadow: "2px 2px 0 #1a1a1a" } : {}}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : "SEND ⚡"}
        </motion.button>
      </div>
      <p className="text-xs text-gray-400 italic mt-2">Press Enter to send</p>
    </div>
  );
}