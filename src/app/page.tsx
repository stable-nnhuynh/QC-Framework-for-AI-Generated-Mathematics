"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { TaxonomyTable } from "@/components/taxonomy-table";
import { SOPWorkflow } from "@/components/sop-workflow";
import { AuditCard } from "@/components/audit-card";
import { MathBlock } from "@/components/math-display";
import { QCWorkspace } from "@/components/qc-workspace";
import errorTaxonomy from "@/data/error-taxonomy.json";
import goldenDatasets from "@/data/golden-datasets.json";

const tabsList = [
  { value: "taxonomy", label: "Error Taxonomy", icon: TagIcon },
  { value: "sop", label: "SOP Workflow", icon: ClipboardIcon },
  { value: "case-study", label: "Case Studies", icon: BeakerIcon },
  { value: "qc-workspace", label: "QC Workspace", icon: WrenchIcon },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("taxonomy");
  const [sopStep, setSopStep] = useState(1);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const activeCase = goldenDatasets[activeCaseIndex];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              QC Framework for AI-Generated Mathematics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Nguyen Ngoc Huynh &mdash; Mathematics Content Specialist
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold",
              "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
              "hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors",
              "shadow-sm cursor-pointer"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Download PDF Report</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            AI Content Quality Assurance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-tight">
            Comprehensive QC Framework for{" "}
            <span className="text-blue-600 dark:text-blue-400">AI-Generated Mathematics</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
            A production-grade system for auditing, correcting, and benchmarking
            AI math solutions. Built as a personal project demonstrating production-grade QA workflows.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8"
        >
          {[
            { label: "Error Codes", value: "4", sub: "categories" },
            { label: "SOP Steps", value: "3", sub: "phases" },
            { label: "Case Studies", value: "2", sub: "annotated" },
            { label: "Rubric Scale", value: "5pt", sub: "benchmark" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center"
            >
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <div className="sticky top-[73px] z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Tabs.List className="flex gap-1 -mb-px">
              {tabsList.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all",
                      "cursor-pointer",
                      activeTab === tab.value
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>
          </div>
        </div>

        {/* Tab Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Tab 1: Error Taxonomy */}
          <Tabs.Content value="taxonomy" asChild>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Math Error Taxonomy (MET)
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  A classification system for common AI errors in university-level mathematics.
                  Click any row to expand the detailed description.
                </p>
              </div>
              <TaxonomyTable data={errorTaxonomy} />
            </motion.div>
          </Tabs.Content>

          {/* Tab 2: SOP Workflow */}
          <Tabs.Content value="sop" asChild>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Standard Operating Procedure
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  The 3-step expert workflow for auditing and correcting AI-generated math solutions.
                  Click each step to view the detailed checklist.
                </p>
              </div>
              <SOPWorkflow activeStep={sopStep} onStepClick={setSopStep} />
            </motion.div>
          </Tabs.Content>

          {/* Tab 3: Interactive Case Study */}
          <Tabs.Content value="case-study" asChild>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Interactive Case Studies
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Side-by-side comparison of AI errors vs. Expert corrections.
                  Hover over red error tags to see detailed explanations.
                </p>
              </div>

              {/* Case Selector */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {goldenDatasets.map((cs, i) => (
                  <button
                    key={cs.id}
                    onClick={() => setActiveCaseIndex(i)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer",
                      activeCaseIndex === i
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    Case {i + 1}: {cs.title}
                  </button>
                ))}
              </div>

              {/* Problem Statement + Audit */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCase.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 mb-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                          {activeCase.topic}
                        </span>
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                          {activeCase.title}
                        </h4>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          Source: {activeCase.source}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-100 dark:border-zinc-700/50">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
                        Problem Statement
                      </span>
                      <MathBlock
                        content={activeCase.problem}
                        className="text-zinc-800 dark:text-zinc-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Audit Card */}
                  <AuditCard
                    aiSteps={activeCase.aiOutput.steps}
                    expertSteps={activeCase.expertOutput.steps}
                    aiScore={activeCase.aiOutput.score}
                    expertScore={activeCase.expertOutput.score}
                    maxScore={activeCase.aiOutput.maxScore}
                    auditSummary={activeCase.auditSummary}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </Tabs.Content>

          {/* Tab 4: QC Workspace */}
          <Tabs.Content value="qc-workspace" asChild>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <QCWorkspace />
            </motion.div>
          </Tabs.Content>
        </main>
      </Tabs.Root>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Nguyen Ngoc Huynh &mdash; Mathematics Content Specialist Portfolio
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Personal Project &middot; OpenStax-aligned
          </p>
        </div>
      </footer>
    </div>
  );
}

function handleExportPDF() {
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      header, footer { position: static !important; }
      .no-print { display: none !important; }
      @page { margin: 1cm; size: A4; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => document.head.removeChild(style), 1000);
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function BeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
