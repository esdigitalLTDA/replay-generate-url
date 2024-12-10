'use client'

import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher } from '@/lib/utils'
import { IVideo } from '@/models/video'
import { useWalletStore } from '@/state/wallet.store'

import { EditVideoForm } from './edit-video-form'

export function MyUrls() {
  const { walletAddress } = useWalletStore()

  const url = useMemo(() => {
    if (!walletAddress) return null
    return `/api/videos?userAddress=${walletAddress}`
  }, [walletAddress])

  const { data, isLoading, isValidating } = useSWR(url, fetcher)

  if (!data?.success || !data?.data || data.data.length === 0) {
    return <div>No URLs found.</div>
  }

  if (isLoading || isValidating)
    return (
      <div className="flex items-center gap-2">
        <span>Loading URLs</span> <Loader2 className="animate-spin" />
      </div>
    )

  if (!data?.success || !data?.data || data.data.length === 0) {
    return <div>No URLs found.</div>
  }

  const urls: IVideo[] = data.data

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Replay Tracking URL</TableHead>
            {/* <TableHead>Transaction Hash</TableHead> */}
            <TableHead>Creation Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((video) => (
            <TableRow key={String(video._id)}>
              <TableCell className="font-medium">{video.title}</TableCell>
              <TableCell>
                <a
                  href={video.replay_tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.replay_tracking_url}
                </a>
              </TableCell>
              {/* <TableCell>{video.payment_hash}</TableCell> */}
              <TableCell>{video.creation_date}</TableCell>

              <TableCell className="text-right">
                <EditVideoForm video={video} onSave={() => {}} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
