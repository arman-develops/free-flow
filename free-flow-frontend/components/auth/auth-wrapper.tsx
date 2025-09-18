"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import DashboardLayout from "../dashboard/DashboardLayout";

const publicRoutes = ["/login", "/signup"];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  // Show loading or redirect logic
  // if (!isAuthenticated) {
  //   return null // or a loading spinner
  // }

  // // if (isAuthenticated) {
  // //   return null // or a loading spinner
  // // }

  return (
    <>
      {isAuthenticated ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        children
      )}
    </>
  );
}
