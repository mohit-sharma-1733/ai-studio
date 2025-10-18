import request from 'supertest';
import app from '../src/app';

describe('Auth routes', () => {
  const credentials = { email: 'test@example.com', password: 'password123' };

  it('signs up a new user', async () => {
    const response = await request(app).post('/auth/signup').send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it('prevents duplicate signup', async () => {
    await request(app).post('/auth/signup').send(credentials);
    const response = await request(app).post('/auth/signup').send(credentials);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/already exists/i);
  });

  it('logs in an existing user', async () => {
    await request(app).post('/auth/signup').send(credentials);
    const response = await request(app).post('/auth/login').send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('rejects invalid credentials', async () => {
    await request(app).post('/auth/signup').send(credentials);
    const response = await request(app)
      .post('/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/invalid credentials/i);
  });
});
