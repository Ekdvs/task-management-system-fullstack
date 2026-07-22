import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createTask, deleteTask, getDashboardStats, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js";
import { createTaskValidator, getTasksQueryValidator, taskIdValidator, updateTaskValidator } from "../validations/task.validator.js";
import { validate } from "../middleware/validate.middleware.js";


const taskRouter = Router();

taskRouter.use(authenticate); 

taskRouter.get("/dashboard/stats", getDashboardStats);
taskRouter.get("/", getTasksQueryValidator, validate, getTasks);
taskRouter.get("/:id", taskIdValidator, validate, getTaskById);
taskRouter.post("/", createTaskValidator, validate, createTask);
taskRouter.put("/:id", updateTaskValidator, validate, updateTask);
taskRouter.delete("/:id", taskIdValidator, validate, deleteTask);

export default taskRouter;