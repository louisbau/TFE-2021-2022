const request = require('supertest')
const express = require("express");
const message = require('../routes/Message');
const verifyJWT = require('../routes/isAuth')

const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use('/api/Message', message);

describe('Message route', function () {

    test('responds to /api/Message/ping', async () => {
      const res = await request(app).get('/api/Message/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
  
});