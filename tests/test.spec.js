//const request = require('supertest');
const router = require('../routes/index');
const supertest = require('supertest')

const express = require('express');
const app = express();
const request = supertest(app)
app.use(express.json());
app.use(router);
router.use(express.json());
//const { SearchUser } = require('../routes/index/SearchUser');





describe("Testing /getUserInfo", () => {


        describe("A UserID that does not exist", () => {

            it("Should return a status 404 No UserID exist for this ID", async () => {
                const id = '65e6293baca00dbf4f1b2489';
                const res = await request.post('/getUserInfo').send({ UserID : id });
                expect(res.status).toBe(404);
            });
        
        });
        describe("A UserID that does exist", () => {
            it("should return a array of size 1", async () => {
                const id = '65e6293baca00dbf4f1b2488';
                const res = await request.post('/getUserInfo').send({ UserID : id });
                expect(res.status).toBe(200);
            });
        });
     
  });

  describe("Testing /SearchUser", () => {

        it("My username is valid", async () => {
            const id = 'pparker';
            const username = 'p';
            const res = await request.post('/SearchUser').send({ MyUser : id, Username: username });
            expect(res.status).toBe(200);
        });
    
    });
    describe("Search Username does not fit any available username", () => {
        it("should return a array of size 0", async () => {
            const id = 'pparker';
            const username = 'psadasdasdasd34901231238';
            const res = await request.post('/SearchUser').send({ MyUser : id, Username: username });
            //console.log(res);
            expect(res.text).toBe("[]");
        });
    });
    describe("A Username that has only one letter should return all available Usernames that have that letter", () => {
        it("should return a array of size more than 1", async  () => {
            const id = 'pparker';
            const username = 'psadasdasdasd934348124';
            const res = await request.post('/SearchUser').send({ MyUser : id, Username: username });
            //console.log(res);
            expect(res.text).toBe("[]");
        });
    });
    
