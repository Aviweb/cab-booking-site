# Database Scripts

This directory contains utility scripts for managing test data in your cab booking application.

## Available Scripts

### 🔍 Test Database Connection
```bash
npm run db:test
```
- Tests if database is reachable
- Shows current data counts
- Provides troubleshooting tips if connection fails

### 🌱 Seed Database
```bash
npm run db:seed
```
- Creates dummy drivers, passengers, and bookings
- Uses realistic test data with Indian locations (Hyderabad)
- All users have the same password: `TestPass123!`
- Creates 25 varied bookings with different statuses
- Creates 5 recent pending bookings for testing

### 🧹 Clear Database  
```bash
npm run db:clear
```
- Removes all data from the database
- Maintains table structure and schema
- Safe operation that respects foreign key constraints

### 🔄 Reset Database
```bash
npm run db:reset
```
- Runs migration reset (recreates database)
- Automatically seeds with fresh data
- **⚠️ WARNING: This will delete ALL existing data**

### 🎪 Prisma Studio
```bash
npm run db:studio
```
- Opens Prisma Studio in your browser
- Visual database browser and editor
- Great for inspecting seeded data

## Test User Accounts

### 👨‍🚗 Driver Accounts
- `rajesh.driver@example.com`
- `amit.driver@example.com`
- `priya.driver@example.com`
- `suresh.driver@example.com`
- `kavita.driver@example.com`

### 👥 Passenger Accounts
- `john.passenger@example.com`
- `sarah.passenger@example.com`
- `mike.passenger@example.com`
- `lisa.passenger@example.com`  
- `david.passenger@example.com`
- `emma.passenger@example.com`

**🔐 Password for all accounts:** `TestPass123!`

## Sample Data Created

### 🚗 Bookings
- **25 varied bookings** with different statuses:
  - PENDING (awaiting driver)
  - ACCEPTED (driver assigned)
  - COMPLETED (trip finished)
  - CANCELLED (trip cancelled)
  - REJECTED (driver declined)

### 📍 Locations
All bookings use real Hyderabad locations:
- Hyderabad Airport (RGIA)
- Gachibowli Tech District
- HITEC City
- Banjara Hills
- Jubilee Hills
- And 15 more authentic locations

### 🚙 Car Types
- SWIFT (Economy)
- ETIOS (Economy+)
- ERTIGA (Premium)
- INNOVA (SUV)
- TRAVELLER (Group)

## Usage Examples

1. **Fresh start with test data:**
   ```bash
   npm run db:reset
   ```

2. **Add more test data to existing:**
   ```bash
   npm run db:seed
   ```

3. **Clean slate (keep schema):**
   ```bash
   npm run db:clear
   ```

4. **Inspect data visually:**
   ```bash
   npm run db:studio
   ```

## Development Workflow

1. Start with fresh data: `npm run db:reset`
2. Test your features with realistic data
3. Clear when needed: `npm run db:clear`  
4. Re-seed for new test scenarios: `npm run db:seed`

Happy testing! 🚀