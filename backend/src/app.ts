import express from 'express';
import cors from 'cors';
import './database';
import authRouter from './routes/auth';
import generationsRouter from './routes/generations';

const app = express();

app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/', (_req, res) => {
  res.json({ message: 'AI Studio Backend' });
});

app.use('/auth', authRouter);
app.use('/generations', generationsRouter);

export default app;
