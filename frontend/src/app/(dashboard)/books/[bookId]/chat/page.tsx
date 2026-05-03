import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage({ params }: { params: { bookId: string } }) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="fixed inset-0 halftone opacity-30 pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 border-b-[3px] border-ink bg-ink px-6 py-3 flex-shrink-0">
        <a href={`/books/${params.bookId}`}
          className="font-comic text-sm tracking-wide border-[2px] border-accent text-accent px-3 py-1 hover:bg-accent hover:text-ink transition-colors">
          ← BACK
        </a>
        <div className="font-comic text-accent text-xl tracking-widest">NARRATRIX</div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full border-[2px] border-white animate-pulse" />
          <span className="font-comic text-xs text-gray-400 tracking-wide">AI READY</span>
        </div>
      </div>

      {/* Chat fills remaining height */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <ChatWindow bookId={params.bookId} bookTitle="My Book" />
      </div>
    </div>
  );
}