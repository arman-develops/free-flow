import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api"

export const useProjectsByClient = (clientId: string) => {
  return useQuery({
    queryKey: ["projects", "client", clientId],
    queryFn: () => projectsApi.getProjectByClientID(clientId),
    enabled: !!clientId,
  })
}

export const useProjectByID = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", "client", projectId],
    queryFn: () => projectsApi.getProjectByID(projectId),
    enabled: !!projectId,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["projects", "client"] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectsApi.updateProject(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })
}
