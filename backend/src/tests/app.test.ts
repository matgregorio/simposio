import request from 'supertest';

import app from '../app';
import mongoose from '../config/database';
import { globalRateLimiter } from '../middlewares/rateLimiter';

describe('Health check', () => {
  it('should return ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  const store = (globalRateLimiter as unknown as { store?: { shutdown?: () => void } }).store;
  if (store && typeof store.shutdown === 'function') {
    store.shutdown();
  }
});
