import mongoose, { ObjectId, Schema } from 'mongoose'

export interface IVideo {
  _id: ObjectId
  title: string
  description: string
  replay_tracking_url: string
  userAddress: string
  payment_hash: string
  video_creation_hash: string
  thumbnail?: string
  tags?: string[]
  category?: string
  creation_date: string
  is_active?: boolean
}

export const VideoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  replay_tracking_url: { type: String, required: true },
  userAddress: { type: String, required: true },
  payment_hash: { type: String, required: true },
  video_creation_hash: { type: String, required: true },
  thumbnail: { type: String },
  tags: { type: [String] },
  category: { type: String },
  creation_date: { type: String },
  is_active: { type: Boolean, default: true },
})

export const Video =
  mongoose.models.Video || mongoose.model('Video', VideoSchema)
