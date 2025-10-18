import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { insertUser, getUserByEmail } from '../database';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = signupSchema.parse(req.body);
    const existingUser = getUserByEmail.get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = insertUser.run(email, hashedPassword);
    const userId = Number(result.lastInsertRowid);
    const token = jwt.sign({ id: userId, email }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = getUserByEmail.get(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
