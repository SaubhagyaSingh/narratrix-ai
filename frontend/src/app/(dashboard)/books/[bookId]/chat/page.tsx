

"use client";

import { askQuestion } from "@/api/ai";
import { use, useState, useEffect, useRef } from "react";


type Message = {
  role: "user" | "assistant";
  content: string;
};

const ACTION_WORDS = ["POW!", "ZAP!", "BOOM!", "WHAM!", "KAPOW!", "BZZT!"];

export default function ChatPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionWord, setActionWord] = useState("ZAP!");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setActionWord(ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)]);
    try {
      const data = await askQuestion(bookId, question);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err?.message || "⚠ Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-base-200 overflow-hidden">

      {/* ══════════════════════════════════════
          LEFT PANEL — Book animation
      ══════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[38%] flex-col items-center justify-center gap-6 bg-base-100 border-r-4 border-neutral relative overflow-hidden px-8">

        {/* Halftone texture */}
        <div className="halftone absolute inset-0 opacity-10 pointer-events-none" />

        {/* Label */}
        <div className="relative z-10 text-center">
          <p className="font-comic text-4xl text-secondary leading-none">📖 BOOK CHAT</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral/40 mt-1">
            AI-Powered Reading Companion
          </p>
        </div>

        {/* Book GIF */}
        <div className="relative z-10 panel bg-base-200/60 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://media.giphy.com/media/gUEKKz5iCOKkoAyHfX/giphy.gif"
            alt="Flipping book animation"
            width={260}
            height={260}
            className="object-contain"
          />
        </div>

        {/* Hint card */}
        <div className="relative z-10 panel bg-accent/20 px-5 py-3 max-w-[210px] text-center">
          <p className="text-xs text-neutral/60 font-bold leading-snug">
            Ask me anything about your document!
          </p>
        </div>

        {/* Decorative words */}
        <span className="absolute top-10 left-5 font-comic text-primary text-2xl opacity-25 rotate-[-14deg] pointer-events-none">POW!</span>
        <span className="absolute bottom-12 right-5 font-comic text-secondary text-xl opacity-25 rotate-[9deg] pointer-events-none">WHAM!</span>
        <span className="absolute top-[45%] right-4 font-comic text-accent text-lg opacity-20 rotate-[3deg] pointer-events-none">ZAP!</span>
      </aside>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Chat
      ══════════════════════════════════════ */}
      <section className="flex flex-col flex-1 min-w-0">

        {/* Chat top-bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-accent border-b-4 border-neutral">
          <div className="w-7 h-7 bg-secondary border-[2.5px] border-neutral rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-comic text-white text-[9px]">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-comic text-neutral text-base leading-none">Narratrix</p>
            <p className="text-[10px] text-neutral/55 uppercase tracking-wider">
              {loading ? "Thinking…" : "Ready"}
            </p>
          </div>
          <span className={`w-2 h-2 rounded-full border border-neutral flex-shrink-0 ${loading ? "bg-primary animate-pulse" : "bg-success"}`} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {messages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="panel bg-base-100 px-6 py-5 text-center max-w-xs">
                <p className="font-comic text-3xl text-secondary">ZAP! ⚡</p>
                <p className="font-comic text-neutral mt-1 text-lg">Ask your first question!</p>
                <p className="text-xs text-neutral/45 mt-1">Type below and hit Send or press Enter.</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div
                  className="bg-primary text-primary-content border-[3px] border-neutral shadow-comic px-3 py-2 max-w-[75%]"
                  style={{ borderRadius: "10px 10px 2px 10px" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-55 mb-0.5">You</p>
                  <p className="text-sm leading-snug">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="max-w-[75%]">
                  <div className="flex items-center gap-1.5 mb-1 ml-0.5">
                    <div className="w-4 h-4 bg-secondary border-[1.5px] border-neutral rounded-full flex items-center justify-center">
                      <span className="text-white font-comic text-[7px] leading-none">AI</span>
                    </div>
                    <span className="font-comic text-[10px] text-neutral/45 uppercase tracking-wider">Narratrix</span>
                  </div>
                  <div className="speech-bubble bg-base-100 px-3 py-2">
                    <p className="text-sm leading-snug">{msg.content}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%]">
                <div className="flex items-center gap-1.5 mb-1 ml-0.5">
                  <div className="w-4 h-4 bg-secondary border-[1.5px] border-neutral rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white font-comic text-[7px] leading-none">AI</span>
                  </div>
                  <span className="font-comic text-[10px] text-neutral/45 uppercase tracking-wider">Narratrix</span>
                </div>
                <div className="speech-bubble bg-base-100 px-4 py-2 flex items-center gap-2">
                  <span className="font-comic text-secondary text-base animate-bounce">{actionWord}</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1.5 h-1.5 bg-neutral rounded-full inline-block"
                        style={{ animation: `dotbounce 0.9s ease-in-out ${j * 0.18}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t-4 border-neutral bg-base-100 px-3 py-2.5 flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask something about your PDF…"
              disabled={loading}
              className="w-full border-[3px] border-neutral bg-base-200 px-3 py-2 text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-accent focus:bg-base-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: "4px" }}
            />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent border-l-2 border-b-2 border-neutral pointer-events-none" />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="font-comic text-sm px-4 py-2 bg-secondary text-secondary-content border-[3px] border-neutral shadow-comic active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:brightness-105 whitespace-nowrap"
            style={{ borderRadius: "4px" }}
          >
            {loading ? <span className="animate-pulse">…</span> : "SEND ⚡"}
          </button>
        </div>
      </section>

      <style>{`
        @keyframes dotbounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}