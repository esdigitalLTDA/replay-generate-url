'use server'

import { ethers } from 'ethers'

import { campNetworkTestnet } from './constants/network-connections'
import { VIDEOS_CONTRACT_ABI } from './constants/video-contract-abi'

const PRIVATE_KEY = process.env.PRIVATE_KEY!

const VIDEOS_CONTRACT_ADDRESS = process.env.VIDEOS_CONTRACT_ADDRESS!

const provider = new ethers.JsonRpcProvider(campNetworkTestnet.rpcUrls[0])

const signer = new ethers.Wallet(PRIVATE_KEY, provider)

export interface VideoDataBlockchain {
  title: string
  description: string
  tags?: string[]
  thumbnail?: string
  category?: string
  creation_date?: string
  replay_tracking_url: string
  payment_hash: string
}

function getVideosContract() {
  return new ethers.Contract(
    VIDEOS_CONTRACT_ADDRESS,
    VIDEOS_CONTRACT_ABI,
    signer,
  )
}

export async function addVideosToBlockchain({
  userAddress,
  videoData,
}: {
  userAddress: string
  videoData: VideoDataBlockchain
}) {
  try {
    const contract = getVideosContract()

    const tx = await contract.addVideo(userAddress, {
      title: videoData.title,
      description: videoData.description,
      tags: videoData.tags,
      thumbnail: videoData.thumbnail,
      category: videoData.category,
      creation_date: videoData.creation_date,
      replay_tracking_url: videoData.replay_tracking_url,
      payment_hash: videoData.payment_hash,
    })

    const receipt = await tx.wait()
    return receipt.hash
  } catch (error: any) {
    console.error('Error in addVideosToBlockchain:', error?.message)
    throw error
  }
}

export async function updateVideosOnBlockchain({
  userAddress,
  videosIndex,
  videoData,
}: {
  userAddress: string
  videosIndex: number
  videoData: VideoDataBlockchain
}) {
  try {
    const contract = getVideosContract()

    const tx = await contract.updateVideo(userAddress, videosIndex, {
      title: videoData.title,
      description: videoData.description,
      tags: videoData.tags,
      thumbnail: videoData.thumbnail,
      category: videoData.category,
      creation_date: videoData.creation_date,
      replay_tracking_url: videoData.replay_tracking_url,
      payment_hash: videoData.payment_hash,
    })

    const receipt = await tx.wait()
    return receipt.transactionHash
  } catch (error: any) {
    console.error('Error in updateVideosOnBlockchain:', error?.message)
    throw error
  }
}

export async function fetchVideosFromBlockchain(userAddress: string) {
  try {
    const contract = getVideosContract()
    const videos = await contract.getVideosByUser(userAddress)

    return videos.map((videos: any) => ({
      title: videos.title,
      description: videos.description,
      tags: videos.tags,
      thumbnail: videos.thumbnail,
      category: videos.category,
      creation_date: videos.creation_date,
      replay_tracking_url: videos.replay_tracking_url,
      payment_hash: videos.payment_hash,
      is_active: videos.is_active,
    }))
  } catch (error: any) {
    console.error('Error in fetchVideosFromBlockchain:', error?.message)
    throw error
  }
}
