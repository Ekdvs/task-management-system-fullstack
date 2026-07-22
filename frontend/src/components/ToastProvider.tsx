"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          background: "#1C2128",
          color: "#F6F5F0",
          fontSize: "0.875rem",
          borderRadius: "8px",
          padding: "10px 14px",
        },
        success: { iconTheme: { primary: "#3F8F5F", secondary: "#F6F5F0" } },
        error: { iconTheme: { primary: "#C1443C", secondary: "#F6F5F0" } },
      }}
    />
  );
}
