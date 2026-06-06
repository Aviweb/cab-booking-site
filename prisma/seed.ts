/**
 * Database Seeding Script
 * Creates dummy data for testing purposes
 */

import { PrismaClient, BookingStatus, CarType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Test user credentials (use these for testing)
const TEST_PASSWORD = 'TestPass123!'

const drivers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.driver@example.com',
    phone: '+91-9876543210'
  },
  {
    name: 'Amit Singh',
    email: 'amit.driver@example.com', 
    phone: '+91-9876543211'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.driver@example.com',
    phone: '+91-9876543212'
  },
  {
    name: 'Suresh Patel',
    email: 'suresh.driver@example.com',
    phone: '+91-9876543213'
  },
  {
    name: 'Kavita Reddy',
    email: 'kavita.driver@example.com',
    phone: '+91-9876543214'
  }
]

const passengers = [
  {
    name: 'John Doe',
    email: 'john.passenger@example.com',
    phone: '+91-9123456789'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.passenger@example.com',
    phone: '+91-9123456788'
  },
  {
    name: 'Mike Wilson',
    email: 'mike.passenger@example.com', 
    phone: '+91-9123456787'
  },
  {
    name: 'Lisa Brown',
    email: 'lisa.passenger@example.com',
    phone: '+91-9123456786'
  },
  {
    name: 'David Lee',
    email: 'david.passenger@example.com',
    phone: '+91-9123456785'
  },
  {
    name: 'Emma Davis',
    email: 'emma.passenger@example.com',
    phone: '+91-9123456784'
  }
]

const locations = [
  'Hyderabad Airport (RGIA)',
  'Gachibowli Tech District',
  'HITEC City',
  'Banjara Hills',
  'Jubilee Hills',
  'Secunderabad Railway Station',
  'Begumpet Airport',
  'Kondapur',
  'Madhapur',
  'Kukatpally',
  'LB Nagar',
  'Dilsukhnagar',
  'Ameerpet',
  'Somajiguda',
  'Abids',
  'Charminar',
  'Golconda Fort',
  'Uppal',
  'Miyapur',
  'SR Nagar'
]

const carTypes = [CarType.SWIFT, CarType.ETIOS, CarType.ERTIGA, CarType.INNOVA, CarType.TRAVELLER]

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomDate(daysBack: number = 30, daysForward: number = 30): Date {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - daysBack)
  
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysForward)
  
  const randomTime = pastDate.getTime() + Math.random() * (futureDate.getTime() - pastDate.getTime())
  return new Date(randomTime)
}

function getRandomFare(): number {
  return Math.floor(Math.random() * 1500) + 200 // Between ₹200-₹1700
}

function getRandomDistance(): number {
  return Math.floor(Math.random() * 50) + 5 // Between 5-55 km
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash password once for all users
  const hashedPassword = await hashPassword(TEST_PASSWORD)

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await prisma.bookings.deleteMany()
    await prisma.drivers.deleteMany() 
    await prisma.passengers.deleteMany()

    // Create Drivers
    console.log('👨‍🚗 Creating drivers...')
    const createdDrivers = []
    for (const driver of drivers) {
      const createdDriver = await prisma.drivers.create({
        data: {
          ...driver,
          password: hashedPassword,
          isActive: Math.random() > 0.1 // 90% active
        }
      })
      createdDrivers.push(createdDriver)
      console.log(`   ✅ Created driver: ${driver.name}`)
    }

    // Create Passengers  
    console.log('👥 Creating passengers...')
    const createdPassengers = []
    for (const passenger of passengers) {
      const createdPassenger = await prisma.passengers.create({
        data: {
          ...passenger,
          password: hashedPassword,
          isActive: true
        }
      })
      createdPassengers.push(createdPassenger)
      console.log(`   ✅ Created passenger: ${passenger.name}`)
    }

    // Create Bookings with various statuses
    console.log('🚗 Creating bookings...')
    const bookingStatuses = [
      BookingStatus.PENDING,
      BookingStatus.ACCEPTED, 
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
      BookingStatus.REJECTED
    ]

    for (let i = 0; i < 25; i++) {
      const passenger = getRandomItem(createdPassengers)
      const driver = Math.random() > 0.3 ? getRandomItem(createdDrivers) : null // 70% have drivers
      const status = getRandomItem(bookingStatuses)
      const startLocation = getRandomItem(locations)
      let endLocation = getRandomItem(locations)
      
      // Ensure different start and end locations
      while (endLocation === startLocation) {
        endLocation = getRandomItem(locations)
      }

      const baseDateTime = getRandomDate()
      const estimatedFare = getRandomFare()
      const actualFare = status === BookingStatus.COMPLETED ? estimatedFare + Math.floor(Math.random() * 200) - 100 : null

      const booking = await prisma.bookings.create({
        data: {
          car: getRandomItem(carTypes),
          dateTime: baseDateTime,
          startLocation,
          endLocation,
          startLatitude: 17.3850 + (Math.random() - 0.5) * 0.5, // Around Hyderabad
          startLongitude: 78.4867 + (Math.random() - 0.5) * 0.5,
          endLatitude: 17.3850 + (Math.random() - 0.5) * 0.5,
          endLongitude: 78.4867 + (Math.random() - 0.5) * 0.5,
          estimatedDistance: getRandomDistance(),
          estimatedFare,
          actualFare,
          mobile: passenger.phone || '+91-9999999999',
          passengerName: passenger.name,
          specialRequests: Math.random() > 0.7 ? getRandomItem([
            'Please call when you arrive',
            'Air conditioning preferred',
            'Need child seat',
            'Extra luggage space needed',
            'Pet-friendly cab required'
          ]) : null,
          status,
          passengerId: passenger.id,
          driverId: driver?.id,
          acceptedAt: status !== BookingStatus.PENDING ? new Date(baseDateTime.getTime() + 5 * 60000) : null, // 5 min after booking
          completedAt: status === BookingStatus.COMPLETED ? new Date(baseDateTime.getTime() + 45 * 60000) : null, // 45 min after booking  
          cancelledAt: status === BookingStatus.CANCELLED ? new Date(baseDateTime.getTime() + 10 * 60000) : null,
          cancellationNote: status === BookingStatus.CANCELLED ? getRandomItem([
            'Driver not available',
            'Passenger cancelled',
            'Traffic conditions',
            'Emergency situation'
          ]) : null
        }
      })

      console.log(`   ✅ Created booking #${i + 1}: ${startLocation} → ${endLocation} (${status})`)
    }

    // Create some recent pending bookings for testing
    console.log('⏰ Creating recent pending bookings...')
    for (let i = 0; i < 5; i++) {
      const passenger = getRandomItem(createdPassengers)
      const startLocation = getRandomItem(locations)
      let endLocation = getRandomItem(locations)
      
      while (endLocation === startLocation) {
        endLocation = getRandomItem(locations)
      }

      await prisma.bookings.create({
        data: {
          car: getRandomItem(carTypes),
          dateTime: new Date(Date.now() + Math.random() * 2 * 60 * 60 * 1000), // Next 2 hours
          startLocation,
          endLocation,
          estimatedDistance: getRandomDistance(),
          estimatedFare: getRandomFare(),
          mobile: passenger.phone || '+91-9999999999',
          passengerName: passenger.name,
          status: BookingStatus.PENDING,
          passengerId: passenger.id
        }
      })

      console.log(`   ⏰ Created pending booking: ${startLocation} → ${endLocation}`)
    }

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\n📋 Test Credentials:')
    console.log('═══════════════════════════════════════')
    console.log('🔐 Password for all users: TestPass123!')
    console.log('\n👨‍🚗 Driver Accounts:')
    drivers.forEach(driver => {
      console.log(`   • ${driver.email}`)
    })
    console.log('\n👥 Passenger Accounts:')
    passengers.forEach(passenger => {
      console.log(`   • ${passenger.email}`)
    })
    console.log('═══════════════════════════════════════')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })