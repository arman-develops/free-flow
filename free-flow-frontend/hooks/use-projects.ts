import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api"
import { queryClient } from '../lib/query-client';

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
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["projects", "client"] })
    },
  })
}

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectsApi.updateProject(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["projects", "project_stats", variables.id] })
    },
  })
}

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "project_stats"] })
    },
  })
}