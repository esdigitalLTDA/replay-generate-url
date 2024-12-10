'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { VideoDataForm, VideoFormSchema } from '@/app/(dashboard)/video-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THETA_TESTNET } from '@/services/constants/network-connections'
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

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoDataForm>({
    resolver: zodResolver(VideoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      category: '',
      publicationDate: '',
      videoUrl: '',
    },
  })

  useEffect(() => {
    const savedData = localStorage.getItem('videoData')
    if (savedData) {
      const parsedData: VideoDataForm = JSON.parse(savedData)
      Object.keys(parsedData).forEach((key) => {
        setValue(
          key as keyof VideoDataForm,
          parsedData[key as keyof VideoDataForm] as string,
        )
      })
    }
  }, [setValue])

  const watchAllFields = useForm<VideoDataForm>().watch
  useEffect(() => {
    watchAllFields((value) => {
      localStorage.setItem('videoData', JSON.stringify(value))
    })
  }, [watchAllFields])

  const handleConfirm = async (data: VideoDataForm) => {
    if (!isHLS(data.videoUrl)) {
      toast.error('The URL is not a valid HLS video.')
      return
    }

    try {
      setIsLoading(true)

      // const paymentTxId = await processPayment()
      const paymentTxId = '123'

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
        creation_date: data.publicationDate,
        replay_tracking_url: playbackUrl,
        payment_hash: paymentTxId,
      }

      const videoCreationTxId = await addVideosToBlockchain({
        userAddress: walletAddress!,
        videoData: blockchainVideoData,
      })

      console.log('videoCreationTxId', videoCreationTxId)

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
          creation_date: data.publicationDate,
          replay_tracking_url: playbackUrl,
          is_active: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Error to save video')
      }

      localStorage.removeItem('videoData')
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

      await web3Service.changeNetwork(THETA_TESTNET.chainId)

      const provider = await web3Service.getMetaMaskProvider()
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      const userRplayBalance = await web3Service.getTokenBalance(
        userAddress,
        RPLAY_CONTRACT_ADDRESS,
      )

      const userBalanceNumber = parseFloat(userRplayBalance)

      console.log('userBalanceNumber', userBalanceNumber)

      if (userBalanceNumber < AMOUNT_PER_URL) {
        throw new Error('Insufficient RPLAY balance.')
      }

      const txHash = await web3Service.transferToken(
        TREASURE_WALLET,
        AMOUNT_PER_URL,
        RPLAY_CONTRACT_ADDRESS,
      )

      console.log('transferToken', txHash)

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
          <Input
            {...register('title')}
            required
            placeholder="Enter video title"
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold">
            Video Description *
          </label>
          <Textarea
            {...register('description')}
            required
            placeholder="Enter video description"
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold">Video URL *</label>
          <Input
            {...register('videoUrl')}
            required
            placeholder="Enter video URL (HLS only)"
          />
          {errors.videoUrl && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.videoUrl.message}
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
          <label className="mb-1 block font-semibold">
            Thumbnail Personalized
          </label>
          <Controller
            name="thumbnail"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files
                  console.log(files)

                  if (files && files.length > 0) {
                    files[0].arrayBuffer().then((buffer) => {
                      setValue('thumbnail', buffer)
                    })
                  }

                  field.onChange(e.target.files)
                }}
                className="mb-1 block"
              />
            )}
          />
          {/* {errors.thumbnail && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.thumbnail.message}
            </p>
          )} */}
        </div>

        <div>
          <label className="mb-1 block font-semibold">Category</label>
          <Input {...register('category')} placeholder="Enter category" />
          {errors.category && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold">Publication Date</label>
          <Input type="date" {...register('publicationDate')} />
          {errors.publicationDate && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.publicationDate.message}
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
