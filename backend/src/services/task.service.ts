import { Priority, Status } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";


const priorityMap: Record<string, Priority> = {
  Low: Priority.LOW,
  Medium: Priority.MEDIUM,
  High: Priority.HIGH,
};

const statusMap: Record<string, Status> = {
  Pending: Status.PENDING,
  "In Progress": Status.IN_PROGRESS,
  Completed: Status.COMPLETED,
};

const reversePriorityMap: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const reverseStatusMap: Record<Status, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

interface TaskQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

interface PaginatedTasks {
  tasks: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getTasksForUser = async (
  userId: number,
  query: TaskQueryParams
): Promise<PaginatedTasks> => {

  const {
    search,
    status,
    priority,
    sortBy,
    page = "1",
    limit = "10"
  } = query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);

  const where: any = {
    userId
  };

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive"
    };
  }

  if (status) {
    where.status = statusMap[status];
  }

  if (priority) {
    where.priority = priorityMap[priority];
  }

  let orderBy: any = {
    created_at: "desc"
  };

  if (sortBy === "oldest") {
    orderBy = {
      created_at: "asc"
    };
  }

  if (sortBy === "dueDate") {
    orderBy = {
      due_date: "asc"
    };
  }

  const total = await prisma.task.count({
    where
  });

  const tasks = await prisma.task.findMany({

    where,
    orderBy,
    skip: (pageNum - 1) * limitNum,
    take: limitNum,

  });

  return {

    tasks,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }

  };

};

export const getTaskByIdForUser = async (
  userId: number,
  taskId: string
) => {


  const task = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
      userId
    }

  });


  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;

};


export const createTaskForUser = async (
  userId: number,
  input: any
) => {

  return prisma.task.create({

    data: {
      userId,
      title: input.title,
      description: input.description,
      priority: priorityMap[input.priority],

      status: statusMap[input.status],
      due_date: new Date(input.due_date)

    }

  });

};

export const updateTaskForUser = async (
  userId: number,
  taskId: string,
  input: any
) => {

  const existing = await prisma.task.findFirst({

    where: {
      id: Number(taskId),
      userId
    }

  });


  if (!existing) {

    throw new ApiError(404, "Task not found");

  }

  return prisma.task.update({

    where: {
      id: Number(taskId)
    },

    data: {
      title:
        input.title ?? existing.title,
      description:
        input.description ?? existing.description,
      priority:
        priorityMap[input.priority]?? existing.priority,
      status:
        statusMap[input.status]?? existing.status,
      due_date:
        input.due_date
          ? new Date(input.due_date)
          : existing.due_date

    }

  });


};

export const deleteTaskForUser = async (
  userId: number,
  taskId: string
) => {
  const existing = await prisma.task.findFirst({

    where: {
      id: Number(taskId),
      userId
    }

  });


  if (!existing) {

    throw new ApiError(404, "Task not found");

  }

  await prisma.task.delete({

    where: {
      id: Number(taskId)
    }

  });


};


export const getDashboardStatsForUser = async (
  userId: number
) => {

  const totalTasks = await prisma.task.count({
    where: {
      userId
    }
  });


  const pendingTasks = await prisma.task.count({
    where: {
      userId,
      status: "PENDING"
    }
  });


  const inProgressTasks = await prisma.task.count({
    where: {
      userId,
      status: "IN_PROGRESS"
    }
  });


  const completedTasks = await prisma.task.count({
    where: {
      userId,
      status: "COMPLETED"
    }
  });



  const overdueTasks = await prisma.task.count({

    where: {

      userId,

      status: {
        not: "COMPLETED"
      },

      due_date: {
        lt: new Date()
      }

    }

  });



  return {

    totalTasks,

    pendingTasks,

    inProgressTasks,

    completedTasks,

    overdueTasks

  };

};