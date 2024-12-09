import mongoose, { Schema } from 'mongoose'

const MovieSchema = new Schema({
  payment_TX_ID: { type: String, required: true },
  movie_creation_TX_ID: { type: String, required: true },
  userAddress: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String] },
  thumbnail: { type: String },
  category: { type: String },
  creation_date: { type: Date },
  REPLAY_TRACKING_URL: { type: String, required: true },
  TX_ID: { type: String, required: true },
  is_active: { type: Boolean, default: true },
})

export const Movie =
  mongoose.models.movies || mongoose.model('movies', MovieSchema)
