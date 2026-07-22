"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";


export default function Home() {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isReady, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Loader />
    </div>
  );
}
