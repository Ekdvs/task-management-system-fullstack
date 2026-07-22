import { Task } from "../types";


export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayISODate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Whether a task is overdue: not completed and due date is before today. */
export function isOverdue(task: Pick<Task, "status" | "due_date">) {
  if (task.status === "Completed") return false;
  const due = new Date(task.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

/** Human, relative label for a due date e.g. "Due today", "Overdue by 3 days". */
export function dueLabel(task: Pick<Task, "status" | "due_date">) {
  const due = new Date(task.due_date);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (task.status === "Completed") return formatDate(task.due_date);
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays > 1) return `Due in ${diffDays} days`;
  if (diffDays === -1) return "Overdue by 1 day";
  return `Overdue by ${Math.abs(diffDays)} days`;
}
