import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const payload = await getPayloadClient()
  try {
    const body = await request.json()

    // Basic validation
    if (!body.orderId || !body.paymentMethod || !body.paymentDetails) {
      return NextResponse.json({ error: 'Missing required payment information' }, { status: 400 })
    }

    // Get the order
    const order = await payload.findByID({
      collection: 'orders',
      id: body.orderId,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Order has already been processed' }, { status: 400 })
    }

    // Process the payment (In a real app, this would connect to a payment gateway)
    // This is a mock implementation
    let paymentSuccess = true
    let transactionId = 'TRANS-' + Date.now().toString()

    // For demo purposes, we're simulating a payment failure for certain conditions
    if (body.paymentDetails.cardNumber && body.paymentDetails.cardNumber.endsWith('0000')) {
      paymentSuccess = false
    }

    if (paymentSuccess) {
      // Update the order with payment information
      await payload.update({
        collection: 'orders',
        id: body.orderId,
        data: {
          status: 'paid',
          paymentMethod: body.paymentMethod,
          paymentTransactionId: transactionId,
        },
      })

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        paymentStatus: 'success',
        transactionId,
      })
    } else {
      // Update the order with failed payment status
      await payload.update({
        collection: 'orders',
        id: body.orderId,
        data: {
          status: 'pending',
          notes: (order.notes || '') + '\nPayment attempt failed at ' + new Date().toISOString(),
        },
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Payment processing failed',
          orderNumber: order.orderNumber,
          paymentStatus: 'failed',
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}
