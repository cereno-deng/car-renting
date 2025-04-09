import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayloadClient()
  try {
    // Query cars from Payload CMS
    const cars = await payload.find({
      collection: 'cars',
      // Only get cars that are available
      where: {
        status: {
          equals: 'available',
        },
      },
      // Populate the images relationship
      depth: 1,
    })

    // Format the data for the frontend
    const formattedCars = cars.docs.map((car) => ({
      id: car.id,
      name: car.name,
      type: car.type,
      description: car.description,
      price: car.pricePerDay,
      capacity: car.capacity,
      transmission: car.transmission,
      fuelType: car.fuelType,
      // Map the images to their URLs
      images: car.images.map((img) => `/api/media/${img.image.filename}`),
      features: car.features?.map((f) => f.feature) || [],
    }))

    return NextResponse.json(formattedCars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}
