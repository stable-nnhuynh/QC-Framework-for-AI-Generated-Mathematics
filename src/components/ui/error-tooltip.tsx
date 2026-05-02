"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface ErrorTooltipProps {
  code: string;
  note: string;
}

export function ErrorTooltip({ code, note }: ErrorTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
              "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
              "font-mono text-xs font-bold cursor-help",
              "hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors",
              "ring-1 ring-red-200 dark:ring-red-800"
            )}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {code}
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            className={cn(
              "z-50 max-w-xs rounded-lg px-4 py-3 text-sm shadow-xl",
              "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900",
              "border border-zinc-700 dark:border-zinc-300",
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            <div className="font-bold text-red-400 dark:text-red-600 mb-1 font-mono">{code}</div>
            <p className="leading-relaxed">{note}</p>
            <TooltipPrimitive.Arrow className="fill-zinc-900 dark:fill-zinc-100" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
