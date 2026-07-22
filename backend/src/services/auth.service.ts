import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

interface LoginResult{
    token:string;
    user:{
        id:number;
        name:string;
        email:string
    }
}

export const loginUser = async (email:string,password:string) :Promise<LoginResult>=>{
    const user =await prisma.user.findUnique(
        {
            where:{email}
        }
    )

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
     });

    return {
        token,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
    };

}