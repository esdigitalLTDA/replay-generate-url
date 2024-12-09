'use server'

import { ethers } from 'ethers'

import { MOVIES_CONTRACT_ABI } from './constants/movie-contract-abi'
import { campNetworkTestnet } from './constants/network-connections'

const PRIVATE_KEY = process.env.PRIVATE_KEY!

const MOVIE_CONTRACT_ADDRESS = '0xACd8Ba92B553586b7DeeCda88724E614993A0E5D'

const provider = new ethers.JsonRpcProvider(campNetworkTestnet.rpcUrls[0])

const signer = new ethers.Wallet(PRIVATE_KEY, provider)

function getMoviesContract() {
  return new ethers.Contract(
    MOVIE_CONTRACT_ADDRESS,
    MOVIES_CONTRACT_ABI,
    signer,
  )
}

interface VideoData {
  title: string
  description: string
  tags: string[]
  thumbnail: string
  category: string
  publicationDate: string
  wrappedUrl: string
  paymentTxId: string
}

export async function addMovieToBlockchain({
  userAddress,
  videoData,
}: {
  userAddress: string
  videoData: VideoData
}) {
  try {
    const contract = getMoviesContract()

    const tx = await contract.addMovie(userAddress, {
      title: videoData.title,
      description: videoData.description,
      tags: videoData.tags,
      thumbnail: videoData.thumbnail,
      category: videoData.category,
      creation_date: videoData.publicationDate,
      REPLAY_TRACKING_URL: videoData.wrappedUrl,
      TX_ID: videoData.paymentTxId,
    })

    const receipt = await tx.wait()
    return receipt.hash
  } catch (error: any) {
    console.error('Error in addMovieToBlockchain:', error?.message)
    throw error
  }
}

export async function updateMovieOnBlockchain({
  userAddress,
  movieIndex,
  videoData,
}: {
  userAddress: string
  movieIndex: number
  videoData: VideoData
}) {
  try {
    const contract = getMoviesContract()

    const tx = await contract.updateMovie(userAddress, movieIndex, {
      title: videoData.title,
      description: videoData.description,
      tags: videoData.tags,
      thumbnail: videoData.thumbnail,
      category: videoData.category,
      creation_date: videoData.publicationDate,
      REPLAY_TRACKING_URL: videoData.wrappedUrl,
      TX_ID: videoData.paymentTxId,
    })

    const receipt = await tx.wait()
    return receipt.transactionHash
  } catch (error: any) {
    console.error('Error in updateMovieOnBlockchain:', error?.message)
    throw error
  }
}

export async function fetchMoviesFromBlockchain(userAddress: string) {
  try {
    const contract = getMoviesContract()
    const movies = await contract.getMoviesByUser(userAddress)

    return movies.map((movie: any) => ({
      title: movie.title,
      description: movie.description,
      tags: movie.tags,
      thumbnail: movie.thumbnail,
      category: movie.category,
      creation_date: movie.creation_date,
      REPLAY_TRACKING_URL: movie.REPLAY_TRACKING_URL,
      TX_ID: movie.TX_ID,
      is_active: movie.is_active,
    }))
  } catch (error: any) {
    console.error('Error in fetchMoviesFromBlockchain:', error?.message)
    throw error
  }
}
