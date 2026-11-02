"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { mountControlScene, STAGES, type SceneHandle, type Stage } from "@/lib/three/controlScene";
import { SCENE_STEPS } from "@/lib/scene";

interface ControlSceneProps {
  stage: Stage;
  onStage: (stage: Stage) => void;
  className?: string;
}

/**
 * React wrapper around the three.js control scene. The four step chips are plain HTML pinned to
 * the scene's anchors every frame through `project()`, so they stay crisp and clickable. A tap
 * on the canvas advances the loop; a chip jumps straight to its step.
 *
 * The loading placeholder sits under the canvas and never takes pointer events.
 */
export default function ControlScene({ stage, onStage, className = "" }: ControlSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<Map<Stage, HTMLButtonElement>>(new Map());
  const handleRef = useRef<SceneHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { resolvedTheme } = useTheme();
  const onStageRef = useRef(onStage);
  onStageRef.current = onStage;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    let disposed = false;
    let raf = 0;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let offVis: (() => void) | null = null;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    mountControlScene(canvas, {
      theme: resolvedTheme === "dark" ? "dark" : "light",
      reducedMotion: reduced,
      onStage: (s) => onStageRef.current(s)
    })
      .then((h) => {
        if (disposed) {
          h.dispose();
          return;
        }
        handleRef.current = h;
        const size = () => h.resize(wrap.clientWidth, wrap.clientHeight);
        size();
        ro = new ResizeObserver(size);
        ro.observe(wrap);
        io = new IntersectionObserver(([e]) => h.setPaused(!e.isIntersecting), { threshold: 0.05 });
        io.observe(wrap);
        const onVis = () => h.setPaused(document.hidden);
        document.addEventListener("visibilitychange", onVis);
        offVis = () => document.removeEventListener("visibilitychange", onVis);

        // chips sit above their anchor, centred, and never leave the box
        const place = () => {
          raf = requestAnimationFrame(place);
          const W = wrap.clientWidth;
          const H = wrap.clientHeight;
          for (const s of STAGES) {
            const el = chipRefs.current.get(s);
            if (!el) continue;
            const p = h.project(s);
            const lw = el.offsetWidth;
            const lh = el.offsetHeight;
            const x = Math.min(W - lw - 4, Math.max(4, (p.left / 100) * W - lw / 2));
            const y = Math.min(H - lh - 4, Math.max(4, (p.top / 100) * H - lh));
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.opacity = "1";
          }
        };
        place();
        setReady(true);
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      offVis?.();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
    // mount once — theme and stage are pushed through the handle below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleRef.current?.setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10%] rounded-[40%] transition-opacity duration-3 ease-soft"
        style={{
          opacity: ready ? 0 : 1,
          background: "radial-gradient(ellipse at 50% 55%, hsl(var(--glow) / 0.28), hsl(var(--glow) / 0.06) 55%, transparent 72%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative block h-full w-full transition-opacity duration-3 ease-soft"
        style={{ opacity: ready ? 1 : 0 }}
        aria-label="control loop scene"
        role="img"
      />
      {!failed &&
        SCENE_STEPS.map((s, i) => {
          const on = stage === s.id;
          return (
            <button
              key={s.id}
              type="button"
              ref={(el) => {
                if (el) chipRefs.current.set(s.id, el);
                else chipRefs.current.delete(s.id);
              }}
              onClick={() => handleRef.current?.setStage(i)}
              aria-pressed={on}
              className={`absolute whitespace-nowrap rounded-sm border px-1.5 py-[3px] font-mono text-[0.625rem] font-medium uppercase leading-none tracking-[0.16em] backdrop-blur-sm transition-[opacity,background-color,color,border-color,transform] duration-2 ease-soft ${
                on
                  ? "scale-105 border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background/80 text-text-2 hover:border-primary hover:text-foreground"
              }`}
              style={{ opacity: 0, left: "50%", top: "50%" }}
            >
              <span className="mr-1.5 opacity-70">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </button>
          );
        })}
    </div>
  );
}
