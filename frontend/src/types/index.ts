export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: Pagination;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: { msg: string; path?: string }[];
}

export type SortBy = "newest" | "oldest" | "dueDate";

export interface TaskFilters {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sortBy: SortBy;
  page: number;
  limit: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority | "";
  status: TaskStatus | "";
  due_date: string;
}
