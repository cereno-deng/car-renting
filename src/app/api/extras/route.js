import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayloadClient()
  try {
    // Query extras from Payload CMS
    const extras = await payload.find({
      collection: 'extras',
      // Only get active extras
      where: {
        status: {
          equals: 'active',
        },
      },
      // Populate the icon relationship
      depth: 1,
    })

    // Format the data for the frontend
    const formattedExtras = extras.docs.map((extra) => ({
      id: extra.id,
      name: extra.name,
      description: extra.description,
      price: extra.pricePerDay,
      // Get the icon URL if it exists
      iconUrl: extra.icon ? `/api/media/${extra.icon.filename}` : null,
    }))

    return NextResponse.json(formattedExtras)
  } catch (error) {
    console.error('Error fetching extras:', error)
    return NextResponse.json({ error: 'Failed to fetch extras' }, { status: 500 })
  }
}
