const request = require('supertest')
const express = require("express");
const user = require('../routes/User');
const verifyJWT = require('../routes/isAuth')

const app = new express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use('/api', user);

describe('authentification test', function () {

    test('responds to /', async () => {
      const res = await request(app).get('/api/ping');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual("\"pong\"");
    });
    
  
});