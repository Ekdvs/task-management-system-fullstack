import { loginUser } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response } from "express";

export const login = asyncHandler(async(request:Request,response:Response)=>{
    const {email,password} =request.body

    const result = await loginUser(email,password);

    response.status(200).json(
        {
            success:true,
            message:"Login Successful",
            data:result
        }
    )
})

export const logout = asyncHandler(async (_request: Request, response: Response) => {
  
  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
});