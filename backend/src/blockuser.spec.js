const request = require('supertest')
const express = require("express");

const blockusers = require('../routes/BlockUser')
const verifyJWT = require('../routes/isAuth')

const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use("/api/BlockUser", blockusers);

describe('Block user Route', function () {

    test('responds to /api/BlockUser/ping', async () => {
      const res = await request(app).get('/api/BlockUser/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
  
});