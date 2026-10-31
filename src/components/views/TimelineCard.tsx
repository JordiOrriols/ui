import React from "react";
import { cn } from "../../lib/utils";
import { IconTooltip } from "../ui/icon-tooltip";

export interface TimelineColumn {
  id: string;
  label: string;
  group: string;
}
export interface TimelineMarker {
  id: string;
  label: string;
  caption: string;
  /** Position in columns, including fractional columns. */
  position: number;
  className?: string;
  captionClassName?: string;
}
export interface TimelineSpan {
  id: string;
  label: string;
  /** Half-open range in columns: [start, end). */
  start: number;
  end: number;
  className?: string;
}
export interface TimelineRow {
  id: string;
  label: React.ReactNode;
  accessibleLabel: string;
  group?: { id: string; label: string };
  spans: TimelineSpan[];
}

export function timelineColumns(labelWidth: number, count: number, columnWidth = 28) {
  return `${labelWidth}px ${count ? `repeat(${count}, minmax(${columnWidth}px, 1fr))` : "1fr"}`;
}

export function TimelineBar({ span, columnCount }: { span: TimelineSpan; columnCount: number }) {
  const start = Math.max(0, span.start);
  const end = Math.min(columnCount, span.end);
  if (columnCount <= 0 || end <= start) return null;
  return (
    <IconTooltip label={span.label}>
      <span
        role="img"
        aria-label={span.label}
        tabIndex={0}
        className={cn(
          "absolute h-6 rounded bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          span.className
        )}
        style={{
          left: `${(start / columnCount) * 100}%`,
          width: `${((end - start) / columnCount) * 100}%`,
        }}
      />
    </IconTooltip>
  );
}

export interface TimelineCardProps {
  title?: React.ReactNode;
  "aria-label": string;
  columns: TimelineColumn[];
  labelTitle: string;
  columnTitle: string;
  labelWidth?: number;
  columnWidth?: number;
  minWidth?: number;
  controls?: React.ReactNode;
  legend?: React.ReactNode;
  markers?: TimelineMarker[];
  rows?: TimelineRow[];
  empty?: React.ReactNode;
  /** Custom rows can preserve domain-specific drag/drop and context menus. */
  children?: React.ReactNode;
  className?: string;
}

export function TimelineCard({
  title,
  "aria-label": ariaLabel,
  columns,
  labelTitle,
  columnTitle,
  labelWidth = 220,
  columnWidth = 28,
  minWidth = 720,
  controls,
  legend,
  markers = [],
  rows = [],
  empty,
  children,
  className,
}: TimelineCardProps) {
  const grid = timelineColumns(labelWidth, columns.length, columnWidth);
  const groups: { label: string; start: number; count: number }[] = [];
  for (const [index, column] of columns.entries()) {
    const last = groups[groups.length - 1];
    if (last?.label === column.group) last.count++;
    else groups.push({ label: column.group, start: index, count: 1 });
  }
  return (
    <section
      aria-label={ariaLabel}
      className={cn("rounded-xl border border-border bg-card p-5", className)}
    >
      {(title || controls) && (
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-semibold">{title}</h2>}
          {controls}
        </header>
      )}
      {legend && (
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {legend}
        </div>
      )}
      <div className="overflow-x-auto">
        <div
          className="relative isolate"
          style={{ minWidth: Math.max(minWidth, labelWidth + columns.length * columnWidth) }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-0"
            style={{ left: labelWidth }}
          >
            {columns.map(
              (column, index) =>
                index > 0 && (
                  <div
                    key={column.id}
                    data-guide={column.group !== columns[index - 1]?.group ? "month" : "week"}
                    className={cn(
                      "absolute inset-y-0 border-l",
                      column.group !== columns[index - 1]?.group
                        ? "border-slate-400/60"
                        : "border-border/40"
                    )}
                    style={{ left: `${(index / columns.length) * 100}%` }}
                  />
                )
            )}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[5]"
            style={{ left: labelWidth }}
          >
            {markers
              .filter((marker) => marker.position >= 0 && marker.position < columns.length)
              .map((marker) => (
                <div
                  key={marker.id}
                  role="img"
                  aria-label={marker.label}
                  title={marker.label}
                  className={cn("absolute inset-y-0 border-l-2 border-blue-500", marker.className)}
                  style={{ left: `${(marker.position / columns.length) * 100}%` }}
                >
                  <span
                    className={cn(
                      "absolute top-0 max-w-32 -translate-x-1/2 truncate rounded bg-blue-500 px-1 text-[9px] font-medium text-white",
                      marker.captionClassName
                    )}
                  >
                    {marker.caption}
                  </span>
                </div>
              ))}
          </div>
          <div className="grid border-b border-border" style={{ gridTemplateColumns: grid }}>
            <div className="sticky left-0 z-10 bg-card px-2 py-1.5 text-xs font-semibold">
              {labelTitle}
            </div>
            {groups.map((group) => (
              <div
                key={group.start}
                className="border-l border-border px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground"
                style={{ gridColumn: `${group.start + 2} / ${group.start + group.count + 2}` }}
              >
                {group.label}
              </div>
            ))}
          </div>
          <div className="grid border-b border-border" style={{ gridTemplateColumns: grid }}>
            <div className="sticky left-0 z-10 bg-card px-2 text-xs">{columnTitle}</div>
            {columns.map((column) => (
              <div
                key={column.id}
                className="border-l border-border/40 px-1 py-1 text-center text-[10px] text-muted-foreground/60"
              >
                {column.label}
              </div>
            ))}
          </div>
          {children ??
            (rows.length ? (
              rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  {row.group && row.group.id !== rows[index - 1]?.group?.id && (
                    <div
                      role="heading"
                      aria-level={3}
                      className="grid border-b border-border/60 bg-muted/40"
                      style={{ gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` }}
                    >
                      <span className="sticky left-0 z-10 block bg-muted px-2 py-2 text-[11px] font-semibold uppercase tracking-wide">
                        {row.group.label}
                      </span>
                    </div>
                  )}
                  <div
                    aria-label={row.accessibleLabel}
                    className="grid border-b border-border/60"
                    style={{ gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` }}
                  >
                    <div className="sticky left-0 z-10 min-w-0 bg-card px-2 py-2 text-sm font-medium">
                      {row.label}
                    </div>
                    <div className="relative z-0 flex min-h-10 items-center">
                      {row.spans.map((span) => (
                        <TimelineBar key={span.id} span={span} columnCount={columns.length} />
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="py-4 text-sm text-muted-foreground">{empty}</div>
            ))}
        </div>
      </div>
    </section>
  );
}
