"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorItem {
  code: string;
  category: string;
  description: string;
  severity: string;
  color: string;
  icon: string;
}

interface TaxonomyTableProps {
  data: ErrorItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  brain: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  calculator: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  "book-open": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export function TaxonomyTable({ data }: TaxonomyTableProps) {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <motion.div
          key={item.code}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          <button
            onClick={() => setExpandedCode(expandedCode === item.code ? null : item.code)}
            className={cn(
              "w-full text-left rounded-xl border p-4 transition-all duration-200",
              "hover:shadow-md hover:scale-[1.005]",
              "bg-white dark:bg-zinc-900",
              expandedCode === item.code
                ? "border-zinc-300 dark:border-zinc-600 shadow-md"
                : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}18`, color: item.color }}
              >
                {iconMap[item.icon] || iconMap.brain}
              </div>

              {/* Code & Category */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    {item.code}
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Severity */}
              <span
                className={cn(
                  "flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full",
                  item.severity === "High"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                )}
              >
                {item.severity}
              </span>

              {/* Expand arrow */}
              <motion.svg
                className="w-5 h-5 text-zinc-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ rotate: expandedCode === item.code ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>

            <AnimatePresence>
              {expandedCode === item.code && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
