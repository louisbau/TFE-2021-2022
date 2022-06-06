const request = require('supertest')
const express = require("express");

const friends = require("../routes/Friends")
const verifyJWT = require('../routes/isAuth')

const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api/Friends", friends);


describe('Friends routes', function () {

    test('responds to /api/Friends/ping', async () => {
      const res = await request(app).get('/api/Friends/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
  
});