import { z } from 'zod'

export const VideoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  replay_tracking_url: z
    .string()
    .url({ message: 'Invalid URL for replay_tracking_url' }),
  userAddress: z.string().min(1, { message: 'User address is required' }),
  payment_hash: z.string().min(1, { message: 'Payment hash is required' }),
  video_creation_hash: z
    .string()
    .min(1, { message: 'Video creation hash is required' }),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  creation_date: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const VideoUpdateSchema = VideoSchema.extend({
  _id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid ID format',
  }),
})
