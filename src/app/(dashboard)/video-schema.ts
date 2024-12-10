import { z } from 'zod'

export const VideoFormSchema = z.object({
  title: z.string().min(1, 'Video Title is required'),
  description: z.string().min(1, 'Video Description is required'),
  tags: z.string().optional(),
  thumbnail: z.any().optional(),
  category: z.string().optional(),
  publicationDate: z.string().optional(),
  videoUrl: z
    .string()
    .url('Video URL must be a valid URL')
    .min(1, 'Video URL is required'),
})

export type VideoDataForm = z.infer<typeof VideoFormSchema>
