import request from 'supertest';
import express from 'express';
import user from '../routes/User';


const app = new express();
app.use('/api', user);

describe('Good Home Routes', function () {

    test('responds to /', async () => {
      const res = await request(app).get('/api/ping');
      expect(res.header['content-type']).toBe('text/html; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('pong');
    });
    
  
  });