import { useEffect, useRef, useState } from "react";
import { sections } from "../data/tasks";

// Updated theme colors matching the premium emerald glassmorphism
const EMERALD_LIGHT = "#34d399"; // emerald-400
const EMERALD_MAIN = "#10b981";  // emerald-500
const EMERALD_DARK = "#064e3b";  // emerald-900
const SURFACE_DARK = "#020604";

const W = 600;
const H = 200;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const N = 5;
const BAR_GAP = 28;
const BAR_W = (CHART_W - BAR_GAP * (N - 1)) / N;

function avgCompletion(s: typeof sections[0]) {
  return Math.round(s.tasks.reduce((sum, t) => sum + t.peratusan, 0) / s.tasks.length);
}

export function MainChart() {
  const [progress, setProgress] = useState(0); // 0→1 for bar grow animation
  const [scanX, setScanX] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const data = sections.map(s => ({
    name: s.name.replace("Seksyen ", "S"),
    value: avgCompletion(s),
  }));

  // Grow animation on mount
  useEffect(() => {
    let cancelled = false;
    const duration = 1200;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
      if (!cancelled) {
        setProgress(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, []);

  // Scanner sweep loop - slowed down and softened
  useEffect(() => {
    let cancelled = false;
    const duration = 4000; // Slower, more elegant sweep
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = ((ts - start) % duration) / duration;
      if (!cancelled) {
        setScanX(t * CHART_W);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, []);

  // Pulse subtle cycle for the LIVE badge
  useEffect(() => {
    let cancelled = false;
    const duration = 2000;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = ((ts - start) % duration) / duration;
      if (!cancelled) {
        setPulse(Math.sin(t * Math.PI * 2) * 0.5 + 0.5); // 0→1→0
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, []);

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="relative p-6 rounded-[24px] bg-glass-surface backdrop-blur-[24px] border border-glass-border shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
      
      {/* Subtle top edge white-green highlight embedded inside */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-1 relative z-10">
        <span className="text-xs uppercase tracking-wide font-medium text-emerald-100/70">
          Prestasi Keseluruhan — 5 Seksyen
        </span>
        <span 
          className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5"
          style={{ opacity: 0.7 + pulse * 0.3 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ opacity: 0.5 + pulse * 0.5 }} />
          LIVE
        </span>
      </div>
      <p className="text-[10px] text-emerald-200/40 mb-4 relative z-10">Hover untuk sorotan</p>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block overflow-visible relative z-10"
      >
        <defs>
          {/* Glass background for empty bar track */}
          <linearGradient id="bar-track" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020a06" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020a06" stopOpacity="0.1" />
          </linearGradient>

          {/* Fill gradient — sleek elegant emerald */}
          <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EMERALD_LIGHT} stopOpacity="0.8" />
            <stop offset="40%" stopColor={EMERALD_MAIN} stopOpacity="0.6" />
            <stop offset="100%" stopColor={EMERALD_DARK} stopOpacity="0.2" />
          </linearGradient>

          {/* Active fill gradient — brighter but not neon */}
          <linearGradient id="bar-fill-active" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
            <stop offset="50%" stopColor={EMERALD_LIGHT} stopOpacity="0.75" />
            <stop offset="100%" stopColor={EMERALD_DARK} stopOpacity="0.3" />
          </linearGradient>

          {/* Soft sweeping scanner reflection */}
          <linearGradient id="scanner" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor={EMERALD_LIGHT} stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Subtle drop shadow for hover tooltip */}
          <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid lines */}
          {yTicks.map(tick => {
            const y = CHART_H - (tick / 100) * CHART_H;
            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={0} y1={y} x2={CHART_W} y2={y}
                  stroke="rgba(16, 185, 129, 0.08)"
                  strokeWidth={1}
                />
                <text x={-10} y={y} textAnchor="end" dominantBaseline="middle"
                  fill="rgba(167, 243, 208, 0.4)" fontSize={9} className="font-sans font-medium" letterSpacing="0.5">
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = i * (BAR_W + BAR_GAP);
            const fullH = (d.value / 100) * CHART_H;
            const animH = fullH * progress;
            const y = CHART_H - animH;
            const isHov = hovered === i;

            return (
              <g key={`bar-${i}`}>
                {/* Empty Track (Glass background) */}
                <rect
                  x={x} y={0}
                  width={BAR_W} height={CHART_H}
                  rx={6}
                  fill="url(#bar-track)"
                  stroke="rgba(16, 185, 129, 0.1)"
                  strokeWidth="1"
                />

                {/* Data Fill */}
                <rect
                  x={x} y={y}
                  width={BAR_W} height={animH}
                  rx={6}
                  fill={isHov ? "url(#bar-fill-active)" : "url(#bar-fill)"}
                  style={{ transition: "fill 0.3s ease" }}
                />

                {/* Top highlight cap (creates 3D glass liquid effect) */}
                {animH > 0 && (
                  <rect
                    x={x + 1} y={y + 1}
                    width={BAR_W - 2} height={4}
                    rx={2}
                    fill="#ffffff"
                    opacity={isHov ? 0.6 : 0.2}
                    style={{ transition: "opacity 0.3s ease" }}
                  />
                )}

                {/* Value label on hover (Sleek pill instead of hard box) */}
                {isHov && (
                  <g style={{ transition: "opacity 0.2s" }}>
                    <rect
                      x={x + BAR_W / 2 - 24} y={y - 32}
                      width={48} height={22}
                      rx={11}
                      fill="rgba(4, 30, 18, 0.8)"
                      stroke="rgba(52, 211, 153, 0.4)"
                      strokeWidth={1}
                      filter="url(#tooltip-shadow)"
                    />
                    <text
                      x={x + BAR_W / 2} y={y - 20}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={EMERALD_LIGHT} fontSize={10} className="font-sans font-semibold tracking-wide"
                    >
                      {d.value}%
                    </text>
                  </g>
                )}

                {/* X-axis section name */}
                <text
                  x={x + BAR_W / 2} y={CHART_H + 16}
                  textAnchor="middle"
                  fill={isHov ? EMERALD_LIGHT : "rgba(167, 243, 208, 0.5)"}
                  fontSize={10} className="font-sans font-medium tracking-wide"
                  style={{ transition: "fill 0.3s" }}
                >
                  {d.name}
                </text>

                {/* Invisible Hit area for hover */}
                <rect
                  x={x - (BAR_GAP / 2)} y={0}
                  width={BAR_W + BAR_GAP} height={CHART_H + 20}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}

          {/* Scanner sweep gradient (Soft light passing over) */}
          <g style={{ pointerEvents: "none" }}>
            <rect
              x={scanX - 40} y={0}
              width={80} height={CHART_H}
              fill="url(#scanner)"
            />
          </g>

          {/* Bottom baseline */}
          <line
            x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H}
            stroke="rgba(16, 185, 129, 0.2)" strokeWidth={1}
          />
        </g>
      </svg>

      {/* Bottom value row (Data Grid) */}
      <div className="grid grid-cols-5 gap-4 mt-6 relative z-10 pt-2 border-t border-emerald-800/20">
        {data.map((d, i) => (
          <div key={`val-${i}`} className="text-center group transition-colors duration-300">
            <div className={`text-xl font-light tracking-tight transition-colors duration-300 ${
              hovered === i ? 'text-emerald-300' : 'text-emerald-100/80'
            }`}>
              {Math.round(d.value * progress)}%
            </div>
            <div className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 ${
              hovered === i ? 'text-emerald-400' : 'text-emerald-200/40'
            }`}>
              {d.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}