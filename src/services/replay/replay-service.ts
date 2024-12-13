'use server'

export interface AssetData {
  thumbnail: string
  assetType: 'vod' | 'live'
  title: string
  contentOwnerId: string
  platform: string
  description: string
  externalAssetId: string
  sourceUrl: string
}

interface SyndicationData {
  name: string
  distributorId: string
  contentOwnerId: string
  paymentProfileId: string
  assetId: string
}

export interface AssetResponse {
  id: string
  title: string
  description: string
  contentOwnerId: string
  externalAssetId: string
  platform: string
  sourceUrl: string
  thumbnailUrl: string
  status: string
  assetType: 'vod' | 'live'
  createdAt: string
  updatedAt: string
  syndicationProfiles: null | any[]
  errorMessage: string
}

export interface SyndicationProfileResponse {
  id: string
  name: string
  assetId: string
  contentOwnerId: string
  distributorId: string
  paymentProfileId: string
  active: boolean
  playbackUrl: string
  createdAt: string
  updatedAt: string
}

const ADMIN_TOKEN = process.env.REPLAY_ADMIN_TOKEN
const BASE_URL = 'https://asset-management-api.imaginereplay.com'

export async function createAsset(asset: AssetData): Promise<AssetResponse> {
  const formData = new FormData()

  formData.append('thumbnailUrl', asset.thumbnail)
  formData.append('assetType', asset.assetType)
  formData.append('title', asset.title)
  formData.append('contentOwnerId', asset.contentOwnerId)
  formData.append('platform', asset.platform)
  formData.append('description', asset.description)
  formData.append('externalAssetId', asset.externalAssetId)
  formData.append('sourceUrl', asset.sourceUrl)

  const response = await fetch(`${BASE_URL}/assets/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(`Failed to create asset: ${errorText}`)
  }

  return response.json()
}

export async function createSyndicationProfile(
  data: SyndicationData,
): Promise<SyndicationProfileResponse> {
  const response = await fetch(`${BASE_URL}/syndication-profiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create syndication profile: ${errorText}`)
  }

  return response.json()
}
