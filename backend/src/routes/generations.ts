import express from 'express';
import { z } from 'zod';
import { insertGeneration, getGenerationsByUser, getGenerationById, Generation } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

const generationSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
  style: z.string().trim().min(1, 'Style is required'),
  imageUpload: z.string().trim().min(1, 'Image upload is required'),
});

const listQuerySchema = z.object({
  limit: z
    .preprocess((value) => {
      if (Array.isArray(value)) {
        return value[0];
      }
      return value;
    }, z
      .string()
      .regex(/^\d+$/, 'limit must be a positive integer')
      .transform((value) => {
        const parsed = Number.parseInt(value, 10);
        return Math.min(Math.max(parsed, 1), 10);
      }))
    .optional(),
});

const toGenerationResponse = (row: Generation) => ({
  id: row.id,
  imageUrl: row.image_url,
  prompt: row.prompt,
  style: row.style,
  createdAt: row.created_at,
  status: row.status,
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prompt, style, imageUpload } = generationSchema.parse(req.body);

    const processingDelay = Math.random() * 1000 + 1000;
    await wait(processingDelay);

    if (Math.random() < 0.2) {
      return res.status(503).json({ message: 'Model overloaded' });
    }

    const status = 'completed';
    const imageUrl = imageUpload || 'https://via.placeholder.com/300';

    const result = insertGeneration.run(req.user!.id, prompt, style, imageUrl, status);
    const generationRow = getGenerationById.get(Number(result.lastInsertRowid));

    if (!generationRow) {
      return res.status(500).json({ error: 'Failed to save generation' });
    }

    res.status(201).json(toGenerationResponse(generationRow));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues.map((err: z.ZodIssue) => err.message).join(', ') });
    }
    console.error('Failed to create generation', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const parsed = listQuerySchema.safeParse({ limit: req.query.limit });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const limit = parsed.data.limit ?? 5;
    const rows = getGenerationsByUser.all(req.user!.id, limit);
    res.json(rows.map(toGenerationResponse));
  } catch (error) {
    console.error('Failed to fetch generations', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
