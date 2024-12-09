import { z } from 'zod'

export const movieSchema = z.object({
  email: z.string().optional(),
  payment_TX_ID: z.string(),
  movie_creation_TX_ID: z.string(),
  userAddress: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  thumbnails: z.string().optional(),
  category: z.string().optional(),
  creation_date: z.string().optional(),
  REPLAY_TRACKING_URL: z.string(),
  TX_ID: z.string(),
  is_active: z.boolean().optional().default(true),
})
