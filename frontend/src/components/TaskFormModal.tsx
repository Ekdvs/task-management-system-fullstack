"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Task, TaskFormValues } from "../types";
import { todayISODate } from "../lib/utils";


const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  priority: "",
  status: "",
  due_date: "",
};

function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    due_date: task.due_date.slice(0, 10),
  };
}

export default function TaskFormModal({
  open,
  task,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  task: Task | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
}) {
  const initialValues = task
    ? toFormValues(task)
    : EMPTY_FORM;


  const [values, setValues] =
    useState<TaskFormValues>(initialValues);


  const [errors, setErrors] =
    useState<Partial<Record<keyof TaskFormValues, string>>>({});

  if (!open) return null;

  function validate(): boolean {
    const next: Partial<Record<keyof TaskFormValues, string>> = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (!values.priority) next.priority = "Priority is required";
    if (!values.status) next.status = "Status is required";
    if (!values.due_date) {
      next.due_date = "Due date is required";
    } else if (values.due_date < todayISODate()) {
      next.due_date = "Due date cannot be earlier than today";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="task-form-title" className="font-display text-lg font-semibold text-ink">
            {task ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-sunken"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <Field label="Title" error={errors.title} required>
            <input
              type="text"
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              placeholder="e.g. Write onboarding docs"
              className={inputClass(Boolean(errors.title))}
              maxLength={255}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              placeholder="Add any useful context (optional)"
              rows={3}
              className={inputClass(false)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority" error={errors.priority} required>
              <select
                value={values.priority}
                onChange={(e) =>
                  setValues((v) => ({ ...v, priority: e.target.value as TaskFormValues["priority"] }))
                }
                className={inputClass(Boolean(errors.priority))}
              >
                <option value="">Select…</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </Field>

            <Field label="Status" error={errors.status} required>
              <select
                value={values.status}
                onChange={(e) =>
                  setValues((v) => ({ ...v, status: e.target.value as TaskFormValues["status"] }))
                }
                className={inputClass(Boolean(errors.status))}
              >
                <option value="">Select…</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </Field>
          </div>

          <Field label="Due date" error={errors.due_date} required>
            <input
              type="date"
              value={values.due_date}
              min={todayISODate()}
              onChange={(e) => setValues((v) => ({ ...v, due_date: e.target.value }))}
              className={inputClass(Boolean(errors.due_date))}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-muted hover:bg-surface-sunken"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong disabled:opacity-60"
            >
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-brand ${hasError ? "border-overdue" : "border-border"
    }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-overdue"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-overdue">{error}</span>}
    </label>
  );
}
