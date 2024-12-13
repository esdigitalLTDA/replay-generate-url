import { z } from 'zod'

export const VideoFormSchema = z.object({
  title: z.string().min(1, 'Video Title is required'),
  description: z.string().min(1, 'Video Description is required'),
  videoUrl: z
    .string()
    .min(1, 'Video URL is required')
    .refine(
      (url) => {
        try {
          const isValidUrl = new URL(url)
          return isValidUrl && url.includes('.m3u8')
        } catch {
          return false
        }
      },
      {
        message: 'Video URL must be a valid HLS URL (.m3u8)',
      },
    ),
  thumbnail: z.string().url('Thumbnail must be a valid Image URL'),
  tags: z.string().optional(),
  category: z.string().optional(),
})

export type VideoDataForm = z.infer<typeof VideoFormSchema>
