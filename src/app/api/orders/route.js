import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const payload = await getPayloadClient()
  try {
    const body = await request.json()

    // Basic validation
    if (!body.customerId || !body.carId || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate the total rental days
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    const diffTime = Math.abs(endDate - startDate)
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

    // Get the car details to calculate total amount
    const car = await payload.findByID({
      collection: 'cars',
      id: body.carId,
    })

    // Get extras details if any
    let extrasTotal = 0
    if (body.extraIds && body.extraIds.length > 0) {
      const extras = await payload.find({
        collection: 'extras',
        where: {
          id: {
            in: body.extraIds,
          },
        },
      })

      extrasTotal = extras.docs.reduce((sum, extra) => sum + extra.pricePerDay, 0) * rentalDays
    }

    // Calculate total amount
    const carTotal = car.pricePerDay * rentalDays
    const totalAmount = carTotal + extrasTotal

    // Generate a unique order number
    const orderNumber =
      'ORD-' +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')

    // Create the order in Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: body.customerId,
        car: body.carId,
        startDate: body.startDate,
        endDate: body.endDate,
        extras: body.extraIds || [],
        totalAmount,
        status: 'pending',
        paymentMethod: body.paymentMethod,
        paymentTransactionId: body.paymentTransactionId,
        notes: body.notes,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
