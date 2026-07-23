import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import Authrouter from "./routers/authRouter.js";
import taskRouter from "./routers/task.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*",credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.status(200).json({ message:"sever running" }));

app.use("/api/auth",Authrouter);
app.use("/api/tasks",taskRouter);

app.use(notFound);
app.use(errorHandler);

export default app;