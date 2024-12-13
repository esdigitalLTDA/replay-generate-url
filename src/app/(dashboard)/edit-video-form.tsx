'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { VideoDataForm, VideoFormSchema } from '@/app/(dashboard)/video-schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IVideo } from '@/models/video'

interface EditVideoFormProps {
  video: IVideo
  onSave: () => void
}

export function EditVideoForm({ video, onSave }: EditVideoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoDataForm>({
    resolver: zodResolver(VideoFormSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      tags: video.tags && video.tags.join(','),
      thumbnail: video.thumbnail,
      category: video.category,
      publicationDate: video.creation_date || '',
      videoUrl: video.replay_tracking_url,
    },
  })

  const onSubmit = async (data: VideoDataForm) => {
    try {
      const updatedVideo = {
        ...video,
        title: data.title,
        description: data.description,
        tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
        category: data.category || '',
        creation_date: data.publicationDate || '',
        replay_tracking_url: data.videoUrl,
      }

      onSave()
      toast.success('Video updated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update video.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon">
          <Edit size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
          <DialogDescription>
            Update the informations and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block font-semibold">Title *</label>
            <Input
              {...register('title')}
              placeholder="Enter video title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <span className="mt-1.5 text-sm text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Description *</label>
            <Textarea
              {...register('description')}
              placeholder="Enter video description"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <span className="mt-1.5 text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Video URL *</label>
            <Input
              {...register('videoUrl')}
              placeholder="Enter video URL"
              className={errors.videoUrl ? 'border-red-500' : ''}
            />
            {errors.videoUrl && (
              <span className="mt-1.5 text-sm text-red-500">
                {errors.videoUrl.message}
              </span>
            )}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Tags</label>
            <Input
              {...register('tags')}
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Category</label>
            <Input {...register('category')} placeholder="Enter category" />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Publication Date</label>
            <Input type="date" {...register('publicationDate')} />
          </div>
          <Button
            type="submit"
            className="mt-3 h-12 w-full font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
