'use client'
import React, { useState, useEffect } from 'react'
// Pure JavaScript implementation
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  Info,
  ShoppingCart,
  CreditCard,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Mock data for cars that would come from Payload CMS
const MOCK_CARS = [
  {
    id: 1,
    name: 'Toyota Corolla',
    type: 'Sedan',
    price: 45,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: ['/api/placeholder/800/500', '/api/placeholder/800/500', '/api/placeholder/800/500'],
    description: 'Reliable and fuel-efficient sedan perfect for city driving.',
  },
  {
    id: 2,
    name: 'Honda CR-V',
    type: 'SUV',
    price: 65,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    images: ['/api/placeholder/800/500', '/api/placeholder/800/500', '/api/placeholder/800/500'],
    description: 'Spacious SUV with excellent fuel economy and ample storage.',
  },
  {
    id: 3,
    name: 'Mercedes C-Class',
    type: 'Luxury',
    price: 95,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: ['/api/placeholder/800/500', '/api/placeholder/800/500', '/api/placeholder/800/500'],
    description: 'Premium luxury sedan with advanced features and elegant design.',
  },
  {
    id: 4,
    name: 'Ford F-150',
    type: 'Truck',
    price: 85,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    images: ['/api/placeholder/800/500', '/api/placeholder/800/500', '/api/placeholder/800/500'],
    description: 'Powerful pickup truck suitable for both work and leisure.',
  },
]

// Mock data for optional extras
const MOCK_EXTRAS = [
  {
    id: 1,
    name: 'GPS Navigation',
    price: 5,
    description: 'Never get lost with our premium GPS system',
  },
  { id: 2, name: 'Child Seat', price: 10, description: 'Safety-certified seat for children' },
  {
    id: 3,
    name: 'Additional Driver',
    price: 15,
    description: 'Add another authorized driver to your rental',
  },
  {
    id: 4,
    name: 'Premium Insurance',
    price: 20,
    description: 'Full coverage with zero deductible',
  },
  { id: 5, name: 'Wifi Hotspot', price: 8, description: 'Stay connected with unlimited data' },
]

const CarRentalWizard = () => {
  // State for the current step
  const [currentStep, setCurrentStep] = useState(1)

  // State for storing the user's selections
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState([])
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  })
  const [expandedCar, setExpandedCar] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [orderNumber, setOrderNumber] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)

  useEffect(() => {
    // Fetch cars data from API
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars')
        const data = await response.json()
        setCars(data)
      } catch (error) {
        console.error('Error fetching cars:', error)
      }
    }

    // Fetch extras data from API
    const fetchExtras = async () => {
      try {
        const response = await fetch('/api/extras')
        const data = await response.json()
        setExtras(data)
      } catch (error) {
        console.error('Error fetching extras:', error)
      }
    }

    fetchCars()
    fetchExtras()
  }, [])

  // Calculate number of days
  const calculateDays = () => {
    if (dateRange.from && dateRange.to) {
      const diffTime = Math.abs(dateRange.to - dateRange.from)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    }
    return 1
  }

  // Calculate total price
  const calculateTotal = () => {
    const days = calculateDays()
    const carPrice = selectedCar ? selectedCar.price * days : 0
    const extrasPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0) * days
    return carPrice + extrasPrice
  }

  // Handle car selection
  const handleCarSelect = (car) => {
    setSelectedCar(car)
    setExpandedCar(null)
    setCurrentImageIndex(0)
  }

  // Handle extras selection
  const handleExtraToggle = (extra) => {
    if (selectedExtras.some((item) => item.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((item) => item.id !== extra.id))
    } else {
      setSelectedExtras([...selectedExtras, extra])
    }
  }

  // Toggle car details expansion
  const toggleCarExpansion = (carId) => {
    if (expandedCar === carId) {
      setExpandedCar(null)
    } else {
      setExpandedCar(carId)
      setCurrentImageIndex(0)
    }
  }

  // Navigate to the next slide in the car images
  const nextImage = (car) => {
    setCurrentImageIndex((prevIndex) => (prevIndex < car.images.length - 1 ? prevIndex + 1 : 0))
  }

  // Navigate to the previous slide in the car images
  const prevImage = (car) => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : car.images.length - 1))
  }

  // Handle navigation between steps
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const goToHome = () => {
    setCurrentStep(1)
    setSelectedCar(null)
    setSelectedExtras([])
    setDateRange({ from: null, to: null })
    setExpandedCar(null)
    setCurrentImageIndex(0)
    setOrderNumber(null)
    setPaymentStatus(null)
  }

  // Handle payment submission
  const handlePayment = async () => {
    try {
      // Create order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: '123', // In production, get from authenticated user
          carId: selectedCar.id,
          startDate: dateRange.from,
          endDate: dateRange.to,
          extraIds: selectedExtras.map((extra) => extra.id),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Process payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.order.id,
          paymentMethod: 'credit_card',
          paymentDetails: {
            // In production, get from payment form
            cardNumber: '4111111111111111',
            expiryDate: '12/25',
            cvv: '123',
          },
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.success) {
        setOrderNumber(paymentData.orderNumber)
        setPaymentStatus('success')
        setCurrentStep(5)
      } else {
        // Handle payment failure
        alert('Payment failed: ' + (paymentData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Checkout failed: ' + error.message)
    }
  }

  // Validate if the user can proceed to the next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!selectedCar
      case 2:
        return true // Optional extras are... optional
      case 3:
        return dateRange.from && dateRange.to
      case 4:
        return true // Payment is validated differently
      default:
        return false
    }
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Choose a Car</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_CARS.map((car) => (
                <Card
                  key={car.id}
                  className={`overflow-hidden ${selectedCar?.id === car.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="flex justify-between items-center">
                      <span>{car.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => toggleCarExpansion(car.id)}>
                        {expandedCar === car.id ? (
                          <MinusCircle size={20} />
                        ) : (
                          <PlusCircle size={20} />
                        )}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      ${car.price}/day - {car.type}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={car.images[currentImageIndex]}
                        alt={car.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="opacity-70 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage(car)
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="opacity-70 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage(car)
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      </div>
                    </div>

                    {expandedCar === car.id && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">{car.description}</p>
                        <div className="grid grid-cols-2 text-sm">
                          <div>Capacity: {car.capacity} people</div>
                          <div>Transmission: {car.transmission}</div>
                          <div>Fuel Type: {car.fuelType}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => handleCarSelect(car)}
                      variant={selectedCar?.id === car.id ? 'secondary' : 'default'}
                    >
                      {selectedCar?.id === car.id ? 'Selected' : 'Select this car'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Optional Extras</h2>
            <div className="grid gap-4">
              {MOCK_EXTRAS.map((extra) => {
                const isSelected = selectedExtras.some((item) => item.id === extra.id)
                return (
                  <Card key={extra.id} className={isSelected ? 'border-blue-500' : ''}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Checkbox
                          id={`extra-${extra.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleExtraToggle(extra)}
                          className="mr-2"
                        />
                        <label htmlFor={`extra-${extra.id}`} className="flex-1 cursor-pointer">
                          {extra.name} - ${extra.price}/day
                        </label>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription>{extra.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Rental Dates</h2>
            <div className="flex flex-col items-center space-y-4">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from || null,
                    to: range?.to || null,
                  })
                }}
                className="rounded-md border"
                initialFocus
              />

              <div className="mt-4 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pick-up date:</span>
                        <span className="font-medium">
                          {dateRange.from ? dateRange.from.toLocaleDateString() : 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return date:</span>
                        <span className="font-medium">
                          {dateRange.to ? dateRange.to.toLocaleDateString() : 'Not selected'}
                        </span>
                      </div>
                      {dateRange.from && dateRange.to && (
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{calculateDays()} days</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Summary & Payment</h2>
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCar && (
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-lg">Selected Vehicle</h3>
                    <div className="flex justify-between mt-2">
                      <span>
                        {selectedCar.name} ({selectedCar.type})
                      </span>
                      <span>
                        ${selectedCar.price} × {calculateDays()} days = $
                        {selectedCar.price * calculateDays()}
                      </span>
                    </div>
                  </div>
                )}

                {selectedExtras.length > 0 && (
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-lg">Optional Extras</h3>
                    <div className="space-y-2 mt-2">
                      {selectedExtras.map((extra) => (
                        <div key={extra.id} className="flex justify-between">
                          <span>{extra.name}</span>
                          <span>
                            ${extra.price} × {calculateDays()} days = $
                            {extra.price * calculateDays()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-b pb-4">
                  <h3 className="font-medium text-lg">Rental Period</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Pick-up:</span>
                      <span>{dateRange.from?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span>{dateRange.to?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Duration:</span>
                      <span>{calculateDays()} days</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handlePayment}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Confirmation</h2>
            <Alert variant="default" className="bg-green-50 border-green-200">
              <Info className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Payment Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your payment has been processed successfully.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Order Number:</span>
                  <span>{orderNumber}</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium">Vehicle:</h3>
                  <p>{selectedCar?.name}</p>
                </div>

                {selectedExtras.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium">Extras:</h3>
                    <ul className="list-disc list-inside">
                      {selectedExtras.map((extra) => (
                        <li key={extra.id}>{extra.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-medium">Rental Period:</h3>
                  <p>
                    From {dateRange.from?.toLocaleDateString()} to{' '}
                    {dateRange.to?.toLocaleDateString()}
                  </p>
                  <p>Duration: {calculateDays()} days</p>
                </div>

                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total Paid:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={goToHome}>
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      default:
        return <div>Invalid step</div>
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Premium Car Rentals</h1>
        <div className="flex justify-center">
          <Tabs
            defaultValue={currentStep.toString()}
            value={currentStep.toString()}
            className="w-full max-w-3xl"
          >
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="1" disabled>
                Car
              </TabsTrigger>
              <TabsTrigger value="2" disabled>
                Extras
              </TabsTrigger>
              <TabsTrigger value="3" disabled>
                Dates
              </TabsTrigger>
              <TabsTrigger value="4" disabled>
                Payment
              </TabsTrigger>
              <TabsTrigger value="5" disabled>
                Confirmation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">{renderStep()}</div>

      {currentStep < 5 && (
        <div className="mt-6 flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={goToPreviousStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 && (
            <Button onClick={goToNextStep} disabled={!canProceedToNextStep()}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default CarRentalWizard
