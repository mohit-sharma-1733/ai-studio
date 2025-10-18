import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../src/app';

const credentials = { email: 'gen@example.com', password: 'password123' };

const signupAndGetToken = async () => {
  const response = await request(app).post('/auth/signup').send(credentials);
  return response.body.token as string;
};

describe('Generation routes', () => {
  beforeEach(() => {
    // Mock setTimeout to resolve immediately
    jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
      cb();
      return {} as any;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a generation with successful response', async () => {
    const token = await signupAndGetToken();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0) // delay
      .mockReturnValueOnce(0.9); // no overload

    const requestPromise = request(app)
      .post('/generations')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'A stylish outfit', style: 'realistic', imageUpload: 'data:image/png;base64,abc' });

    await jest.runAllTimersAsync();
    const response = await requestPromise;

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      prompt: 'A stylish outfit',
      style: 'realistic',
      status: 'completed',
    });
    expect(response.body.imageUrl).toBe('data:image/png;base64,abc');
    expect(response.body.createdAt).toBeDefined();
  });

  it('returns a 503 when the model is overloaded', async () => {
    const token = await signupAndGetToken();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1); // overload

    const requestPromise = request(app)
      .post('/generations')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Another outfit', style: 'artistic', imageUpload: 'data:image/png;base64,def' });

    await jest.runAllTimersAsync();
    const response = await requestPromise;

    expect(response.status).toBe(503);
    expect(response.body.message).toMatch(/overloaded/i);
  });

  it('lists the five most recent generations', async () => {
    const token = await signupAndGetToken();
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.9);

    const firstRequest = request(app)
      .post('/generations')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Look 1', style: 'realistic', imageUpload: 'data:image/png;base64,ghi' });
    await jest.runOnlyPendingTimersAsync();
    await firstRequest;

    const secondRequest = request(app)
      .post('/generations')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Look 2', style: 'cartoon', imageUpload: 'data:image/png;base64,jkl' });
    await jest.runOnlyPendingTimersAsync();
    await secondRequest;

    randomSpy.mockRestore();

    const listResponse = await request(app)
      .get('/generations?limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(2);
    expect(listResponse.body[0]).toMatchObject({ prompt: 'Look 2', imageUrl: 'data:image/png;base64,jkl' });
  });

  it('requires authentication for generation requests', async () => {
    const response = await request(app)
      .post('/generations')
      .send({ prompt: 'Unauthorized', style: 'realistic', imageUpload: 'data:image/png;base64,xyz' });

    await jest.runAllTimersAsync();
    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/access token/i);
  });
});
