import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { associatesApi } from "@/lib/api"

export function useAssociates() {
  return useQuery({
    queryKey: ["associates"],
    queryFn: associatesApi.getAssociatesByUserID,
  })
}

export function useAssociate(id: string) {
  return useQuery({
    queryKey: ["associate", id],
    queryFn: () => associatesApi.getAssociateByID(id),
    enabled: !!id,
  })
}

export function useCreateAssociate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: associatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associates"] })
    },
  })
}

export function useUpdateAssociate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => associatesApi.updateAssociate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["associates"] })
      queryClient.invalidateQueries({ queryKey: ["associate", variables.id] })
    },
  })
}
