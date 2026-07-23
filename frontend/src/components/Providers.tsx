"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../context/AuthContext";
import ToastProvider from "./ToastProvider";
import ThemeToggle from "./ThemeToggle";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
          <span className="font-display text-lg font-semibold text-ink">
            Koncepthive
          </span>
          <ThemeToggle />
        </header>
        {children}
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}