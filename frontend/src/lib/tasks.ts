import { DashboardStatsResponse, TaskFilters, TaskFormValues, TaskResponse, TasksResponse } from "../types";
import { api } from "./api";


export async function fetchTasks(filters: TaskFilters) {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;

  const { data } = await api.get<TasksResponse>("/tasks", { params });
  return data;
}

export async function fetchTaskById(id: number) {
  const { data } = await api.get<TaskResponse>(`/tasks/${id}`);
  return data.data;
}

export async function createTask(values: TaskFormValues) {
  const { data } = await api.post<TaskResponse>("/tasks", values);
  return data.data;
}

export async function updateTask(id: number, values: Partial<TaskFormValues>) {
  const { data } = await api.put<TaskResponse>(`/tasks/${id}`, values);
  return data.data;
}

export async function deleteTask(id: number) {
  await api.delete(`/tasks/${id}`);
}

export async function fetchDashboardStats() {
  const { data } = await api.get<DashboardStatsResponse>("/tasks/dashboard/stats");
  return data.data;
}
