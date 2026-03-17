import request from 'supertest';
import express from 'express';
import pingRouter from '../../../../routers/v1/ping.router';

// Mock controller and validator if needed
jest.mock('../../../../controllers/ping.controller', () => ({
  pingHandler: jest.fn((req, res) => res.status(200).json({ message: 'pong' })),
}));

jest.mock('../../../../validators', () => ({
  validateRequestBody: () => (req: express.Request, res: express.Response, next: express.NextFunction) => next(),
}));

jest.mock('../../../../validators/ping.validator', () => ({
  pingSchema: {},
}));

describe('Ping Router Integration', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/ping', pingRouter);
  });

  it('should respond with pong on GET /ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });

  it('should respond with OK on GET /ping/health', async () => {
    const res = await request(app).get('/ping/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});
