/* eslint-disable camelcase */
import { NextRequest } from 'next/server'
import { ZodSchema } from 'zod'

import { Movie } from '@/models/movie'
import { connectDb } from '@/services/database/connection'

import { movieSchema } from './schemas'

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

    const movies = await Movie.find({
      userAddress,
    })

    if (!movies || movies.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No movies found for this user',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(JSON.stringify({ success: true, data: movies }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error fetching movies:', error?.message)
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

function validateRequest(schema: ZodSchema, data: any) {
  try {
    return { validData: schema.parse(data), errors: null }
  } catch (err: any) {
    return { validData: null, errors: err.errors }
  }
}

export async function POST(req: NextRequest) {
  await connectDb()

  try {
    const body = await req.json()

    const { validData, errors } = validateRequest(movieSchema, body)

    if (errors) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation Error',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const newMovie = new Movie(validData)
    const savedMovie = await newMovie.save()

    return new Response(JSON.stringify({ success: true, data: savedMovie }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error saving movie:', error?.message)
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

    if (!body._id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Movie ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { validData, errors } = validateRequest(movieSchema, body)

    if (errors) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation Error',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const updatedMovie = await Movie.findByIdAndUpdate(body._id, validData, {
      new: true,
    })

    if (!updatedMovie) {
      return new Response(
        JSON.stringify({ success: false, error: 'Movie not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify({ success: true, data: updatedMovie }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error updating movie:', error?.message)
    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
