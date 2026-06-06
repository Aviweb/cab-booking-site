/**
 * Clear Database Script  
 * Removes all data from the database
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Clearing database...')

  try {
    // Delete in order due to foreign key constraints
    console.log('   🗑️  Deleting bookings...')
    const deletedBookings = await prisma.bookings.deleteMany()
    console.log(`   ✅ Deleted ${deletedBookings.count} bookings`)

    console.log('   🗑️  Deleting drivers...')
    const deletedDrivers = await prisma.drivers.deleteMany()
    console.log(`   ✅ Deleted ${deletedDrivers.count} drivers`)

    console.log('   🗑️  Deleting passengers...')
    const deletedPassengers = await prisma.passengers.deleteMany()
    console.log(`   ✅ Deleted ${deletedPassengers.count} passengers`)

    console.log('\n✨ Database cleared successfully!')
    
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 Clear operation failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })