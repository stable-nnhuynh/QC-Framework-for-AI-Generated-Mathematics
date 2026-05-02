"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathDisplay } from "@/components/math-display";
import { cn } from "@/lib/utils";
import errorTaxonomy from "@/data/error-taxonomy.json";

type QCState = "upload" | "workspace" | "output";

interface QCResult {
  extractedText: string;
  selectedErrors: string[];
  correctedLatex: string;
  score: number;
}

const MOCK_EXTRACTED = {
  problem: "Find the eigenvalues and eigenvectors of $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$",
  aiSolution: `Step 1: The characteristic equation is det(A - \\lambda I) = 0

Step 2: det\\begin{pmatrix} 4-\\lambda & 1 \\\\ 2 & 3-\\lambda \\end{pmatrix} = (4-\\lambda)(3-\\lambda) - 1 = 0

Step 3: \\lambda^2 - 7\\lambda + 11 = 0

Step 4: \\lambda = \\frac{7 \\pm \\sqrt{5}}{2}`,
};

export function QCWorkspace() {
  const [state, setState] = useState<QCState>("upload");
  const [extracting, setExtracting] = useState(false);
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [correctedLatex, setCorrectedLatex] = useState("");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<QCResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(() => {
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      setState("workspace");
    }, 2000);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFile();
    },
    [handleFile],
  );

  const handleToggleError = (code: string) => {
    setSelectedErrors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleGenerate = () => {
    setResult({
      extractedText: MOCK_EXTRACTED.problem,
      selectedErrors,
      correctedLatex,
      score,
    });
    setState("output");
  };

  const handleReset = () => {
    setState("upload");
    setSelectedErrors([]);
    setCorrectedLatex("");
    setScore(0);
    setResult(null);
  };

  const handleJsonExport = () => {
    if (!result) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            source: "pdf_upload",
            problem: result.extractedText,
            error_tags: result.selectedErrors,
            corrected_solution: result.correctedLatex,
            benchmark_score: result.score,
            max_score: 5,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "golden-dataset-entry.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload State */}
      <AnimatePresence mode="wait">
        {state === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                QC Workspace
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Upload an AI-generated math solution (PDF) to begin the Audit, Correct, and Benchmark process.
              </p>
            </div>

            <div
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                "hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
                dragActive && "border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.01]",
                extracting ? "border-blue-300 dark:border-blue-700" : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFile}
              />

              {extracting ? (
                <div className="space-y-4">
                  <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Extracting content from PDF...
                  </p>
                  <div className="max-w-xs mx-auto h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                      Upload AI-Generated Solution (PDF)
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Drag & drop or click to browse
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Workspace State */}
        {state === "workspace" && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  QC Workspace
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Review the extracted content and complete the 3-step SOP process.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Extracted Content */}
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Extracted from PDF (AI Output)
                    </h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                        Problem
                      </span>
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 border border-zinc-100 dark:border-zinc-700/50">
                        <MathDisplay math={MOCK_EXTRACTED.problem} display />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                        AI Solution
                      </span>
                      <pre className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 border border-red-100 dark:border-red-900/30 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {MOCK_EXTRACTED.aiSolution}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: SOP Dashboard */}
              <div className="space-y-4">
                {/* Step 1: Audit - Error Tagging */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Audit — Tag Errors
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      Click to select all applicable error types found in the AI output.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {errorTaxonomy.map((item) => {
                        const isSelected = selectedErrors.includes(item.code);
                        return (
                          <button
                            key={item.code}
                            onClick={() => handleToggleError(item.code)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border",
                              isSelected && "ring-2 ring-offset-1 ring-zinc-900 dark:ring-zinc-100 dark:ring-offset-zinc-900",
                              isSelected
                                ? item.severity === "High"
                                  ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                  : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                : "opacity-60 hover:opacity-80 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
                            )}
                          >
                            <span className="font-mono font-bold">{item.code}</span>
                            <span className="ml-1.5 hidden sm:inline">{item.category}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedErrors.length > 0 && (
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {selectedErrors.length} error(s) selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 2: Correct & Rewrite */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Correct & Rewrite
                    </h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <textarea
                      value={correctedLatex}
                      onChange={(e) => setCorrectedLatex(e.target.value)}
                      placeholder="Enter corrected LaTeX solution..."
                      rows={4}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-sm font-mono text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                        Live Preview
                      </span>
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 border border-zinc-100 dark:border-zinc-700/50 min-h-[60px]">
                        {correctedLatex ? (
                          <MathDisplay math={correctedLatex} display />
                        ) : (
                          <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                            Start typing LaTeX to see the preview...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Benchmark */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Benchmark — Score
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                      Rate the overall quality on a 5-point scale.
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setScore(n)}
                          className={cn(
                            "flex-1 py-3 rounded-lg text-center text-sm font-bold transition-all cursor-pointer border",
                            score >= n
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                              : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700",
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {score > 0 && (
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                        Score: {score}/5 — {score >= 4 ? "Pass" : score >= 3 ? "Needs Revision" : "Reject"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
                    "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                    "hover:bg-zinc-700 dark:hover:bg-zinc-300",
                    "shadow-lg hover:shadow-xl",
                  )}
                >
                  Generate Golden Dataset Entry
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Output State */}
        {state === "output" && result && (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Golden Dataset Entry Generated
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Review and download the structured JSON for AI training.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Upload
              </button>
            </div>

            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{result.selectedErrors.length}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase">Errors Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{result.score}/5</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase">Benchmark</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {result.correctedLatex ? "Yes" : "No"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase">Corrected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">JSON</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase">Export</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                  golden-dataset-entry.json
                </h4>
                <button
                  onClick={handleJsonExport}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
              <pre className="p-4 text-sm font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    source: "pdf_upload",
                    problem: result.extractedText,
                    error_tags: result.selectedErrors,
                    corrected_solution: result.correctedLatex || "(not provided)",
                    benchmark_score: result.score,
                    max_score: 5,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
