"use client"

import { AuthApi } from "@/lib/api";
import { useAssociateStore } from "@/stores/associate-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const { setAssociate, setIsAuthenticated } = useAssociateStore()
    const setToken = useAssociateStore((state) => state.setToken)

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: (data) => {
        console.log(data)
        setAssociate(data.data.associate)
        setToken(data.data.token)
        setIsAuthenticated(true)
        router.push("/associate/dashboard");
    },
  });
};