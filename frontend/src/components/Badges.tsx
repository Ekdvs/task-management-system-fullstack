import { cx } from "../lib/utils";
import { TaskStatus, TaskPriority } from "../types";


const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: "bg-pending-soft text-pending",
  "In Progress": "bg-progress-soft text-progress",
  Completed: "bg-done-soft text-done",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

const PRIORITY_DOT: Record<TaskPriority, string> = {
  Low: "bg-low",
  Medium: "bg-medium",
  High: "bg-high",
};

export function PriorityTag({ priority }: { priority: TaskPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted whitespace-nowrap">
      <span className={cx("h-2 w-2 rounded-full", PRIORITY_DOT[priority])} />
      {priority}
    </span>
  );
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-overdue-soft px-2.5 py-1 text-xs font-medium text-overdue whitespace-nowrap">
      Overdue
    </span>
  );
}
