import { memo, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export type RadarSeries = {
  id: string;
  label: string;
  levels: Record<string, number>;
  color: string;
  dashed?: boolean;
  fill?: number;
  primary?: boolean;
};

export interface RadarChartProps {
  axes: readonly string[];
  maxLevel?: number;
  series: RadarSeries[];
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
  label: string;
  downloadLabel?: string;
  onDownload?: (svg: SVGSVGElement, size: number) => void;
}

function RadarChartView({
  axes,
  maxLevel = 5,
  series,
  size = 300,
  showLabels = true,
  showLegend = true,
  className = "",
  label,
  downloadLabel,
  onDownload,
}: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const center = size / 2;
  const maxRadius = size / 2 - (showLabels ? 50 : 20);
  const visibleSeries = series.filter((item) =>
    Object.values(item.levels).some((value) => value > 0)
  );
  const drawOrder = [...visibleSeries].sort((a, b) => Number(!!a.primary) - Number(!!b.primary));
  const pointAt = (index: number, radius: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  };
  const point = (index: number, level: number) => pointAt(index, (level / maxLevel) * maxRadius);
  const pathFor = (levels: Record<string, number>) =>
    axes
      .map((axis, index) => {
        const p = point(index, levels[axis] || 0);
        return `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ") + " Z";
  const rings = Array.from({ length: maxLevel }, (_, index) => {
    const level = index + 1;
    return (
      axes
        .map((_, axisIndex) => {
          const p = point(axisIndex, level);
          return `${axisIndex === 0 ? "M" : "L"} ${p.x} ${p.y}`;
        })
        .join(" ") + " Z"
    );
  });
  return (
    <div className={`flex flex-col items-center relative ${className}`}>
      {onDownload && (
        <Button
          eventId="radar_chart_download"
          onClick={() => {
            if (svgRef.current) onDownload(svgRef.current, size);
          }}
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 z-10"
          title={downloadLabel}
          aria-label={downloadLabel}
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-full overflow-visible"
        role="img"
        aria-label={label}
      >
        {rings.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke={index === rings.length - 1 ? "#d1d5db" : "#e5e7eb"}
            strokeWidth={index === rings.length - 1 ? "1.5" : "1"}
            opacity={0.7}
          />
        ))}
        {axes.map((axis, index) => {
          const end = point(index, maxLevel);
          return (
            <line
              key={axis}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#9ca3af"
              strokeWidth="1.2"
              opacity="0.6"
            />
          );
        })}
        {drawOrder.map((s) => (
          <path
            key={`area-${s.id}`}
            data-series={s.id}
            d={pathFor(s.levels)}
            fill={s.fill ? s.color : "none"}
            fillOpacity={s.fill}
            stroke={s.color}
            strokeWidth={s.primary ? "3" : "2.5"}
            strokeDasharray={s.dashed ? "6 4" : undefined}
            opacity={s.primary ? "0.95" : "0.85"}
          />
        ))}
        {drawOrder.map((s) =>
          axes.map((axis, index) => {
            const level = s.levels[axis] || 0;
            if (level === 0) return null;
            const p = point(index, level);
            return (
              <g key={`${s.id}-${index}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={s.primary ? "7" : "6"}
                  fill={s.color}
                  fillOpacity={0.15}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={s.primary ? "5.5" : "4.5"}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={s.primary ? "2.5" : "2"}
                />
              </g>
            );
          })
        )}
        {showLabels &&
          axes.map((axis, index) => {
            const angleDeg = (360 * index) / axes.length;
            const p = pointAt(index, maxRadius + 10);
            const textAnchor =
              angleDeg > 315 || angleDeg < 45
                ? "middle"
                : angleDeg < 135
                  ? "start"
                  : angleDeg < 225
                    ? "middle"
                    : "end";
            const dominantBaseline =
              angleDeg > 315 || angleDeg < 45
                ? "auto"
                : angleDeg >= 135 && angleDeg < 225
                  ? "hanging"
                  : "middle";
            return (
              <text
                key={axis}
                x={p.x}
                y={p.y}
                textAnchor={textAnchor}
                dominantBaseline={dominantBaseline}
                className="text-xs font-semibold fill-slate-500"
                letterSpacing="0.5"
              >
                {axis}
              </text>
            );
          })}
        {showLabels &&
          Array.from({ length: maxLevel }, (_, index) => {
            const p = point(0, index + 1);
            return (
              <text
                key={index}
                x={p.x - 12}
                y={p.y}
                className="text-[10px] fill-slate-400"
                dominantBaseline="middle"
                textAnchor="end"
              >
                {index + 1}
              </text>
            );
          })}
      </svg>
      {showLegend && visibleSeries.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
          {visibleSeries.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${s.dashed ? "border-2 border-dashed" : ""}`}
                style={s.dashed ? { borderColor: s.color } : { backgroundColor: s.color }}
              />
              <span className="text-xs text-slate-600">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const RadarChart = memo(RadarChartView);
