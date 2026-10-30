"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function CodeBlock({ children, language, copyLabel, copiedLabel }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="mono">{language || "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="mono inline-flex items-center gap-1 rounded-md px-2 py-1 text-text-2 transition-colors duration-1 hover:bg-accent hover:text-foreground"
          aria-label={copyLabel}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
