import { body, param, query } from "express-validator";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must be under 255 characters"),
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be text"),
  body("priority")
    .notEmpty().withMessage("Priority is required")
    .isIn(PRIORITIES).withMessage("Priority must be Low, Medium, or High"),
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(STATUSES).withMessage("Status must be Pending, In Progress, or Completed"),
  body("due_date")
    .notEmpty().withMessage("Due date is required")
    .isISO8601().withMessage("Due date must be a valid date")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(value);
      if (due < today) {
        throw new Error("Due date cannot be earlier than today");
      }
      return true;
    }),
];

export const updateTaskValidator = [
  param("id").isInt().withMessage("Invalid task id"),
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 255 }).withMessage("Title must be under 255 characters"),
  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be text"),
  body("priority")
    .optional()
    .isIn(PRIORITIES).withMessage("Priority must be Low, Medium, or High"),
  body("status")
    .optional()
    .isIn(STATUSES).withMessage("Status must be Pending, In Progress, or Completed"),
  body("due_date")
    .optional()
    .isISO8601().withMessage("Due date must be a valid date"),
];

export const getTasksQueryValidator = [
  query("status").optional().isIn(STATUSES),
  query("priority").optional().isIn(PRIORITIES),
  query("sortBy").optional().isIn(["newest", "oldest", "dueDate"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

export const taskIdValidator = [param("id").isInt().withMessage("Invalid task id")];