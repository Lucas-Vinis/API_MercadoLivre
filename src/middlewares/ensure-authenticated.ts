import {Request, Response, NextFunction} from "express"
import { verify } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import {ZodError} from "zod"

interface TokenPayload {
    role: string,
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    try {
        const authHeader = request.headers.authorization
        
        if(!authHeader){
            throw new AppError("Token not found", 404)
        }

        const [, token] = authHeader.split(" ")

        const {role, sub: user_id} = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = {
            id: user_id,
            role,
        }

        return next()
        
    } catch (error) {
        throw new AppError("Token inválido")
    }
}

export { ensureAuthenticated }