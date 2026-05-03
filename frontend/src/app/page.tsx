import Link from "next/link";

export default function RootPage() {
  const features = [
    { icon: "📄", title: "Upload Any PDF", desc: "Drop in research papers, contracts, manuals or books — up to hundreds of pages.", color: "bg-warning" },
    { icon: "💬", title: "Chat With Your Doc", desc: "Ask questions in plain English and get instant, context-aware answers.", color: "bg-info" },
    { icon: "⚡", title: "Cited Answers", desc: "Every response is grounded in your PDF with page-level citations you can verify.", color: "bg-pop" },
    { icon: "🔒", title: "Private & Secure", desc: "Your documents are encrypted and never used to train external models.", color: "bg-success" },
    { icon: "🧠", title: "Smart Summaries", desc: "Generate TL;DRs, key points and chapter breakdowns in one click.", color: "bg-secondary" },
    { icon: "🌐", title: "Multi-Language", desc: "Upload in any language, ask in another — we handle the translation.", color: "bg-accent" },
  ];

  const steps = [
    { n: "01", title: "Upload your PDF", desc: "Drag & drop or browse — we index it in seconds.", color: "text-pop" },
    { n: "02", title: "Ask anything", desc: "Type questions like you would to a human expert.", color: "text-info" },
    { n: "03", title: "Get answers + sources", desc: "Read responses with exact page references.", color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-[3px] border-base-300">
        {/* halftone dots bg */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            color: "oklch(var(--bc))",
          }}
        />
        <div className="absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-pop/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-info/30 blur-3xl" />

        <div className="container mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-block font-comic text-sm bg-warning text-base-400 border-[3px] border-base-300 px-4 py-1.5 mb-6 shadow-comic -rotate-2">
              ✨ AI-POWERED PDF ASSISTANT
            </div>
            <h1 className="font-comic text-5xl leading-[1.05] tracking-wide sm:text-6xl lg:text-8xl">
              Talk to your PDFs like
              <span className="block text-pop mt-2">they're a real expert!</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base text-base-content/70 sm:text-lg lg:text-xl">
              Upload any document and instantly chat with it. Get answers, summaries, and
              citations — without scrolling through hundreds of pages.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="font-comic text-xl tracking-wide bg-pop text-base-400 border-[3px] border-base-300 px-7 py-3 shadow-comic-xl hover:-translate-y-1 hover:translate-x-[-2px] active:translate-y-0 active:translate-x-0 transition-transform"
              >
                Get Started Free →
              </Link>
              <a
                href="#how-it-works"
                className="font-comic text-xl tracking-wide bg-base-100 border-[3px] border-base-300 px-7 py-3 shadow-comic hover:-translate-y-1 transition-transform"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 font-comic text-sm tracking-wide text-base-content/60">
              No credit card required · Free 5 PDFs
            </p>
          </div>

          {/* mock chat preview */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="bg-base-100 border-[3px] border-base-300 shadow-comic-xl">
              <div className="flex gap-2 border-b-[3px] border-base-300 bg-base-200 px-4 py-2">
                <span className="w-3 h-3 rounded-full bg-error border-[2px] border-base-300" />
                <span className="w-3 h-3 rounded-full bg-warning border-[2px] border-base-300" />
                <span className="w-3 h-3 rounded-full bg-success border-[2px] border-base-300" />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <div className="chat chat-start">
                  <div className="chat-bubble bg-pop text-base-400 border-[3px] border-base-300 font-comic tracking-wide">
                    Summarize chapter 3 in 5 bullet points.
                  </div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble bg-base-100 text-base-content border-[3px] border-base-300 font-comic tracking-wide">
                    Sure! Here are the key takeaways from chapter 3 (pages 42–61)…
                  </div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble bg-info text-base-400 border-[3px] border-base-300 font-comic tracking-wide">
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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-comic text-4xl tracking-wide sm:text-5xl lg:text-6xl">
            Everything you need to <span className="text-pop">read smarter</span>
          </h2>
          <p className="mt-4 text-base-content/70 text-lg">
            Powerful features designed to turn static documents into conversations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-base-100 border-[3px] border-base-300 p-6 shadow-comic transition-transform hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-comic-xl ${
                i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
              }`}
            >
              <div
                className={`${f.color} border-[3px] border-base-300 w-14 h-14 flex items-center justify-center text-3xl shadow-comic mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="font-comic text-2xl tracking-wide">{f.title}</h3>
              <p className="mt-2 text-base-content/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-base-200 py-24 border-y-[3px] border-base-300 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
            backgroundSize: "20px 20px",
            color: "oklch(var(--bc))",
          }}
        />
        <div className="container mx-auto px-6 relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-comic text-4xl tracking-wide sm:text-5xl lg:text-6xl">
              From PDF to answers in <span className="text-info">3 steps</span>
            </h2>
            <p className="mt-4 text-base-content/70 text-lg">
              No setup. No learning curve. Just upload and ask.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-base-100 border-[3px] border-base-300 p-7 shadow-comic-xl hover:-translate-y-1 transition-transform"
              >
                <span className={`font-comic text-6xl tracking-wide ${s.color}`}>{s.n}</span>
                <h3 className="font-comic text-2xl tracking-wide mt-2">{s.title}</h3>
                <p className="mt-2 text-base-content/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-pop text-base-400 border-[3px] border-base-300 shadow-comic-xl grid grid-cols-2 lg:grid-cols-4 divide-x-[3px] divide-y-[3px] lg:divide-y-0 divide-base-300">
          {[
            { title: "Documents processed", value: "1.2M+" },
            { title: "Questions answered", value: "25M+" },
            { title: "Happy users", value: "80K+" },
            { title: "Avg. response time", value: "1.4s" },
          ].map((s) => (
            <div key={s.title} className="p-6 text-center">
              <div className="font-comic text-sm tracking-wide opacity-90">{s.title}</div>
              <div className="font-comic text-4xl tracking-wide mt-2">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-warning text-base-400 border-[3px] border-base-300 shadow-comic-xl p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="relative">
            <h2 className="font-comic text-4xl tracking-wide sm:text-5xl lg:text-6xl">
              Ready to chat with your first PDF?
            </h2>
            <p className="py-6 max-w-xl mx-auto">
              Jump into the dashboard, upload a document, and start asking questions in under
              a minute.
            </p>
            <Link
              href="/dashboard"
              className="inline-block font-comic text-xl tracking-wide bg-base-300 text-base-400 border-[3px] border-base-300 px-7 py-3 shadow-comic hover:-translate-y-1 hover:translate-x-[-2px] active:translate-y-0 active:translate-x-0 transition-transform"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[3px] border-base-300 bg-base-200 p-10 text-center">
        <p className="font-comic text-lg tracking-wide">
          Narratrix <span className="text-pop">⚡</span> · Built for curious readers
        </p>
        <p className="mt-2 text-sm text-base-content/60">
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </footer>
    </div>
  );
}
