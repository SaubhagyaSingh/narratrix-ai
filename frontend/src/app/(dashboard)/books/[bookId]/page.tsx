import PdfUploader from "@/components/books/PdfUploader";

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
const { bookId } = await params;  return (
    <div className="relative min-h-screen">
      {/* Halftone background */}
      <div className="fixed inset-0 halftone opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* Book header */}
        <div className="relative bg-white border-[3px] border-ink shadow-comic-lg p-6 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[6px]"
            style={{ background: "repeating-linear-gradient(90deg, #FFD23F 0 20px, #FF3B3B 20px 40px, #4FC3F7 40px 60px)" }} />
          <h1 className="font-comic text-4xl tracking-wide mt-2">MY BOOK</h1>
          <p className="text-gray-500 text-sm mt-1">Upload a PDF to start asking questions</p>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <span className="font-comic text-xl tracking-widest text-pop border-[3px] border-ink bg-accent px-4 py-1 shadow-comic -rotate-1 inline-block">
            ⚡ UPLOAD PDF
          </span>
          <div className="flex-1 h-[3px] bg-ink" />
        </div>

        {/* Uploader */}
        <PdfUploader bookId={bookId} />

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-5 mt-8">
          <div className="border-[3px] border-ink bg-white p-5 shadow-comic">
            <h3 className="font-comic text-xl tracking-wide border-b-2 border-ink pb-2 mb-3">💡 HOW IT WORKS</h3>
            {["Upload your PDF", "AI splits into chunks", "Creates embeddings", "Ask anything!"].map((s, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-dashed border-gray-200">
                <span>{s}</span>
                <span>{["📄","✂️","🧠","💬"][i]}</span>
              </div>
            ))}
          </div>
          <div className="border-[3px] border-ink bg-white p-5 shadow-comic">
            <h3 className="font-comic text-xl tracking-wide border-b-2 border-ink pb-2 mb-3">📊 BOOK STATS</h3>
            {[["Status", "Ready to upload"], ["Model", "Qwen3-0.6B"], ["Search", "Milvus Vector DB"]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-500">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}