"use client";
 import { askQuestion } from "@/api/ai";
import { use, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params); // ✅ THIS IS THE FIX

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


const sendMessage = async () => {
  if (!input.trim()) return;

  const question = input; 

  const userMsg: Message = { role: "user", content: question };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const data = await askQuestion(bookId, question); 

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.answer },
    ]);
  } catch (err: any) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: err?.message || "⚠ Error fetching response",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* HEADER */}
      <div className="border-b-4 border-ink p-4 font-comic text-2xl bg-accent">
        📘 Chat with your Book
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl p-3 border-[3px] border-ink shadow-comic ${
              msg.role === "user"
                ? "ml-auto bg-primary text-white"
                : "mr-auto bg-white"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-white border-[3px] border-ink p-3 shadow-comic">
            Thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t-4 border-ink flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about your PDF..."
          className="flex-1 border-[3px] border-ink px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-accent border-[3px] border-ink px-6 font-comic"
        >
          SEND ⚡
        </button>
      </div>
    </div>
  );
}