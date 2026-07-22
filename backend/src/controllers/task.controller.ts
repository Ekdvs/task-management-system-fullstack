import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { createTaskForUser, deleteTaskForUser, getDashboardStatsForUser, getTaskByIdForUser, getTasksForUser, updateTaskForUser } from "../services/task.service.js";


export const getTasks = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  const { tasks, pagination } = await getTasksForUser(
    userId,
    request.query as any
  );

  response.status(200).json({
    success: true,
    data: tasks,
    pagination,
  });
});


export const getTaskById = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  const task = await getTaskByIdForUser(
    userId,
    request.params.id as string
  );

  response.status(200).json({
    success: true,
    data: task,
  });
});


export const createTask = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  const task = await createTaskForUser(
    userId,
    request.body
  );

  response.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
});


export const updateTask = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  const task = await updateTaskForUser(
    userId,
    request.params.id as string,
    request.body
  );

  response.status(200).json({
    success: true,
    message: "Task updated",
    data: task,
  });
});


export const deleteTask = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  await deleteTaskForUser(
    userId,
    request.params.id as string
  );

  response.status(200).json({
    success: true,
    message: "Task deleted",
  });
});


export const getDashboardStats = asyncHandler(async (request: Request, response: Response) => {
  const userId = request.user!.id;

  const stats = await getDashboardStatsForUser(userId);

  response.status(200).json({
    success: true,
    data: stats,
  });
});