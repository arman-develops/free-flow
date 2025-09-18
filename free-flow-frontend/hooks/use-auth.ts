"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../lib/store/auth-store";
import { authApi } from "../lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useLogin = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push("/dashboard");
    },
  });
};

export const useSignup = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push("/");
    },
  });
};

export const useAuthVerification = () => {
  const { token, logout, setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth-verify", token],
    queryFn: () => authApi.verifyToken(token!),
    enabled: !!token,
    retry: false,
  });

  // Handle success and error cases with useEffect
  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data.user);
    }
  }, [query.isSuccess, query.data, setUser]);

  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError, logout]);

  return query;
};
