import { getPayload } from 'payload/dist/payload'

let cachedPayload = null

export const getPayloadClient = async () => {
  // Initialize Payload with required settings
  if (cachedPayload) return cachedPayload

  const payload = await getPayload({
    secret: process.env.PAYLOAD_SECRET || 'development-secret-key',
    local: true,
  })

  cachedPayload = payload
  return payload
}
