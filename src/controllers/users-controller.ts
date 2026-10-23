import {Request, Response} from "express"
import { prisma } from "@/database/prisma"
import {hash} from "bcrypt"
import {z} from "zod"
import { AppError } from "@/utils/AppError"

class UsersController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const {name, email, password} = bodySchema.parse(request.body)

        const userSameEmail = await prisma.user.findFirst({where: {email}})

        if(userSameEmail){
            throw new AppError("Email já cadastrado")
        }

        const hashed = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
            }
        })  

        const {password: _, ...withoutPassword} = user

        return response.status(201).json(withoutPassword)
    }
}

export {UsersController}