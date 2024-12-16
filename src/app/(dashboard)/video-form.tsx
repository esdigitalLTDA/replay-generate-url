'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { VideoDataForm, VideoFormSchema } from '@/app/(dashboard)/video-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THETA_MAINNET } from '@/services/constants/network-connections'
import {
  CONTENT_OWNER_ID,
  DISTRIBUTOR_ID,
  PAYMENT_PROFILE_ID,
  PLATFORM,
} from '@/services/replay/replay-constants'
import {
  createAsset,
  createSyndicationProfile,
} from '@/services/replay/replay-service'
import {
  addVideosToBlockchain,
  VideoDataBlockchain,
} from '@/services/videos-service'
import { web3Service } from '@/services/web3'
import { useWalletStore } from '@/state/wallet.store'

interface VideoFormProps {
  onGenerateUrl: () => void
}

export default function VideoForm({ onGenerateUrl }: VideoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { walletAddress } = useWalletStore()

  const defaultValues = useMemo(() => {
    const savedData = localStorage.getItem('videoData')
    return savedData
      ? JSON.parse(savedData)
      : {
          title: '',
          description: '',
          tags: '',
          thumbnail: '',
          category: '',
          videoUrl: '',
        }
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VideoDataForm>({
    resolver: zodResolver(VideoFormSchema),
    defaultValues,
  })

  const watchedValues = watch()

  useEffect(() => {
    localStorage.setItem('videoData', JSON.stringify(watchedValues))
  }, [watchedValues])

  const handleConfirm = async (data: VideoDataForm) => {
    try {
      setIsLoading(true)

      const paymentTxId = await processPayment()

      const updatedData = { ...data, paymentTxId }
      localStorage.setItem('videoData', JSON.stringify(updatedData))

      const assetResponse = await createAsset({
        thumbnail: data.thumbnail || '',
        assetType: 'vod', // vod or live
        title: data.title,
        contentOwnerId: CONTENT_OWNER_ID,
        platform: PLATFORM,
        description: data.description,
        externalAssetId: createId(),
        sourceUrl: data.videoUrl,
      })

      if (!assetResponse.id) {
        throw new Error('No one asset ID returned')
      }

      const syndicationResponse = await createSyndicationProfile({
        name: `${data.title} - ${PLATFORM}`,
        distributorId: DISTRIBUTOR_ID,
        contentOwnerId: CONTENT_OWNER_ID,
        paymentProfileId: PAYMENT_PROFILE_ID,
        assetId: assetResponse.id,
      })

      const playbackUrl = syndicationResponse.playbackUrl

      if (!playbackUrl) {
        throw new Error('No playbackUrl returned from distribution profile.')
      }

      const updatedDataWithUrl = { ...updatedData, wrappedUrl: playbackUrl }
      localStorage.setItem('videoData', JSON.stringify(updatedDataWithUrl))

      const blockchainVideoData: VideoDataBlockchain = {
        ...data,
        tags:
          data.tags && data.tags.length > 0
            ? data.tags.split(',').map((tag: string) => tag.trim())
            : [],
        creation_date: new Date().toISOString(),
        replay_tracking_url: playbackUrl,
        payment_hash: paymentTxId,
      }

      const videoCreationTxId = await addVideosToBlockchain({
        userAddress: walletAddress!,
        videoData: blockchainVideoData,
      })

      const finalData = { ...updatedDataWithUrl, videoCreationTxId }
      localStorage.setItem('videoData', JSON.stringify(finalData))

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // email: userEmail,
          payment_hash: paymentTxId,
          video_creation_hash: videoCreationTxId,
          userAddress: walletAddress,
          title: data.title,
          description: data.description,
          tags:
            data.tags && data.tags.length > 0
              ? data.tags.split(',').map((tag: string) => tag.trim())
              : [],
          thumbnail: data.thumbnail,
          category: data.category,
          creation_date: new Date().toISOString(),
          replay_tracking_url: playbackUrl,
          is_active: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Error to save video')
      }

      onGenerateUrl()

      toast.success('video added successfully!')
    } catch (error: any) {
      if (error?.action === 'sendTransaction' && error?.reason === 'rejected') {
        return
      }

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
        process.env.NEXT_PUBLIC_RPLAY_CONTRACT_ADDRESS!,
      )

      const userBalanceNumber = parseFloat(userRplayBalance)

      if (userBalanceNumber < AMOUNT_PER_URL) {
        throw new Error('Insufficient RPLAY balance.')
      }

      const txHash = await web3Service.transferToken(
        TREASURE_WALLET,
        AMOUNT_PER_URL,
        process.env.NEXT_PUBLIC_RPLAY_CONTRACT_ADDRESS!,
      )

      return txHash
    } catch (error: any) {
      console.error('Error processing payment:', error)
      throw error
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form
        className="w-[600px] space-y-4"
        onSubmit={handleSubmit(handleConfirm)}
      >
        <div>
          <label className="mb-1 block font-semibold">Video Title *</label>
          <Input {...register('title')} placeholder="Enter video title" />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold">
            Video Description *
          </label>
          <Textarea
            {...register('description')}
            placeholder="Enter video description"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold">Video URL *</label>
          <Input
            {...register('videoUrl')}
            placeholder="Enter video URL (HLS only)"
          />
          {errors.videoUrl && (
            <p className="mt-2 text-sm text-red-500">
              {errors.videoUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-semibold">Custom Thumbnail *</label>
          <Input
            {...register('thumbnail')}
            placeholder="Enter the URL of the thumbnail"
          />
          {errors.thumbnail && (
            <p className="mt-2 text-sm text-red-500">
              {errors.thumbnail.message}
            </p>
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
          {errors.category && (
            <p className="mt-2 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-3 h-12 w-full font-semibold"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Generate URL'}
        </Button>
      </form>
    </div>
  )
}
