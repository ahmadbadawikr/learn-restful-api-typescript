import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { UserTest } from "./test-util"

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