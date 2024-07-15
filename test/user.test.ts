import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { UserTest } from "./test-util"
import { response } from "express"
import bcrypt from "bcrypt"

describe("POST /api/users", ()=>{

    afterEach(async () => {
        await UserTest.delete();
    })

    it("Should reject register new user if request is invalid", async() => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name: ""
            });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        
    });

    it("should be able to register new user", async()=> {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "ihiajsias",
                name: "Aegon Targaryen"
            })
        logger.debug(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.name).toBe("Aegon Targaryen")
    })
})

describe("POST /api/users/login", () => {

    beforeEach(async () => {
        await UserTest.create();

    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it("Should be able to login", async() => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username:"test",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.name).toBe("test")
        expect(response.body.data.token).toBeDefined();
    })

    it("Should be rejected if username is wrong", async() => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username:"wrong",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

})

describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();

    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it("Should be able to get user", async () => {
        const response = await supertest(web)   
            .get("/api/users/current")
            .set("X-API-TOKEN", "test")

        logger.debug(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.name).toBe("test")
    })

    it("Should reject getting user if token is invalid", async () => {
        const response = await supertest(web)   
            .get("/api/users/current")
            .set("X-API-TOKEN", "wrong")

        logger.debug(response.body)
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    
})

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();

    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it("Should reject update user if request is invalid", async () => {
        const response = await supertest(web)   
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "",
                name: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("Should reject update user if token is wrong", async () => {
        const response = await supertest(web)   
            .patch("/api/users/current")
            .set("X-API-TOKEN", "wrong")
            .send({
                password: "right",
                name: "right"
            })

        logger.debug(response.body)
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    it("Should be able to update name", async () => {
        const response = await supertest(web)   
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "right"
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("right")
    })

    it('should be able to update user password', async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "right"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        
        const user = await UserTest.get();
        expect(await bcrypt.compare("right", user.password)).toBe(true);


    })
})

describe("DELETE /api/users/current", () => {
    beforeEach(async () => {
        await UserTest.create();

    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should be able to logout', async () => {
        const response = await supertest(web)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "right"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK")

        const user = await UserTest.get();
        expect(user.token).toBeNull();


    })

    it('should reject logout user if token is wrong', async () => {
        const response = await supertest(web)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "wrong")

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();

    })

})