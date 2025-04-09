import { nextHandler } from 'payload/next'
import { getPayloadClient } from '@/lib/payload'

const getPayload = async (req, res) => {
  return await getPayloadClient()
}

export const GET = nextHandler(getPayload)
export const POST = nextHandler(getPayload)
export const PUT = nextHandler(getPayload)
export const PATCH = nextHandler(getPayload)
export const DELETE = nextHandler(getPayload)
