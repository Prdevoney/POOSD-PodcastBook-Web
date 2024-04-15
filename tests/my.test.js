require('dotenv').config();
const request = require('supertest');
const router = require('../routes/index');
const express = require('express');
const app = express();
const supertest = require('supertest');
app.use(express.json());
app.use(router);

const agent = supertest.agent(app);

describe("Testing /login", () => {
    it("Should return a status 200 and provide a JWT token upon successful login", async () => {
        const username = 'testy';
        const password = 'P@ssword1';

        const res = await agent.post('/login')
            .send({ Username: username, Password: password });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it("Should return a status 401 for incorrect password", async () => {
        const username = 'testy';
        const password = 'incorrect_password';

        const res = await agent.post('/login')
            .send({ Username: username, Password: password });

        expect(res.status).toBe(401);
    });
});

describe("Testing /getUserInfo", () => {
    beforeAll(async () => {
        // Login before running the tests
        const username = 'testy';
        const password = 'P@ssword1';
        const res = await agent.post('/login')
            .send({ Username: username, Password: password });
        token = res.body.token; // Set token for subsequent requests
    });

    it("Should return a status 200 and user info for valid user", async () => {
        const id = '65e6293baca00dbf4f1b2488';
        const userInfoRes = await agent.post('/getUserInfo')
            .send({ UserID: id });
        expect(userInfoRes.status).toBe(200);
    });

    it("Should return a status 404 for non-existent UserID", async () => {
        const id = '661b3b85b5a1164bb95ea729';
        const res = await agent.post('/getUserInfo')
            .send({ UserID: id });
        expect(res.status).toBe(404);
    });
});

describe("Testing /SearchUser", () => {
    beforeAll(async () => {
        // Login before running the tests
        const username = 'testy';
        const password = 'P@ssword1';
        const res = await agent.post('/login')
            .send({ Username: username, Password: password });
    });

    it("Should return a status 200 and search results for valid user", async () => {
        const id = '65e6293baca00dbf4f1b2488';
        const username = 'p';
        const res = await agent.post('/SearchUser')
            .send({ MyUser: id, Username: username });
        expect(res.status).toBe(200);
    });

    it("Should return no results for invalid username", async () => {
        const id = '661b3b85b5a1164bb95ea729';
        const username = 'invalid_username';
        const res = await agent.post('/SearchUser')
            .send({ MyUser: id, Username: username });
        expect(res.body.length).toBe(0);
    });

    it("Should return results for a single letter username", async () => {
        const id = '661b3b85b5a1164bb95ea729';
        const username = 'p';
        const res = await agent.post('/SearchUser')
            .send({ MyUser: id, Username: username });
        expect(res.body.length).toBeGreaterThan(0);
    });
});