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
import { useWalletStore } from '@/state/wallet.store'

interface Movie {
  _id: string
  title: string
  description: string
  REPLAY_TRACKING_URL: string
  payment_TX_ID: string
  creation_date: string
}

export function MyUrls() {
  const { walletAddress } = useWalletStore()

  const url = useMemo(() => {
    if (!walletAddress) return null
    return `/api/movies?userAddress=${walletAddress}`
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

  const urls: Movie[] = data.data

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Replay Tracking URL</TableHead>
            {/* <TableHead>Transaction Hash</TableHead> */}
            <TableHead className="text-right">Creation Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((movie) => (
            <TableRow key={movie._id}>
              <TableCell className="font-medium">{movie.title}</TableCell>
              <TableCell>
                <a
                  href={movie.REPLAY_TRACKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {movie.REPLAY_TRACKING_URL}
                </a>
              </TableCell>
              {/* <TableCell>{movie.payment_TX_ID}</TableCell> */}
              <TableCell className="text-right">
                {movie.creation_date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
