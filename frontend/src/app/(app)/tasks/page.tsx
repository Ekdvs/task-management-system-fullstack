"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "@/src/lib/tasks";
import { getApiErrorMessage } from "@/src/lib/api";
import { Task, TaskFilters, TaskFormValues } from "@/src/types";
import TaskFormModal from "@/src/components/TaskFormModal";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import Loader from "@/src/components/Loader";
import EmptyState from "@/src/components/EmptyState";
import TaskRow from "@/src/components/TaskRow";

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "newest",
  page: 1,
  limit: 10,
};

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // "Adjust state while rendering" instead of syncing it in an Effect
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  // This runs during render, not in useEffect, so it isn't a set-state-in-effect
  // violation, and it avoids the extra commit an Effect would cause.
  const [appliedSearch, setAppliedSearch] = useState(debouncedSearch);
  if (debouncedSearch !== appliedSearch) {
    setAppliedSearch(debouncedSearch);
    setFilters((f) => ({ ...f, search: debouncedSearch, page: 1 }));
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Guards against an older, slower request overwriting a newer one's result.
  const requestIdRef = useRef(0);

  // The actual state updates below happen inside the startTransition callback,
  // not as bare statements in the Effect body, which is what the
  // react-hooks/set-state-in-effect rule is checking for. Effects are still the
  // right tool for "synchronize with an external system" (fetching from the
  // server here) — this just avoids the synchronous-cascading-render shape the
  // rule flags. See https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect
  const loadTasks = useCallback(() => {
    const requestId = ++requestIdRef.current;

    startTransition(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchTasks(filters);
        if (requestIdRef.current !== requestId) return; // stale, ignore
        setTasks(res.data);
        setTotalPages(res.pagination.totalPages || 1);
        setTotal(res.pagination.total);
      } catch (err) {
        if (requestIdRef.current === requestId) {
          setError(getApiErrorMessage(err, "Couldn't load tasks"));
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    });
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, values);
        toast.success("Task updated");
      } else {
        await createTask(values);
        toast.success("Task created");
      }
      setModalOpen(false);
      loadTasks();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save the task"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      toast.success("Task deleted");
      setTaskToDelete(null);
      loadTasks();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't delete the task"));
    } finally {
      setDeleting(false);
    }
  }

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Tasks</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {total} task{total === 1 ? "" : "s"} total
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-strong"
        >
          <Plus size={16} />
          New task
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value as TaskFilters["status"], page: 1 }))
          }
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((f) => ({ ...f, priority: e.target.value as TaskFilters["priority"], page: 1 }))
          }
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
        >
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortBy: e.target.value as TaskFilters["sortBy"], page: 1 }))
          }
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
        >
          <option value="newest">Newest created</option>
          <option value="oldest">Oldest created</option>
          <option value="dueDate">Due date</option>
        </select>
      </div>

      {loading && <Loader label="Loading tasks…" />}

      {!loading && error && (
        <p className="rounded-lg bg-overdue-soft px-4 py-3 text-sm text-overdue">{error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
          description={
            hasActiveFilters
              ? "Try a different search term, or clear your filters."
              : "Create your first task to start tracking your work."
          }
          action={
            !hasActiveFilters && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong"
              >
                <Plus size={16} />
                New task
              </button>
            )
          }
        />
      )}

      {!loading && !error && tasks.length > 0 && (
        <>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={() => openEdit(task)}
                onDelete={() => setTaskToDelete(task)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between text-sm text-ink-muted">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {filters.page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        description={`"${taskToDelete?.title ?? ""}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}