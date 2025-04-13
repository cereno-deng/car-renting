// src/app/api/cars/route.js
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function POST(request) {
  try {
    // Get the initialized Payload client
    const payload = await getPayloadClient()

    const body = await request.json()

    // Create car through Payload CMS
    const car = await payload.create({
      collection: 'cars', // The collection slug from your schema
      data: {
        // Map request body to your Payload schema fields
        brand: body.brand,
        model: body.model,
        packageName: body.packageName,
        packageDescription: body.packageDescription,
        normalPrice: body.normalPrice,
        holidayPrice: body.holidayPrice,
        minRentalPeriod: body.minRentalPeriod,
        normalPriceMinRentalPeriod: body.normalPriceMinRentalPeriod,
        holidayPriceMinRentalPeriod: body.holidayPriceMinRentalPeriod,
        insuranceFee: body.insuranceFee,
        cleaningFee: body.cleaningFee,
        mileage: body.mileage,
        campingTable: body.campingTable,
        campingChair: body.campingChair,
        mattress: body.mattress,
        gasStove: body.gasStove,
        refrigerator: body.refrigerator,
        sink: body.sink,
        hvac: body.hvac,
        bathroom: body.bathroom,
        gasBarrel: body.gasBarrel,
        aroundViewMonitor: body.aroundViewMonitor,
        status: body.status || 'available',
        images: body.images,
      },
    })

    // Return success response with the created car data
    return NextResponse.json(
      {
        success: true,
        message: 'Car created successfully',
        car,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating car with Payload:', error)

    // Return more specific error messages for common issues
    if (error.errors) {
      // Format validation errors from Payload
      const validationErrors = Object.entries(error.errors)
        .map(([field, fieldErrors]) => `${field}: ${fieldErrors.message}`)
        .join(', ')

      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Failed to create car', details: error.message },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    // Get the initialized Payload client
    const payload = await getPayloadClient()

    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const brand = searchParams.get('brand')

    // Build the query object for Payload
    const where = {}

    if (status) {
      where.status = {
        equals: status,
      }
    }

    if (brand) {
      where.brand = {
        equals: brand,
      }
    }

    // Fetch cars from Payload CMS with filters
    const result = await payload.find({
      collection: 'cars',
      where: Object.keys(where).length > 0 ? where : undefined,
      depth: 2, // To populate related fields like images
    })

    return NextResponse.json(result.docs)
  } catch (error) {
    console.error('Error fetching cars from Payload:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cars', details: error.message },
      { status: 500 },
    )
  }
}
