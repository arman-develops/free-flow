import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 0.05, // half a minute
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
