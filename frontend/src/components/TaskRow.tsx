import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge, PriorityTag, OverdueBadge } from "./Badges";
import { Task } from "../types";
import { dueLabel, isOverdue } from "../lib/utils";

export default function TaskRow({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue = isOverdue(task);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition hover:border-brand/40 sm:flex sm:items-center sm:gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-medium text-ink">{task.title}</h3>
          {overdue ? <OverdueBadge /> : <StatusBadge status={task.status} />}
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <PriorityTag priority={task.priority} />
          <span
            className={`text-xs font-medium ${overdue ? "text-overdue" : "text-ink-muted"}`}
          >
            {dueLabel(task)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${task.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition hover:border-brand hover:text-brand"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${task.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition hover:border-overdue hover:text-overdue"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
