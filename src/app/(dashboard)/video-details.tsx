'use client'

import { format } from 'date-fns'
import { Check, Clipboard } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { IVideo } from '@/models/video'

interface VideoDetailsProps {
  video: IVideo
}

export function VideoDetails({ video }: VideoDetailsProps) {
  const [copyStatus, setCopyStatus] = useState<{
    trackingUrl: boolean
    paymentHash: boolean
  }>({
    trackingUrl: false,
    paymentHash: false,
  })

  const copyToClipboard = async (
    text: string,
    field: 'trackingUrl' | 'paymentHash',
  ) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus((prev) => ({ ...prev, [field]: true }))
      toast.success('Copied successfully!')
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [field]: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-sm font-semibold uppercase tracking-wide"
        >
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[200px] max-w-2xl overflow-y-scroll sm:max-h-[600px] xl:max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Video Details</DialogTitle>
          <DialogDescription>
            View all information related to this video.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <span className="text-base font-semibold">Title</span>
              <span className="text-muted-foreground">{video.title}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-semibold">Description</span>
              <span className="text-muted-foreground">{video.description}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-base font-semibold">Thumbnail</span>
              <Image
                src={video.thumbnail!}
                alt=""
                width={200}
                height={300}
                className="max-h-[300px] max-w-[150px] object-cover"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-base font-semibold">Tags</span>
              <span className="text-muted-foreground">
                {video.tags && video.tags.length > 0 && video.tags.join(', ')}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-semibold">Category</span>
              <span className="text-muted-foreground">{video.category}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-semibold">Publication Date</span>
              <span className="text-muted-foreground">
                {format(
                  new Date(video.creation_date),
                  "MMMM dd, yyyy 'at' HH:mm:ss",
                )}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold">
                  Replay Tracking URL
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(video.replay_tracking_url, 'trackingUrl')
                  }
                  aria-label="Copy Replay Tracking URL"
                >
                  {copyStatus.trackingUrl ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <span className="text-wrap break-words text-muted-foreground">
                {video.replay_tracking_url}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold">
                  Transaction Hash
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(video.payment_hash, 'paymentHash')
                  }
                  aria-label="Copy Transaction Hash"
                >
                  {copyStatus.paymentHash ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <span className="text-wrap break-words text-muted-foreground">
                {video.payment_hash}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
