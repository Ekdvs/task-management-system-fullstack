"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader label="Checking your session…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-md p-1.5 text-ink hover:bg-surface-sunken"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <p className="font-display text-base font-semibold">Tasklog</p>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
