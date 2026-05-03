import { motion } from "framer-motion";
import { Message } from "@/types";

export default function ChatMessage({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "items-start gap-3"}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      {!isUser && (
        <div className="w-10 h-10 bg-secondary border-[3px] border-base-300 flex items-center justify-center font-comic text-white text-sm flex-shrink-0 shadow-comic">
          AI
        </div>
      )}

      <div className={`relative max-w-[70%] border-[3px] border-base-300 p-3 shadow-comic
        ${isUser ? "bg-accent" : "bg-base-100"}`}
      >
        {!isUser && (
          <div className="font-comic text-[11px] tracking-widest text-pop mb-1">NARRATRIX</div>
        )}
        <p className={`text-sm leading-relaxed ${isUser ? "font-bold" : ""}`}>
          {message.content}
        </p>

        {/* Speech bubble tail */}
        <span className={`absolute -bottom-[14px] border-[7px] border-transparent
          ${isUser
            ? "right-4 border-t-ink"
            : "left-4 border-t-ink"
          }`}
        />
        <span className={`absolute -bottom-[8px] border-[5px] border-transparent z-10
          ${isUser
            ? "right-[6px] border-t-accent"
            : "left-[6px] border-t-white"
          }`}
        />
      </div>
    </motion.div>
  );
}