"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cx } from "../lib/utils";



const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
];

export default function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-brand-strong text-white">
      
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div>
          <p className="font-display text-lg font-semibold leading-none tracking-tight">
            Tasklog
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">
            Koncepthive
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? "—"}
            </p>
            <p className="truncate text-xs text-white/50">{user?.email ?? ""}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} strokeWidth={2} />
          Log out
        </button>
      </div>
    </div>
  );
}
