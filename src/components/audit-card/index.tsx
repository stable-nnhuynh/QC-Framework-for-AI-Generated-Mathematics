"use client";

import { motion } from "framer-motion";
import { MathDisplay } from "@/components/math-display";
import { ErrorTooltip } from "@/components/ui/error-tooltip";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  math: string;
  hasError?: boolean;
  errorCode?: string;
  errorNote?: string;
}

interface AuditSummary {
  errorsFound: string[];
  rootCause: string;
  impact: string;
}

interface AuditCardProps {
  aiSteps: Step[];
  expertSteps: Step[];
  aiScore: number;
  expertScore: number;
  maxScore: number;
  auditSummary: AuditSummary;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ScoreBadge({ score, max, variant }: { score: number; max: number; variant: "error" | "success" }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", variant === "error" ? "bg-red-500" : "bg-emerald-500")}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className={cn(
        "text-sm font-bold tabular-nums",
        variant === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
      )}>
        {score}/{max}
      </span>
    </div>
  );
}

export function AuditCard({ aiSteps, expertSteps, aiScore, expertScore, maxScore, auditSummary }: AuditCardProps) {
  return (
    <div className="space-y-6">
      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Output (Error side) */}
        <motion.div
          className="rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-bold text-red-700 dark:text-red-400">AI Raw Output</h3>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
              Needs Correction
            </span>
          </div>
          <ScoreBadge score={aiScore} max={maxScore} variant="error" />
          <div className="mt-4 space-y-3">
            {aiSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={cn(
                  "rounded-lg p-3 border transition-all",
                  step.hasError
                    ? "border-red-300 dark:border-red-800 bg-red-100/80 dark:bg-red-900/30"
                    : "border-red-100 dark:border-red-900/20 bg-white/60 dark:bg-zinc-900/40"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    {step.label}
                  </span>
                  {step.hasError && step.errorCode && step.errorNote && (
                    <ErrorTooltip code={step.errorCode} note={step.errorNote} />
                  )}
                </div>
                <div className="overflow-x-auto">
                  <MathDisplay math={step.math} display className="text-zinc-800 dark:text-zinc-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expert Output (Correct side) */}
        <motion.div
          className="rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400">Expert Corrected</h3>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              Golden Standard
            </span>
          </div>
          <ScoreBadge score={expertScore} max={maxScore} variant="success" />
          <div className="mt-4 space-y-3">
            {expertSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/20 bg-white/60 dark:bg-zinc-900/40"
              >
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5 block">
                  {step.label}
                </span>
                <div className="overflow-x-auto">
                  <MathDisplay math={step.math} display className="text-zinc-800 dark:text-zinc-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Audit Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-5"
      >
        <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Audit Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">Errors Found</span>
            <div className="flex flex-wrap gap-1.5">
              {auditSummary.errorsFound.map((code) => (
                <span key={code} className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-mono text-xs font-bold">
                  {code}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">Root Cause</span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{auditSummary.rootCause}</p>
          </div>
          <div>
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">Impact</span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{auditSummary.impact}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
