import { Router } from "express";
import { loginValidator } from "../validations/auth.validator.js";
import { login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";


const Authrouter = Router();
Authrouter.post("/login", loginValidator, validate, login);
Authrouter.post("/logout",authenticate, logout);

export default Authrouter ;