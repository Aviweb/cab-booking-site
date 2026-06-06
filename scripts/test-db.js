/**
 * Database Connection Test Script
 * Tests if the database is reachable
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Testing database connection...')
  console.log(`📡 Connecting to: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')}`)

  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    
    // Get some basic stats
    try {
      const driverCount = await prisma.drivers.count()
      const passengerCount = await prisma.passengers.count()
      const bookingCount = await prisma.bookings.count()
      
      console.log('\n📊 Current Database Stats:')
      console.log(`   👨‍🚗 Drivers: ${driverCount}`)
      console.log(`   👥 Passengers: ${passengerCount}`)
      console.log(`   🚗 Bookings: ${bookingCount}`)
      
      if (driverCount === 0 && passengerCount === 0) {
        console.log('\n💡 Database is empty. Run `npm run db:seed` to add test data!')
      }
      
    } catch (err) {
      console.log('\n⚠️  Connection works but tables may not exist yet.')
      console.log('   Run `npx prisma migrate deploy` to create tables.')
    }
    
  } catch (error) {
    console.log('❌ Database connection failed!')
    console.log(`   Error: ${error.message}`)
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n🔧 Possible solutions:')
      console.log('   1. Check if database server is running')
      console.log('   2. Verify DATABASE_URL in .env file')
      console.log('   3. Check network connectivity')
      console.log('   4. Contact your database provider (Clever Cloud)')
    }
  }
}

main()
  .catch((e) => {
    console.error('💥 Test failed:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })