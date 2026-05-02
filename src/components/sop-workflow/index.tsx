"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SOPStep {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  checklist: string[];
}

const steps: SOPStep[] = [
  {
    number: 1,
    title: "Audit",
    subtitle: "Verify Mathematical Correctness",
    description: "Cross-reference the AI solution against the OpenStax textbook. Trace every logical step independently.",
    checklist: [
      "Re-derive the solution from scratch",
      "Verify all arithmetic and algebraic steps",
      "Check for logical hallucinations (LOG-01)",
      "Flag calculation errors (CAL-02)",
      "Confirm theorems are correctly stated and applied",
    ],
  },
  {
    number: 2,
    title: "Correct & Rewrite",
    subtitle: "Optimize for Pedagogy & LaTeX",
    description: "Rewrite the solution to be complete, clear, and properly formatted for the target student audience.",
    checklist: [
      "Fill all pedagogical gaps (GAP-04)",
      "Fix LaTeX notation issues (SYM-03)",
      "Ensure step-by-step structure: Problem -> Steps -> Verification -> Answer",
      "Add verification step (e.g., substitute back)",
      "Use display mode for complex expressions",
    ],
  },
  {
    number: 3,
    title: "Benchmark",
    subtitle: "Score on 5-Point Rubric",
    description: "Assign a quality score based on three dimensions. Solutions scoring below 3 are sent back for full rewrite.",
    checklist: [
      "Accuracy (1-5): All math is correct and complete",
      "Clarity (1-5): Explanations suit the university level",
      "Formatting (1-5): LaTeX renders perfectly, notation is consistent",
      "Compute final weighted score",
      "Classify: Pass (>=4) | Revise (3) | Reject (<3)",
    ],
  },
];

interface SOPWorkflowProps {
  activeStep: number;
  onStepClick: (step: number) => void;
}

export function SOPWorkflow({ activeStep, onStepClick }: SOPWorkflowProps) {
  return (
    <div className="space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center">
            <button
              onClick={() => onStepClick(step.number)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer",
                activeStep === step.number
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                  : activeStep > step.number
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              )}
            >
              <span className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                activeStep === step.number
                  ? "bg-white/20 text-white"
                  : activeStep > step.number
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300"
              )}>
                {activeStep > step.number ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </span>
              <span className="font-semibold text-sm hidden sm:inline">{step.title}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-8 sm:w-16 h-0.5 mx-1",
                activeStep > step.number
                  ? "bg-emerald-400"
                  : "bg-zinc-200 dark:bg-zinc-700"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Active Step Content */}
      {steps.map((step) => (
        activeStep === step.number && (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
          >
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  0{step.number}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                Checklist
              </h4>
              {step.checklist.map((item, i) => (
                <motion.label
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600 group-hover:border-blue-400 transition-colors flex items-center justify-center">
                    <svg className="w-3 h-3 text-transparent group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        )
      ))}
    </div>
  );
}
