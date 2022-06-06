const request = require('supertest')
const express = require("express");

const chatroom = require("../routes/ChatRoom");
const verifyJWT = require('../routes/isAuth')


const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use("/api/ChatRoom", chatroom);


describe('chatroom route', function () {

    test('responds to /api/ChatRoom/ping', async () => {
      const res = await request(app).get('/api/ChatRoom/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
  
});