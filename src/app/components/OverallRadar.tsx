import { sections } from '../data/tasks';

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 80;
const LEVELS = 4;

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function polyPoints(values: number[], maxVal: number, r: number) {
  return values
    .map((v, i) => {
      const angle = (360 / values.length) * i;
      const pt = polarToXY(angle, (v / maxVal) * r);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

export function OverallRadar() {
  const data = sections.map(s => ({
    label: s.name.replace('Seksyen ', 'S'),
    fullName: s.fullName,
    value: Math.round(s.tasks.reduce((sum, t) => sum + t.peratusan, 0) / s.tasks.length),
    color: s.color,
  }));

  const overall = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const n = data.length;
  const angles = data.map((_, i) => (360 / n) * i);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700/60 h-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-bold text-sm">Prestasi Keseluruhan</h3>
        <span className="text-cyan-400 font-black text-xl">{overall}%</span>
      </div>
      <p className="text-gray-500 text-xs mb-3">Purata 5 Seksyen • 165 Tugasan</p>

      <div className="flex justify-center">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Grid rings */}
          {Array.from({ length: LEVELS }).map((_, li) => {
            const frac = (li + 1) / LEVELS;
            const pts = angles
              .map(a => {
                const pt = polarToXY(a, R * frac);
                return `${pt.x},${pt.y}`;
              })
              .join(' ');
            return (
              <polygon
                key={`grid-${li}`}
                points={pts}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {angles.map((a, i) => {
            const pt = polarToXY(a, R);
            return (
              <line
                key={`axis-${i}`}
                x1={CX} y1={CY}
                x2={pt.x} y2={pt.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polyPoints(data.map(d => d.value), 100, R)}
            fill="rgba(6,182,212,0.15)"
            stroke="#06b6d4"
            strokeWidth={2}
          />

          {/* Data dots */}
          {data.map((d, i) => {
            const pt = polarToXY(angles[i], (d.value / 100) * R);
            return (
              <circle
                key={`dot-${i}`}
                cx={pt.x} cy={pt.y} r={4}
                fill="#06b6d4"
                stroke="#0e7490"
                strokeWidth={1.5}
              />
            );
          })}

          {/* Labels */}
          {data.map((d, i) => {
            const labelR = R + 18;
            const pt = polarToXY(angles[i], labelR);
            return (
              <text
                key={`label-${i}`}
                x={pt.x} y={pt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#9ca3af"
                fontSize={10}
                fontWeight={600}
              >
                {d.label}
              </text>
            );
          })}

          {/* Value labels near dots */}
          {data.map((d, i) => {
            const valR = R + 5;
            const pt = polarToXY(angles[i], (d.value / 100) * R - valR);
            const dotPt = polarToXY(angles[i], (d.value / 100) * R);
            // Place value slightly inside the dot toward center
            const vx = CX + (dotPt.x - CX) * 0.72;
            const vy = CY + (dotPt.y - CY) * 0.72;
            return (
              <text
                key={`val-${i}`}
                x={vx} y={vy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={d.color}
                fontSize={9}
                fontWeight={700}
              >
                {d.value}%
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-5 gap-1 mt-1">
        {data.map(d => (
          <div key={`leg-${d.label}`} className="text-center">
            <div className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</div>
            <div className="text-gray-600 text-[10px]">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
