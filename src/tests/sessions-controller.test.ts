import request from "supertest"
import { prisma } from "@/database/prisma"
import {app} from "@/app"


describe("SessionsController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({where: {id: user_id}})
    })

    it("deve autenticar e receber o token de acesso", async () => {
        const user = await request(app).post("/users").send({
            name: "Session User",
            email: "session-user@email.com",
            password: "password123"
        })

        user_id = user.body.id

        const session = await request(app).post("/sessions").send({
            email: "session-user@email.com",
            password: "password123"
        })

        expect(session.status).toBe(200)
        expect(session.body.token).toEqual(expect.any(String))
    })
})