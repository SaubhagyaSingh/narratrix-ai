"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/useChat";

const SUGGESTIONS = [
  "What is the main theme?",
  "Who are the key characters?",
  "Summarize the first chapter",
  "What happens at the end?",
];

export default function ChatWindow({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const { messages, loading, error, sendMessage } = useChat(bookId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <div className="font-comic text-5xl text-accent mb-2"
                style={{ textShadow: "3px 3px 0 #1a1a1a" }}>
                💬
              </div>
              <h2 className="font-comic text-2xl tracking-wide mb-2">
                ASK ANYTHING ABOUT
              </h2>
              <h3 className="font-comic text-xl text-pop mb-6">{bookTitle}</h3>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <motion.button key={s}
                    className="border-[2px] border-ink bg-white px-3 py-1.5 text-xs font-bold shadow-comic hover:bg-accent transition-colors"
                    whileHover={{ x: -1, y: -1, boxShadow: "3px 3px 0 #1a1a1a" }}
                    whileTap={{ x: 1, y: 1 }}
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} index={i} />
            ))
          )}
        </AnimatePresence>

        {/* Thinking indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-pop border-[3px] border-ink flex items-center justify-center font-comic text-white text-sm flex-shrink-0 shadow-comic">
              AI
            </div>
            <div className="bg-white border-[3px] border-ink p-3 shadow-comic">
              <div className="font-comic text-[11px] tracking-widest text-pop mb-2">THINKING...</div>
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i}
                    className="w-2 h-2 bg-ink rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="border-[3px] border-ink bg-white p-3 text-center shadow-comic">
            <span className="font-comic text-pop text-lg">OOPS! </span>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}