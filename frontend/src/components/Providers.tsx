"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../context/AuthContext";
import ToastProvider from "./ToastProvider";

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
        {children}
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}