"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  className?: string;
  /** ms per typed character */
  typeMs?: number;
  /** ms a finished phrase stays before erasing */
  holdMs?: number;
  /** ms per erased character */
  eraseMs?: number;
}

/**
 * Types each phrase one character at a time, holds, erases, moves to the next.
 * With reduced motion the first phrase is shown at once and nothing animates.
 * Screen readers get the full list once via a visually hidden span.
 */
export default function Typewriter({ phrases, className = "", typeMs = 58, holdMs = 2400, eraseMs = 22 }: TypewriterProps) {
  const [text, setText] = useState("");
  const [holding, setHolding] = useState(false);
  const [reduced, setReduced] = useState(false);
  const key = phrases.join("\n");

  useEffect(() => {
    if (!phrases.length) return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      setReduced(true);
      setText(phrases[0]);
      return;
    }
    let i = 0;
    let j = 0;
    let erasing = false;
    let timer = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const chars = Array.from(phrases[i]);
      if (!erasing) {
        j += 1;
        setText(chars.slice(0, j).join(""));
        if (j >= chars.length) {
          erasing = true;
          setHolding(true);
          timer = window.setTimeout(step, holdMs);
          return;
        }
        timer = window.setTimeout(step, typeMs + Math.random() * 45);
      } else {
        setHolding(false);
        j -= 1;
        setText(chars.slice(0, j).join(""));
        if (j <= 0) {
          erasing = false;
          i = (i + 1) % phrases.length;
          timer = window.setTimeout(step, 420);
          return;
        }
        timer = window.setTimeout(step, eraseMs);
      }
    };
    timer = window.setTimeout(step, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, typeMs, holdMs, eraseMs]);

  return (
    <p className={className}>
      <span aria-hidden="true">{text}</span>
      {!reduced ? <span aria-hidden="true" className={`typewriter-caret ${holding ? "is-blinking" : ""}`} /> : null}
      <span className="sr-only">{phrases.join(" ")}</span>
    </p>
  );
}
