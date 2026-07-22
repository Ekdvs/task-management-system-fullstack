import { Router } from "express";
import { loginValidator } from "../validations/auth.validator.js";
import { login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";


const Authrouter = Router();
Authrouter.post("/login", loginValidator, validate, login);
Authrouter.post("/logout", logout);

export default Authrouter ;