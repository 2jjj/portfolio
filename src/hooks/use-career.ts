import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/admin-api";
import type { JobResult, JobStatus } from "@/types";
import { toast } from "sonner";

export function useJobSearch() {
  return useMutation({
    mutationFn: (params: {
      q?: string;
      location?: string;
      remote?: boolean;
      sources?: string[];
      limit?: number;
    }) => api.jobs.search(params),
    onError: (error: Error) => {
      toast.error(error.message || "Nao foi possivel buscar vagas");
    },
  });
}

export function useSavedJobs(status?: JobStatus) {
  return useQuery({
    queryKey: ["admin", "jobs", "saved", status ?? "all"],
    queryFn: () => api.jobs.saved.list(status),
    staleTime: 1000 * 30,
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job: JobResult) => api.jobs.saved.create(job),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs", "saved"] });
      toast.success(saved.status === "saved" ? "Vaga salva no pipeline" : "Vaga atualizada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao salvar vaga");
    },
  });
}

export function useUpdateSavedJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: JobStatus; notes?: string; next_action_at?: string | null } }) =>
      api.jobs.saved.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs", "events", variables.id] });
      if (variables.data.status) toast.success("Status atualizado");
      else toast.success("Anotacao salva");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar candidatura");
    },
  });
}

export function useDeleteSavedJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.jobs.saved.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs", "saved"] });
      toast.success("Candidatura removida");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover candidatura");
    },
  });
}

export function useJobEvents(id: number | null) {
  return useQuery({
    queryKey: ["admin", "jobs", "events", id],
    queryFn: () => api.jobs.saved.events(id as number),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
