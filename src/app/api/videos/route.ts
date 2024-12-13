/* eslint-disable camelcase */
import { NextRequest } from 'next/server'

import { Video } from '@/models/video'
import { connectDb } from '@/services/database/connection'

import { VideoSchema, VideoUpdateSchema } from './schema'

export async function GET(req: NextRequest) {
  await connectDb()

  try {
    const { searchParams } = new URL(req.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress) {
      return new Response(
        JSON.stringify({ success: false, error: 'User address is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const videos = await Video.find({
      userAddress,
    })

    if (!videos || videos.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No videos found for this user',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(JSON.stringify({ success: true, data: videos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error fetching videos:', error?.message)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Server Error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

export async function POST(req: NextRequest) {
  await connectDb()

  try {
    const body = await req.json()

    const parseResult = VideoSchema.safeParse(body)

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }))

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation Error',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const newVideo = new Video(parseResult.data)
    const savedVideo = await newVideo.save()

    return new Response(JSON.stringify({ success: true, data: savedVideo }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error saving video:', error?.message)
    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

export async function PUT(req: NextRequest) {
  await connectDb()

  try {
    const body = await req.json()

    const parseResult = VideoUpdateSchema.safeParse(body)

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }))

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation Error',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { _id, ...updateData } = parseResult.data

    const updatedVideo = await Video.findByIdAndUpdate(_id, updateData, {
      new: true,
    })

    if (!updatedVideo) {
      return new Response(
        JSON.stringify({ success: false, error: 'Video not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify({ success: true, data: updatedVideo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error updating video:', error?.message)
    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
