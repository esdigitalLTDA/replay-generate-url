'use client'

import { createId } from '@paralleldrive/cuid2'
import { Loader2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THETA_MAINNET } from '@/services/constants/network-connections'
import { addMovieToBlockchain } from '@/services/movies-service'
import {
  CONTENT_OWNER_ID,
  DISTRIBUTOR_ID,
  PAYMENT_PROFILE_ID,
  PLATFORM,
  RPLAY_CONTRACT_ADDRESS,
} from '@/services/replay/replay-constants'
import {
  createAsset,
  createSyndicationProfile,
} from '@/services/replay/replay-service'
import { isHLS } from '@/services/utils'
import { web3Service } from '@/services/web3'
import { useWalletStore } from '@/state/wallet.store'

interface VideoDataForm {
  title: string
  description: string
  tags: string
  thumbnail: string
  category: string
  publicationDate: string
  videoUrl: string
  wrappedUrl?: string
  paymentTxId?: string
  movieCreationTxId?: string
}

interface VideoFormProps {
  onGenerateUrl: () => void
}

export default function VideoForm({ onGenerateUrl }: VideoFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { walletAddress } = useWalletStore()

  const [videoData, setVideoData] = useState<VideoDataForm>({
    title: '',
    description: '',
    tags: '',
    thumbnail: '',
    category: '',
    publicationDate: '',
    videoUrl: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value })
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoData({ ...videoData, videoUrl: url })
  }

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault()

    if (!isHLS(videoData.videoUrl)) {
      toast.error('The URL is not a valid HLS video.')
      return
    }

    try {
      setIsLoading(true)

      const paymentTxId = await processPayment()

      setVideoData((prevData) => ({ ...prevData, paymentTxId }))
      localStorage.setItem(
        'videoData',
        JSON.stringify({ ...videoData, paymentTxId }),
      )

      // todo
      const assetResponse = await createAsset({
        thumbnail: videoData.thumbnail || '',
        assetType: 'vod', // vod or live
        title: videoData.title,
        contentOwnerId: CONTENT_OWNER_ID,
        platform: PLATFORM,
        description: videoData.description,
        externalAssetId: createId(),
        sourceUrl: videoData.videoUrl,
      })

      if (!assetResponse.id) {
        throw new Error('No one asset ID returned')
      }

      // todo
      const syndicationResponse = await createSyndicationProfile({
        name: `${videoData.title} - ${PLATFORM}`,
        distributorId: DISTRIBUTOR_ID,
        contentOwnerId: CONTENT_OWNER_ID,
        paymentProfileId: PAYMENT_PROFILE_ID,
        assetId: assetResponse.id,
      })

      const playbackUrl = syndicationResponse.playbackUrl
      if (!playbackUrl) {
        throw new Error('No playbackUrl returned from distribution profile.')
      }

      setVideoData((prevData) => ({ ...prevData, wrappedUrl: playbackUrl }))

      localStorage.setItem(
        'videoData',
        JSON.stringify({ ...videoData, wrappedUrl: playbackUrl }),
      )

      const movieCreationTxId = await addMovieToBlockchain({
        userAddress: walletAddress!,
        videoData: {
          ...videoData,
          tags: videoData?.tags?.length > 0 ? videoData.tags.split(',') : [],
          wrappedUrl: playbackUrl,
          paymentTxId,
        },
      })

      console.log('movieCreationTxId', movieCreationTxId)

      setVideoData((prevData) => ({
        ...prevData,
        movieCreationTxId,
      }))

      localStorage.setItem(
        'videoData',
        JSON.stringify({ ...videoData, movieCreationTxId }),
      )

      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // email: userEmail,
          payment_TX_ID: paymentTxId,
          movie_creation_TX_ID: movieCreationTxId,
          userAddress: walletAddress,
          title: videoData.title,
          description: videoData.description,
          tags: videoData?.tags?.length > 0 ? videoData.tags.split(',') : [],
          thumbnails: videoData.thumbnail,
          category: videoData.category,
          creation_date: videoData.publicationDate,
          REPLAY_TRACKING_URL: playbackUrl,
          TX_ID: paymentTxId,
          is_active: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Error to save movie')
      }

      onGenerateUrl()

      toast.success('Movie added successfully!')
    } catch (error: any) {
      console.error('Error processing:', error)

      if (error?.message === 'Insufficient RPLAY balance.') {
        return toast.error(error.message, {
          action: {
            label: 'Buy RPLAY',
            onClick: () => {
              window.open('https://www.mexc.com/price/RPLAY', '_blank')
            },
          },
        })
      }

      toast.error(error?.message || 'Failed to process the video.')
    } finally {
      setIsLoading(false)
    }
  }

  const processPayment = async () => {
    try {
      const AMOUNT_PER_URL = parseFloat(
        process.env.NEXT_PUBLIC_AMOUNT_PER_URL_TRACKING || '1',
      )

      const TREASURE_WALLET = process.env.NEXT_PUBLIC_TREASURE_WALLET

      if (!AMOUNT_PER_URL || !TREASURE_WALLET) {
        throw new Error(
          'Invalid payment configuration. Check your environment variables.',
        )
      }

      await web3Service.changeNetwork(THETA_MAINNET.chainId)

      const provider = await web3Service.getMetaMaskProvider()
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      const userRplayBalance = await web3Service.getTokenBalance(
        userAddress,
        RPLAY_CONTRACT_ADDRESS,
      )

      const userBalanceNumber = parseFloat(userRplayBalance)

      if (userBalanceNumber < AMOUNT_PER_URL) {
        throw new Error('Insufficient RPLAY balance.')
      }

      const txHash = await web3Service.transferToken(
        TREASURE_WALLET,
        AMOUNT_PER_URL,
        RPLAY_CONTRACT_ADDRESS,
      )

      toast.success('Payment successful!')

      return txHash
    } catch (error: any) {
      console.error('Error processing payment:', error)
      throw error
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem('videoData')
    if (savedData) {
      setVideoData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('videoData', JSON.stringify(videoData))
  }, [videoData])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form className="w-[600px] space-y-4">
        <div>
          <label className="mb-1 block font-semibold">Video Title *</label>
          <Input
            name="title"
            value={videoData.title}
            onChange={handleChange}
            required
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">
            Video Description *
          </label>
          <Textarea
            name="description"
            value={videoData.description}
            onChange={handleChange}
            required
            placeholder="Enter video description"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Video URL *</label>
          <Input
            name="videoUrl"
            value={videoData.videoUrl}
            onChange={handleVideoUrlChange}
            required
            placeholder="Enter video URL (HLS only)"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Tags</label>
          <Input
            name="tags"
            value={videoData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Custom Thumbnail</label>
          <Input
            name="thumbnail"
            value={videoData.thumbnail}
            onChange={handleChange}
            placeholder="Enter thumbnail URL"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Category</label>
          <Input
            name="category"
            value={videoData.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Publication Date</label>
          <Input
            type="date"
            name="publicationDate"
            value={videoData.publicationDate}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          onClick={handleConfirm}
          className="mt-3 h-12 w-full font-semibold"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Generate URL'}
        </Button>
      </form>
    </div>
  )
}
