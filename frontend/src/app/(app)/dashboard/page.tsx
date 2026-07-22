"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
} from "lucide-react";

import { DashboardStats } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";
import { fetchDashboardStats } from "@/src/lib/tasks";
import { getApiErrorMessage } from "@/src/lib/api";
import Loader from "@/src/components/Loader";
import StatCard from "@/src/components/StatCard";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const data = await fetchDashboardStats();

        if (active) {
          setStats(data);
        }
      } catch (err) {
        if (active) {
          setError(
            getApiErrorMessage(err, "Couldn't load your dashboard")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {firstName ? `Hi, ${firstName}` : "Dashboard"}
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Here&apos;s where things stand across your tasks.
        </p>
      </div>

      {loading && <Loader label="Loading your dashboard…" />}

      {!loading && error && (
        <p className="rounded-lg bg-overdue-soft px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Total"
              value={stats.totalTasks}
              icon={ListTodo}
              accent="brand"
            />

            <StatCard
              label="Pending"
              value={stats.pendingTasks}
              icon={Circle}
              accent="pending"
            />

            <StatCard
              label="In progress"
              value={stats.inProgressTasks}
              icon={Clock3}
              accent="progress"
            />

            <StatCard
              label="Completed"
              value={stats.completedTasks}
              icon={CheckCircle2}
              accent="done"
            />

            <StatCard
              label="Overdue"
              value={stats.overdueTasks}
              icon={AlertTriangle}
              accent="overdue"
            />
          </div>

          <div className="mt-8 rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-base font-semibold text-ink">
              Ready to get to work?
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Jump into your task list to create, update, search, filter, or sort.
            </p>

            <Link
              href="/tasks"
              className="mt-4 inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong"
            >
              Go to tasks
            </Link>
          </div>
        </>
      )}
    </div>
  );
}