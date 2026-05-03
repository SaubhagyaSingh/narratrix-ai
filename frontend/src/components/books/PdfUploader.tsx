"use client";
import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPdf } from "@/api/ai";

type Stage = "idle" | "uploading" | "success" | "error";

const STEPS = ["UPLOAD", "CHUNKING", "EMBEDDING", "STORING"];

export default function PdfUploader({ bookId, onSuccess }: { bookId: string; onSuccess?: () => void }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [dragging, setDragging] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateSteps = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 900));
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are supported!");
      return;
    }
    setStage("uploading");
    setActiveStep(0);
    setError("");

    try {
      simulateSteps(); // visual steps run in parallel
      await uploadPdf(bookId, file);
      setStage("success");
      onSuccess?.();
    } catch (e: any) {
      setStage("error");
      setError(e?.response?.data?.detail || "Something went wrong!");
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">

        {/* IDLE */}
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative border-[3px] border-dashed border-neutral bg-base-100 p-12 text-center cursor-pointer transition-all
              ${dragging ? "bg-accent/20 border-accent shadow-comic-xl -translate-x-1 -translate-y-1" : "shadow-comic hover:-translate-x-1 hover:-translate-y-1 hover:shadow-comic-lg"}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            <motion.div
              className="w-20 h-20 border-[3px] border-neutral bg-accent mx-auto mb-5 flex items-center justify-center shadow-comic"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 12 15 15"/>
              </svg>
            </motion.div>

            <h2 className="font-comic text-3xl tracking-wide mb-2 text-base-content">DROP YOUR PDF HERE</h2>
            <p className="text-base-content/60 text-sm mb-6">Drag & drop your book PDF, or click to browse</p>

            <motion.button
              className="bg-secondary text-secondary-content border-[3px] border-neutral px-8 py-3 font-comic text-xl tracking-wide shadow-comic"
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" }}
              whileTap={{ x: 2, y: 2, boxShadow: "2px 2px 0 #1a1a1a" }}
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              📂 CHOOSE FILE
            </motion.button>

            <p className="text-base-content/40 text-xs mt-4 italic">Accepts .pdf files up to 50MB</p>
          </motion.div>
        )}

        {/* UPLOADING */}
        {stage === "uploading" && (
          <motion.div key="uploading"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-[3px] border-neutral bg-base-100 p-10 text-center shadow-comic"
          >
            <h2 className="font-comic text-3xl tracking-wide mb-6">⚙️ PROCESSING YOUR PDF...</h2>

            <div className="h-6 bg-base-200 border-[3px] border-neutral overflow-hidden shadow-[3px_3px_0_#1a1a1a] mb-4">
              <motion.div
                className="h-full"
                style={{
                  background: "repeating-linear-gradient(45deg, #FFD23F, #FFD23F 10px, #1a1a1a 10px, #1a1a1a 12px)",
                  backgroundSize: "24px 24px",
                }}
                initial={{ width: "0%" }}
                animate={{ width: activeStep >= STEPS.length - 1 ? "95%" : `${(activeStep / STEPS.length) * 90 + 10}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>

            <div className="flex gap-2 mt-5">
              {STEPS.map((step, i) => (
                <motion.div key={step}
                  className={`flex-1 py-2 px-1 border-[2px] border-neutral text-xs font-bold text-center transition-colors
                    ${i < activeStep ? "bg-success text-white" : i === activeStep ? "bg-accent" : "bg-base-200"}`}
                  animate={i === activeStep ? { scale: [1, 1.04, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  {i < activeStep ? `✓ ${step}` : step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUCCESS */}
        {stage === "success" && (
          <motion.div key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="border-[3px] border-neutral bg-base-100 p-10 text-center shadow-comic relative overflow-hidden"
          >
            <motion.div
              className="font-comic text-6xl text-primary inline-block"
              style={{ textShadow: "3px 3px 0 #1a1a1a", transform: "rotate(-3deg)" }}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -3 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
            >
              POW!
            </motion.div>

            <h2 className="font-comic text-3xl tracking-wide my-3 text-base-content">PDF PROCESSED SUCCESSFULLY!</h2>
            <p className="text-base-content/60 mb-6">Your book is indexed and ready for questions.</p>

            <motion.button
              className="bg-primary text-primary-content border-[3px] border-neutral px-8 py-3 font-comic text-2xl tracking-wide shadow-comic"
              whileHover={{ x: -2, y: -2, boxShadow: "7px 7px 0 #1a1a1a" }}
              whileTap={{ x: 2, y: 2 }}
              onClick={() => router.push(`/books/${bookId}/chat`)}
            >
              💬 START CHATTING →
            </motion.button>
          </motion.div>
        )}

        {/* ERROR */}
        {stage === "error" && (
          <motion.div key="error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-[3px] border-neutral bg-base-100 p-10 text-center shadow-comic"
          >
            <div className="font-comic text-5xl text-error mb-3" style={{ textShadow: "3px 3px 0 #1a1a1a" }}>OOPS!</div>
            <p className="text-base-content/70 mb-6">{error}</p>
            <motion.button
              className="bg-accent border-[3px] border-neutral px-8 py-3 font-comic text-xl tracking-wide shadow-comic"
              whileHover={{ x: -2, y: -2 }}
              onClick={() => setStage("idle")}
            >
              TRY AGAIN →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}