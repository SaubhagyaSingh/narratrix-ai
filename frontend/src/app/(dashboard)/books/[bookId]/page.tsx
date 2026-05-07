import PdfUploader from "@/components/books/PdfUploader";

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;

  return (
    <div className="relative min-h-screen bg-[#FFF8E7]">
      {/* Halftone background */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Decorative blurs */}
      <div className="fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FFD23F]/30 blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#FF3B3B]/25 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">

        {/* Book header */}
        <div className="relative bg-gradient-to-br from-[#FFD23F] via-[#FF9800] to-[#FF3B3B] border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-12 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black opacity-40" />

          <div className="relative">
            <h1 className="font-black text-6xl tracking-tight text-black drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] lg:text-7xl">
              📕 MY BOOK
            </h1>
            <p className="text-black/70 text-lg font-semibold mt-3">
              Upload a PDF to start asking questions
            </p>
          </div>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-black text-lg tracking-widest text-white bg-black border-[3px] border-black px-6 py-2.5 shadow-[4px_4px_0px_0px_#FFD23F] -rotate-2 inline-block uppercase">
            ⚡ Upload PDF
          </span>
          <div className="flex-1 h-[3px] bg-black" />
        </div>

        {/* Uploader */}
        <div className="mb-12">
          <PdfUploader bookId={bookId} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* How it works card */}
          <div className="border-[4px] border-black bg-white p-8 shadow-[6px_6px_0px_0px_#000] rounded-2xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-[3px] border-black">
              <span className="text-3xl">💡</span>
              <h3 className="font-black text-2xl tracking-tight text-black uppercase">How It Works</h3>
            </div>
            <div className="space-y-3">
              {[
                { step: "Upload your PDF", icon: "📄", color: "#FFD23F" },
                { step: "AI splits into chunks", icon: "✂️", color: "#4FC3F7" },
                { step: "Creates embeddings", icon: "🧠", color: "#9C27B0" },
                { step: "Ask anything!", icon: "💬", color: "#FF3B3B" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border-[2px] border-black bg-white hover:bg-[#FFF0DE] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-black text-black tracking-tight">{item.step}</span>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full border-[2px] border-black"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Book stats card */}
          <div className="border-[4px] border-black bg-gradient-to-br from-[#4FC3F7] to-[#4CAF50] text-white p-8 shadow-[6px_6px_0px_0px_#000] rounded-2xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-[3px] border-white/40">
              <span className="text-3xl">📊</span>
              <h3 className="font-black text-2xl tracking-tight uppercase">Book Stats</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Status", value: "Ready to upload", icon: "✅" },
                { label: "Model", value: "Qwen3-0.6B", icon: "🤖" },
                { label: "Search", value: "Milvus Vector DB", icon: "🔍" },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30"
                >
                  <div>
                    <div className="text-sm font-semibold opacity-90">{label}</div>
                    <div className="font-black text-lg mt-1">{value}</div>
                  </div>
                  <span className="text-2xl">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-12 bg-black border-[4px] border-black text-white p-8 rounded-2xl shadow-[6px_6px_0px_0px_#FFD23F]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-black text-2xl tracking-tight uppercase mb-2">⚡ Smart indexing</h3>
              <p className="text-white/80 font-semibold max-w-lg">
                Your PDF is automatically processed and indexed for lightning-fast semantic search. Start asking questions within seconds.
              </p>
            </div>
            <div className="flex gap-2">
              {["📖", "🔍", "✨"].map((icon, i) => (
                <div
                  key={i}
                  className="text-3xl bg-white/10 border-[2px] border-white/30 p-4 rounded-xl"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}