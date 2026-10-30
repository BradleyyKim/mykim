/**
 * A small generated mark per post — concentric rings whose hue comes from the category and
 * whose gaps come from the slug. Consistent, cheap, and it doesn't pretend to be an illustration.
 */
const CATEGORY_HUE: Record<string, number> = {
  "logging-mind": 330,
  "develop-knowledge": 235,
  "deploy-life": 190,
  "debug-routine": 40
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface PostMarkProps {
  slug: string;
  category?: string | null;
  size?: number;
  className?: string;
}

export default function PostMark({ slug, category, size = 56, className = "" }: PostMarkProps) {
  const hue = CATEGORY_HUE[category ?? ""] ?? 235;
  const h = hash(slug);
  const rings = [0, 1, 2].map((i) => {
    const r = 9 + i * 7;
    const start = ((h >> (i * 8)) & 255) / 255; // 0..1
    const len = 0.35 + (((h >> (i * 8 + 4)) & 15) / 15) * 0.45; // 0.35..0.8
    const c = 2 * Math.PI * r;
    return { r, dash: `${c * len} ${c}`, offset: -c * start, i };
  });
  const dotA = ((h >> 2) & 63) / 63;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ ["--mark" as string]: `hsl(${hue} 80% 58%)` }}
    >
      <defs>
        <radialGradient id={`g-${h}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue} 80% 60%)`} stopOpacity="0.28" />
          <stop offset="100%" stopColor={`hsl(${hue} 80% 60%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`hsl(${hue} 70% 55% / 0.08)`} />
      <circle cx="32" cy="32" r="26" fill={`url(#g-${h})`} />
      {rings.map(({ r, dash, offset, i }) => (
        <circle
          key={i}
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={`hsl(${hue} 75% ${56 - i * 6}%)`}
          strokeWidth={i === 0 ? 2.2 : 1.4}
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          opacity={1 - i * 0.22}
        />
      ))}
      <circle cx="32" cy="32" r="3" fill={`hsl(${hue} 80% 58%)`} />
      <circle cx={32 + Math.cos(dotA * 6.28) * 23} cy={32 + Math.sin(dotA * 6.28) * 23} r="2" fill={`hsl(${hue} 80% 58%)`} />
    </svg>
  );
}
