"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathDisplayProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function MathDisplay({ math, display = false, className = "" }: MathDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = math;
        }
      }
    }
  }, [math, display]);

  return <span ref={ref} className={className} />;
}

interface MathBlockProps {
  content: string;
  className?: string;
}

export function MathBlock({ content, className = "" }: MathBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g);
    el.innerHTML = "";

    parts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const mathStr = part.slice(2, -2).trim();
        const span = document.createElement("div");
        span.className = "my-3";
        try {
          katex.render(mathStr, span, { displayMode: true, throwOnError: false, strict: false });
        } catch {
          span.textContent = mathStr;
        }
        el.appendChild(span);
      } else if (part.startsWith("$") && part.endsWith("$")) {
        const mathStr = part.slice(1, -1).trim();
        const span = document.createElement("span");
        try {
          katex.render(mathStr, span, { displayMode: false, throwOnError: false, strict: false });
        } catch {
          span.textContent = mathStr;
        }
        el.appendChild(span);
      } else if (part.trim()) {
        const span = document.createElement("span");
        span.textContent = part;
        el.appendChild(span);
      }
    });
  }, [content]);

  return <div ref={ref} className={className} />;
}
