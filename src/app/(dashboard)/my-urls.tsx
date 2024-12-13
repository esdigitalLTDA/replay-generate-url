import { formatDistanceToNow } from 'date-fns'
import { Copy, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { fetcher } from '@/lib/utils'
import { IVideo } from '@/models/video'
import { useWalletStore } from '@/state/wallet.store'

import { VideoDetails } from './video-details'

export function MyUrls() {
  const { walletAddress } = useWalletStore()

  const url = useMemo(() => {
    if (!walletAddress) return null
    return `/api/videos?userAddress=${walletAddress}`
  }, [walletAddress])

  const { data, isLoading } = useSWR(url, fetcher)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span>Loading URLs</span> <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!data?.success || !data?.data || data.data.length === 0) {
    return <div>No URLs found.</div>
  }

  const videos: IVideo[] = data.data

  videos.sort(
    (a, b) =>
      new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime(),
  )

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => {
        const creationDate = formatDistanceToNow(
          new Date(video?.creation_date),
          {
            addSuffix: true,
          },
        )

        return (
          <div
            key={String(video._id)}
            className="border-0.5 overflow-hidden rounded-lg border border-muted p-3.5 shadow-md"
          >
            <div className="flex h-[270px] w-full items-center justify-center">
              <Image
                src={video.thumbnail!}
                alt={video.title}
                quality={100}
                width={200}
                height={350}
                className="max-w-[200px]"
              />
            </div>
            <div className="mt-4">
              <h3 className="truncate text-lg font-bold" title={video.title}>
                {video.title}
              </h3>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      className="w-full max-w-[280px] overflow-hidden truncate text-sm text-muted-foreground"
                      title={video.replay_tracking_url}
                    >
                      {video.replay_tracking_url}
                    </TooltipTrigger>
                    <TooltipContent className="p-2 shadow-lg">
                      <span>{video.replay_tracking_url}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  size="icon"
                  variant="ghost"
                  className="p-2.5"
                  onClick={() => {
                    navigator.clipboard.writeText(video.replay_tracking_url)
                    toast.success('URL cpied successfully!')
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="mt-2 text-xs text-gray-500">
                  Created {creationDate}
                </p>

                <VideoDetails video={video} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
