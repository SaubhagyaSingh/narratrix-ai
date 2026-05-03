import { useState } from "react";
import { askQuestion } from "@/api/ai";
import { Message } from "@/types";

export function useChat(bookId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    // add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);
    setError("");

    try {
      const data = await askQuestion(bookId, query);
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, loading, error, sendMessage, clearMessages };
}