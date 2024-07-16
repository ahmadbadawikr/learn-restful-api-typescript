import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging"

describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await UserTest.create();

    })

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    })

    it("Should create a new contact", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "Aegon",
                last_name: "Targaryen",
                email: "aegon@kingslanding.com",
                phone: "08989999"
            })
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Aegon")
        expect(response.body.data.last_name).toBe("Targaryen")
        expect(response.body.data.email).toBe("aegon@kingslanding.com")
        expect(response.body.data.phone).toBe("08989999")
        

    })

    it("Should reject if data is invalid", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "aegon",
                phone: "089899990000000000000000"
            })
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        

    })
})