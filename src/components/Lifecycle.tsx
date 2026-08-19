import { LIFECYCLE, type Phase } from "../data";
import { cx } from "./ui";

export function Lifecycle({ current, daysToInspection }: { current: Phase; daysToInspection: number }) {
  const idx = LIFECYCLE.indexOf(current);
  return (
    <div className="flex flex-wrap items-stretch gap-1.5">
      {LIFECYCLE.map((stage, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={stage} className="flex min-w-0 flex-1 flex-col">
            <div
              className={cx(
                "h-1.5 rounded-full transition-colors",
                done && "bg-gilead-red/45",
                active && "bg-gilead-red",
                !done && !active && "bg-line"
              )}
            />
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cx(
                  "flex size-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  done && "bg-gilead-red/15 text-gilead-red",
                  active && "bg-gilead-red text-white",
                  !done && !active && "bg-canvas text-muted border border-line"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={cx("truncate text-xs", active ? "font-semibold text-ink" : "text-gilead-gray")}>{stage}</span>
            </div>
            {active && current === "Prep Scheduled" && daysToInspection > 0 && (
              <span className="mt-1 pl-6 text-[11px] font-medium text-gilead-red">{daysToInspection} days to inspection</span>
            )}
            {active && current === "Conduct" && daysToInspection === 0 && (
              <span className="mt-1 pl-6 text-[11px] font-medium text-info">Inspection in progress today</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
