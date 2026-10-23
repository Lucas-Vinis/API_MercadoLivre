import request from "supertest"
import { prisma } from "@/database/prisma"
import {app} from "@/app"

describe("UserController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({where: {id: user_id}})
    })

    it("deve criar um user com sucesso", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "test-user@email.com",
            password: "password123"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Test User")

        user_id = response.body.id
    }) 
    
    it("deve dar erro com user com o mesmo email", async () => {
        const response = await request(app).post("/users").send({
            name: "Duplicata",
            email: "test-user@email.com",
            password: "password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Email já cadastrado")
    })

    it("deve dar erro com email invalido", async () => {
        const response = await request(app).post("/users").send({
            name: "Duplicata",
            email: "test-user@email",
            password: "password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error")
    })
})