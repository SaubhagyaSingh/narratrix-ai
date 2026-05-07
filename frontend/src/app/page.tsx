import Link from "next/link";

export default function RootPage() {
  const features = [
    { icon: "📄", title: "Upload Any PDF", desc: "Drop in research papers, contracts, manuals or books — up to hundreds of pages.", color: "bg-[#FFD23F]" },
    { icon: "💬", title: "Chat With Your Doc", desc: "Ask questions in plain English and get instant, context-aware answers.", color: "bg-[#4FC3F7]" },
    { icon: "⚡", title: "Cited Answers", desc: "Every response is grounded in your PDF with page-level citations you can verify.", color: "bg-[#FF3B3B]" },
    { icon: "🔒", title: "Private & Secure", desc: "Your documents are encrypted and never used to train external models.", color: "bg-[#4CAF50]" },
    { icon: "🧠", title: "Smart Summaries", desc: "Generate TL;DRs, key points and chapter breakdowns in one click.", color: "bg-[#9C27B0]" },
    { icon: "🌐", title: "Multi-Language", desc: "Upload in any language, ask in another — we handle the translation.", color: "bg-[#FF9800]" },
  ];

  const steps = [
    { n: "01", title: "Upload your PDF", desc: "Drag & drop or browse — we index it in seconds.", color: "text-[#FF3B3B]" },
    { n: "02", title: "Ask anything", desc: "Type questions like you would to a human expert.", color: "text-[#4FC3F7]" },
    { n: "03", title: "Get answers + sources", desc: "Read responses with exact page references.", color: "text-[#FFD23F]" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-[4px] border-black">
        {/* halftone dots bg */}
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute -top-40 -left-40 -z-10 h-[600px] w-[600px] rounded-full bg-[#FFD23F]/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 -z-10 h-[600px] w-[600px] rounded-full bg-[#FF3B3B]/30 blur-3xl" />

        <div className="container mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-block font-black text-sm bg-[#FFD23F] text-black border-[3px] border-black px-5 py-2 mb-8 shadow-[6px_6px_0px_0px_#000] -rotate-2 uppercase tracking-widest">
              ✨ AI-POWERED PDF ASSISTANT
            </div>
            <h1 className="font-black text-5xl leading-[1.1] tracking-tight text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)] sm:text-7xl lg:text-8xl">
              Talk to your PDFs like
              <span className="block text-[#FF3B3B] mt-3">they're a real expert!</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-semibold text-black/70 sm:text-xl">
              Upload any document and instantly chat with it. Get answers, summaries, and
              citations — without scrolling through hundreds of pages.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="font-black text-lg tracking-tight bg-[#FF3B3B] text-white border-[3px] border-black px-8 py-4 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all uppercase"
              >
                Get Started Free →
              </Link>
              <a
                href="#how-it-works"
                className="font-black text-lg tracking-tight bg-white text-black border-[3px] border-black px-8 py-4 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all uppercase"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 font-black text-sm tracking-widest text-black/60 uppercase">
              No credit card required · Free 5 PDFs
            </p>
          </div>

          {/* mock chat preview */}
          <div className="mx-auto mt-20 max-w-3xl">
            <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden">
              <div className="flex gap-3 border-b-[4px] border-black bg-[#F0F0F0] px-5 py-3">
                <span className="w-4 h-4 rounded-full bg-[#FF3B3B] border-[2px] border-black" />
                <span className="w-4 h-4 rounded-full bg-[#FFD23F] border-[2px] border-black" />
                <span className="w-4 h-4 rounded-full bg-[#4CAF50] border-[2px] border-black" />
              </div>
              <div className="flex flex-col gap-4 p-6 bg-white">
                <div className="chat chat-start">
                  <div className="chat-bubble bg-[#FF3B3B] text-white border-[3px] border-black font-black tracking-wide">
                    Summarize chapter 3 in 5 bullet points.
                  </div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble bg-[#E8E8E8] text-black border-[3px] border-black font-black tracking-wide shadow-[4px_4px_0px_0px_#000]">
                    Sure! Here are the key takeaways from chapter 3 (pages 42–61)…
                  </div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble bg-[#4FC3F7] text-white border-[3px] border-black font-black tracking-wide">
                    What's the Author's main argument?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="font-black text-5xl tracking-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)] sm:text-6xl lg:text-7xl">
            Everything you need to <span className="text-[#FF3B3B]">read smarter</span>
          </h2>
          <p className="mt-6 text-black/60 text-lg font-semibold">
            Powerful features designed to turn static documents into conversations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-white border-[3px] border-black p-7 shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#000] rounded-2xl ${
                i % 2 === 0 ? "-rotate-1" : "rotate-1"
              }`}
            >
              <div
                className={`${f.color} border-[3px] border-black w-16 h-16 flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#000] mb-5 rounded-xl`}
              >
                {f.icon}
              </div>
              <h3 className="font-black text-2xl tracking-tight text-black uppercase">{f.title}</h3>
              <p className="mt-3 text-black/65 font-semibold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-black py-24 border-y-[4px] border-black relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="font-black text-5xl tracking-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
              From PDF to answers in <span className="text-[#4FC3F7]">3 steps</span>
            </h2>
            <p className="mt-6 text-white/80 text-lg font-semibold">
              No setup. No learning curve. Just upload and ask.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] transition-all rounded-2xl"
              >
                <span className={`font-black text-7xl tracking-wider ${s.color}`}>{s.n}</span>
                <h3 className="font-black text-2xl tracking-tight mt-4 uppercase text-black">{s.title}</h3>
                <p className="mt-3 text-black/65 font-semibold leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-[#FFD23F] to-[#FF9800] text-black border-[4px] border-black shadow-[8px_8px_0px_0px_#000] grid grid-cols-2 lg:grid-cols-4 divide-x-[4px] divide-y-[4px] lg:divide-y-0 divide-black rounded-2xl overflow-hidden">
          {[
            { title: "Documents processed", value: "1.2M+" },
            { title: "Questions answered", value: "25M+" },
            { title: "Happy users", value: "80K+" },
            { title: "Avg. response time", value: "1.4s" },
          ].map((s) => (
            <div key={s.title} className="p-8 text-center">
              <div className="font-black text-xs tracking-widest uppercase opacity-90">{s.title}</div>
              <div className="font-black text-5xl tracking-wide mt-3">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-[#FF3B3B] to-[#FF9800] text-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-12 text-center relative overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <h2 className="font-black text-5xl tracking-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] sm:text-6xl lg:text-7xl uppercase">
              Ready to chat with your first PDF?
            </h2>
            <p className="py-6 max-w-2xl mx-auto font-semibold text-lg">
              Jump into the dashboard, upload a document, and start asking questions in under
              a minute.
            </p>
            <Link
              href="/dashboard"
              className="inline-block font-black text-lg tracking-tight bg-white text-black border-[3px] border-black px-8 py-4 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] active:translate-y-0 transition-all uppercase"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[4px] border-black bg-black text-white p-12 text-center">
        <p className="font-black text-xl tracking-tight uppercase">
          Narratrix <span className="text-[#FFD23F]">⚡</span> · Built for curious readers
        </p>
        <p className="mt-3 text-sm text-white/70 font-semibold">
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </footer>
    </div>
  );
}