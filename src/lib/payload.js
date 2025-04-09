// src/lib/payload.js
import payload from 'payload'

// Singleton to store the initialized payload instance
let payloadClient = null

export const getPayloadClient = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    process.env.PAYLOAD_SECRET = 'development-secret-key'
  }

  if (payloadClient) {
    return payloadClient
  }

  // Initialize Payload if it hasn't been initialized yet
  if (!payload.initialized) {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
      onInit: () => {
        console.log('Payload initialized')
      },
      // Add other configuration options as needed
    })
  }

  payloadClient = payload
  return payload
}
