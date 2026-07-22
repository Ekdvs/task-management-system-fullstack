import { LucideIcon } from "lucide-react";
import { cx } from "../lib/utils";


export default function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "brand" | "pending" | "progress" | "done" | "overdue";
}) {
  const accentClasses: Record<typeof accent, string> = {
    brand: "border-l-brand text-brand bg-brand-soft",
    pending: "border-l-pending text-pending bg-pending-soft",
    progress: "border-l-progress text-progress bg-progress-soft",
    done: "border-l-done text-done bg-done-soft",
    overdue: "border-l-overdue text-overdue bg-overdue-soft",
  };

  return (
    <div
      className={cx(
        "rounded-xl border-l-4 bg-surface p-4 shadow-sm border border-border",
        accentClasses[accent].split(" ")[0]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </p>
        <span
          className={cx(
            "flex h-7 w-7 items-center justify-center rounded-full",
            accentClasses[accent].split(" ").slice(1).join(" ")
          )}
        >
          <Icon size={14} strokeWidth={2.25} />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
