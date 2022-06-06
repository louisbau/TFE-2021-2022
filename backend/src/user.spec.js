const request = require('supertest')
const express = require("express");
const user = require('../routes/User');
const verifyJWT = require('../routes/isAuth')

const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use('/api', user);

describe('User route', function () {

    test('responds to /api/ping', async () => {
      const res = await request(app).get('/api/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
    const login = {
      email: "Jeff",
      password: "Jeff"
    }

    test('responds to /api/login', async () => {
      const res = await request(app)
      .post('/api/login')
      .send(login);
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body["UserId"]).toEqual(3);
      expect(res.body["message"]).toEqual("user logged in");
    }, 10000);
  
});