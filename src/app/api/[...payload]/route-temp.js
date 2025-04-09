import { nextHandler } from 'payload/next'
import { getPayloadClient } from '@/lib/payload'

// Next.js API route handlers
export async function GET(req, res) {
  const payload = await getPayloadClient()
  return nextHandler(req, res)
}

export async function POST(req, res) {
  const payload = await getPayloadClient()
  return nextHandler(req, res)
}

export async function PUT(req, res) {
  const payload = await getPayloadClient()
  return nextHandler(req, res)
}

export async function PATCH(req, res) {
  const payload = await getPayloadClient()
  return nextHandler(req, res)
}

export async function DELETE(req, res) {
  const payload = await getPayloadClient()
  return nextHandler(req, res)
}
