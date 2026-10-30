"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { mountGlobe, type GlobeHandle } from "@/lib/three/globe";
import type { Site } from "@/lib/sites";
import type { Locale } from "@/i18n";

interface GlobeProps {
  sites: Site[];
  /** kept for the detail copy; labels on the globe itself are always the English site name */
  locale: Locale;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** initial view */
  lat?: number;
  lng?: number;
  zoom?: number;
  idleSpin?: number;
  className?: string;
  /** below this canvas width only the selected site and its project siblings get labels (dense clusters) */
  compactBelow?: number;
}

/**
 * React wrapper around the three.js globe. Labels are plain HTML positioned from
 * `project()` every frame, so they stay crisp and clickable on any screen.
 *
 * The loading placeholder sits *under* the canvas and never takes pointer events — an earlier
 * version painted it above the canvas (positioned element over a static one) and swallowed drags.
 */
export default function Globe({ sites, selectedId, onSelect, lat, lng, zoom, idleSpin, className = "", compactBelow = 0 }: GlobeProps) {
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const handleRef = useRef<GlobeHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { resolvedTheme } = useTheme();
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

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

    mountGlobe(canvas, {
      markers: sites.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, color: s.color, primary: s.primary })),
      lat,
      lng,
      zoom,
      idleSpin,
      theme: resolvedTheme === "dark" ? "dark" : "light",
      reducedMotion: reduced,
      onSelect: (id) => onSelectRef.current?.(id)
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

        // Labels sit to the right of their marker; when that would leave the canvas (narrow
        // screens, markers near the limb) they flip to the left, and never leave the box vertically.
        const placeLabels = () => {
          raf = requestAnimationFrame(placeLabels);
          const W = wrap.clientWidth;
          const H = wrap.clientHeight;
          const compact = compactBelow > 0 && W < compactBelow;
          const sel = sites.find((x) => x.id === selectedRef.current);
          for (const s of sites) {
            const el = labelRefs.current.get(s.id);
            if (!el) continue;
            if (compact && !(sel ? s.id === sel.id || (s.projectId && s.projectId === sel.projectId) : s.primary)) {
              el.style.opacity = "0";
              el.style.pointerEvents = "none";
              continue;
            }
            const p = h.project(s.lat, s.lng);
            const [dx, dy] = s.labelOffset ?? [0, 0];
            const lw = el.offsetWidth;
            const lh = el.offsetHeight;
            const mx = (p.left / 100) * W;
            let x = mx + dx;
            if (x + lw + 6 > W) x = Math.max(4, mx - dx - lw);
            const y = Math.min(H - lh / 2 - 4, Math.max(lh / 2 + 4, (p.top / 100) * H + dy));
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.opacity = p.visible ? "1" : "0";
            el.style.pointerEvents = p.visible ? "auto" : "none";
          }
        };
        placeLabels();
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
    // mount once per site set — theme/selection are pushed through the handle below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites]);

  useEffect(() => {
    handleRef.current?.setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  useEffect(() => {
    handleRef.current?.setSelected(selectedId ?? null);
    if (!selectedId) return;
    const s = sites.find((x) => x.id === selectedId);
    if (s) handleRef.current?.flyTo(s.lat, s.lng);
  }, [selectedId, sites]);

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`}>
      {/* placeholder while textures load — a soft disc so the layout never jumps */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6%] rounded-full transition-opacity duration-3 ease-soft"
        style={{
          opacity: ready ? 0 : 1,
          background: "radial-gradient(circle at 35% 30%, hsl(var(--glow) / 0.35), hsl(var(--glow) / 0.08) 55%, transparent 72%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative block h-full w-full transition-opacity duration-3 ease-soft"
        style={{ opacity: ready ? 1 : 0 }}
        aria-label="globe"
        role="img"
      />
      {!failed &&
        sites.map((s) => {
          const on = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              ref={(el) => {
                if (el) labelRefs.current.set(s.id, el);
                else labelRefs.current.delete(s.id);
              }}
              onClick={() => onSelect?.(s.id)}
              className={`absolute -translate-y-1/2 whitespace-nowrap rounded-sm border px-1.5 py-[3px] font-mono text-[0.625rem] font-medium uppercase leading-none tracking-[0.16em] backdrop-blur-sm transition-[opacity,background-color,color,border-color] duration-2 ease-soft ${
                on
                  ? "border-brand2 bg-brand2 text-[hsl(222_47%_8%)]"
                  : "border-brand2/40 bg-[hsl(222_47%_8%/0.72)] text-[hsl(190_100%_90%)] hover:border-brand2 hover:text-white"
              }`}
              style={{ opacity: 0, left: "50%", top: "50%" }}
            >
              <span
                className={`mr-1.5 inline-block h-1 w-1 rounded-full align-middle ${on ? "bg-[hsl(222_47%_8%)]" : s.primary ? "bg-[#ffc24a]" : "bg-brand2"}`}
                aria-hidden="true"
              />
              {s.label.en}
            </button>
          );
        })}
    </div>
  );
}
