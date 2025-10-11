import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { clientsApi } from "@/lib/api"
import { queryClient } from '../lib/query-client';

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.getClientsByUserID(),
  })
}

export const useCreateClient = () => {

  return useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export const useUpdateClient = () => {
  return useMutation({
    mutationFn: ({id, data}: {id:string, data:any}) => clientsApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export const useDeleteClient = () => {
  return useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}