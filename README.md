# 🚖 Cab Booking Site (Cab Insta)

A modern, full-stack cab booking application built with **Next.js 15**, **MySQL**, and **Prisma ORM**. Features dual passenger/driver roles, real-time booking management, email notifications, and enterprise-grade architecture patterns.

## 🚀 **Recent Major Refactoring (June 2026)**

This application has undergone a comprehensive architectural overhaul implementing modern design patterns, enhanced security, and production-ready features.

---

## 📋 **Table of Contents**

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🔒 Security Features](#-security-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚡ Quick Start](#-quick-start)
- [📊 Database Schema](#-database-schema)
- [🔧 API Documentation](#-api-documentation)
- [🎨 Design Patterns](#-design-patterns)
- [📱 Features](#-features)
- [🔄 Development Workflow](#-development-workflow)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## 🎯 **Project Overview**

**Cab Insta** is a comprehensive cab booking platform supporting two user roles:
- **Passengers**: Browse, book rides, track bookings, receive confirmations
- **Drivers**: View pending requests, accept/reject bookings, manage their rides

### **Core Features**
- 🔐 **Secure Authentication** with JWT and role-based access control
- 🚗 **Dual Role System** for passengers and drivers
- 📧 **Email Notifications** with booking confirmations
- 🗺️ **Route Calculator** with real-time distance calculation via OSRM
- 📱 **Responsive UI** built with Tailwind CSS and shadcn/ui
- ⚡ **Real-time Updates** for booking status changes
- 🔍 **Advanced Search** and filtering for bookings

---

## 🏗️ **Architecture**

### **Layered Architecture Pattern**
```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        Components[React Components]
        Hooks[Custom Hooks]
        State[State Management]
    end

    subgraph API["🌐 API Layer"]
        Routes[API Routes]
        Middleware[Auth Middleware]
        Validation[Request Validation]
    end

    subgraph Business["💼 Business Layer"]
        Services[Service Classes]
        Factory[Service Factory]
        Logging[Logging Service]
    end

    subgraph Data["💾 Data Layer"]
        Repositories[Repository Pattern]
        Prisma[Prisma ORM]
        Database[(MySQL Database)]
    end

    Client --> API
    API --> Business
    Business --> Data
    Data --> Database
```

### **File Structure**
```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes with Authentication
│   │   ├── bookings/           # Booking management APIs
│   │   ├── user/profile/       # Secure user profile API
│   │   ├── email/send/         # Protected email API
│   │   ├── passenger_login/             # Passenger authentication
│   │   └── driver_login/             # Driver authentication
│   ├── components/             # React Components
│   ├── booking_form/           # Protected booking page
│   ├── booking_requests/       # Driver dashboard
│   ├── my_bookings/           # User bookings page
│   └── (auth pages)/          # Login/register pages
├── lib/                        # Business Logic Layer
│   ├── config/                # Configuration Management
│   │   └── ConfigurationService.ts  # Environment validation
│   ├── factories/             # Factory Pattern
│   │   └── ServiceFactory.ts       # Dependency injection
│   ├── hooks/                 # Custom React Hooks
│   │   └── useUserProfile.ts       # Secure user state
│   ├── middleware/            # API Middleware
│   │   └── apiAuth.ts              # Auth & rate limiting
│   ├── services/              # Business Logic
│   │   ├── AuthService.ts          # Authentication logic
│   │   ├── BookingService.ts       # Booking operations
│   │   ├── EmailService.ts         # Email notifications
│   │   └── LoggingService.ts       # Structured logging
│   ├── repositories/          # Data Access Layer
│   │   ├── UserRepository.ts       # User CRUD operations
│   │   └── BookingRepository.ts    # Booking data access
│   ├── utils/                 # Utility Functions
│   └── validation.ts          # Input validation
└── components/shadcn/ui/       # Design System Components
```

---

## 🔒 **Security Features**

### **Authentication & Authorization**
- **JWT-based authentication** with httpOnly, secure cookies
- **Role-based access control** (passenger/driver permissions)
- **Protected API routes** with middleware decorators
- **Rate limiting** to prevent API abuse
- **Secure password hashing** with bcryptjs (10 rounds)

### **Data Protection**
- **httpOnly cookies** prevent XSS attacks
- **CSRF protection** with SameSite cookie attributes
- **Input validation** on both client and server
- **SQL injection prevention** via Prisma ORM
- **Sensitive data logging** prevention

### **API Security**
```typescript
// Example: Protected booking creation
const authenticatedPOST = withAuth(
  withRateLimit(
    async (req: ApiRequest) => {
      // Only authenticated passengers can create bookings
      const user = req.user!; // Guaranteed by withAuth
      // ... booking logic
    },
    { maxRequests: 5, windowMs: 60000 } // Rate limiting
  ),
  { roles: ["passenger"] } // Role-based access
);
```

---

## 🛠️ **Technology Stack**

### **Core Framework**
- **Next.js 15** - App Router, Server Components, API Routes
- **React 19** - UI Library with latest features
- **TypeScript 5** - Type safety and developer experience

### **Database & ORM**
- **MySQL** - Primary database
- **Prisma 6** - Type-safe ORM with migrations
- **Database Features**: Indexes, foreign keys, enums, constraints

### **Authentication & Security**
- **jose** - JWT signing and verification
- **bcryptjs** - Password hashing
- **Custom middleware** - Authentication and rate limiting

### **UI & Styling**
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Headless accessible components
- **Lucide React** - Beautiful icons

### **Email & Communication**
- **Nodemailer 7** - SMTP email sending
- **HTML email templates** - Rich booking confirmations
- **Multiple provider support** - Gmail, Outlook, SendGrid, etc.

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** (recommended) - Code formatting
- **Prisma Studio** - Database management UI

---

## ⚡ **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MySQL 8.0+
- npm/yarn/pnpm

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cab-booking-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure required variables:
   ```env
   # Required
   DATABASE_URL="mysql://user:password@localhost:3306/cab_booking"
   JWT_SECRET="your-super-secure-secret-key-minimum-32-characters"
   
   # Optional (Email features)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="your-email@gmail.com"
   SMTP_SECURE="false"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)

### **First Time Setup Checklist**
- [ ] MySQL database created and accessible
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SMTP settings configured (optional)
- [ ] Application running on localhost:3000

---

## 📊 **Database Schema**

### **Enhanced Schema Design**
```sql
-- Users (Passengers & Drivers)
passengers: id, name, email, password, phone, isActive, timestamps
drivers: id, name, email, password, phone, isActive, timestamps

-- Bookings with Rich Data
bookings: 
  - Core: id, car (enum), dateTime, status (enum)
  - Locations: startLocation, endLocation, coordinates
  - Financial: estimatedFare, actualFare
  - Tracking: acceptedAt, completedAt, cancelledAt
  - Relations: passengerId (FK), driverId (FK)
```

### **Key Features**
- **Enums**: `BookingStatus`, `CarType` for type safety
- **Indexes**: Optimized for common queries
- **Foreign Keys**: Proper referential integrity
- **Timestamps**: Complete audit trail
- **Geolocation**: Latitude/longitude support
- **Financial**: Fare estimation and tracking

### **Performance Optimizations**
```sql
-- Strategic Indexes
INDEX bookings_status_dateTime_idx (status, dateTime)
INDEX bookings_passengerId_idx (passengerId)
INDEX users_email_idx (email)
INDEX users_isActive_idx (isActive)
```

---

## 🔧 **API Documentation**

### **Authentication Endpoints**

#### **POST `/api/passenger_login`** - Passenger Login
```typescript
Request: { email: string, password: string }
Response: { 
  success: boolean,
  data: { userId: string, role: "passenger", name: string }
}
Cookies: Sets httpOnly JWT token
```

#### **POST `/api/driver_login`** - Driver Login
```typescript
Request: { email: string, password: string }
Response: { 
  success: boolean,
  data: { userId: string, role: "driver", name: string }
}
Cookies: Sets httpOnly JWT token
```

### **User Management**

#### **GET `/api/user/profile`** - Get User Profile (Protected)
```typescript
Headers: Cookies (JWT token)
Response: {
  success: boolean,
  data: {
    userId: string,
    role: "driver" | "passenger",
    name: string,
    email: string
  }
}
```

### **Booking Management**

#### **POST `/api/bookings`** - Create Booking (Passengers Only)
```typescript
Headers: JWT Authentication
Request: {
  car: "SWIFT" | "ETIOS" | "ERTIGA" | "INNOVA" | "TRAVELLER",
  dateTime: string,
  startLoc: string,
  endLoc: string,
  mobile: string,
  name: string
}
Response: { bookingId: string, message: string }
Rate Limit: 5 requests/minute
```

#### **GET `/api/bookings`** - Get User Bookings (Protected)
```typescript
Headers: JWT Authentication
Response: {
  success: boolean,
  data: Booking[]
}
```

#### **GET `/api/bookings/pending`** - Get Pending Bookings (Drivers Only)
```typescript
Headers: JWT Authentication
Response: {
  success: boolean,
  data: Booking[]
}
```

#### **PATCH `/api/bookings/[id]`** - Update Booking Status (Protected)
```typescript
Headers: JWT Authentication
Request: { status: "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED" }
Response: { success: boolean, data: Booking }
```

### **Email Services**

#### **POST `/api/email/send`** - Send Custom Email (Protected)
```typescript
Headers: JWT Authentication
Request: {
  to: string,
  subject: string,
  html: string
}
Response: { success: boolean }
Rate Limit: 3 requests/5 minutes
```

---

## 🎨 **Design Patterns**

### **1. Factory Pattern** - Service Creation
```typescript
// Centralized service instantiation
const serviceFactory = ServiceFactory.getInstance();
const authService = serviceFactory.createAuthService();
const bookingService = serviceFactory.createBookingService();
```

**Benefits:**
- Centralized dependency injection
- Easy service mocking for testing
- Consistent service lifecycle management

### **2. Observer Pattern** - Logging System
```typescript
// Multiple log observers
class LoggingService {
  private observers: LogObserver[] = [
    new ConsoleObserver(),
    new FileObserver(),
    new ExternalServiceObserver()
  ];
}
```

**Benefits:**
- Extensible logging destinations
- Decoupled log processing
- Real-time log streaming capabilities

### **3. Decorator Pattern** - API Middleware
```typescript
// Composable middleware functions
const protectedRoute = withAuth(
  withRateLimit(
    withValidation(handler, schema),
    { maxRequests: 10, windowMs: 60000 }
  ),
  { roles: ["passenger", "driver"] }
);
```

**Benefits:**
- Reusable middleware components
- Clean separation of concerns
- Easy testing and maintenance

### **4. Strategy Pattern** - Configuration Validation
```typescript
// Different validation strategies
interface ConfigValidator {
  validate(key: string, value: string): ValidationResult;
}

class EmailConfigValidator implements ConfigValidator { ... }
class DatabaseConfigValidator implements ConfigValidator { ... }
```

**Benefits:**
- Extensible validation logic
- Environment-specific validation
- Type-safe configuration access

### **5. Repository Pattern** - Data Access
```typescript
// Clean data access layer
class BookingRepository {
  async findByUserId(userId: string): Promise<Booking[]>
  async create(data: CreateBookingData): Promise<Booking>
  async updateStatus(id: string, status: BookingStatus): Promise<Booking>
}
```

**Benefits:**
- Database abstraction
- Testable data layer
- Consistent CRUD operations

---

## 📱 **Features**

### **For Passengers**
- 🔐 **Secure Registration & Login**
- 🚗 **Book Rides** with multiple car types
- 📍 **Route Calculator** with real distance calculation
- 📧 **Email Confirmations** for all bookings
- 📱 **Booking Management** - view, track, cancel
- 💰 **Fare Estimation** based on distance

### **For Drivers**
- 🔐 **Separate Driver Authentication**
- 📋 **Pending Requests Dashboard**
- ✅ **Accept/Reject Bookings** with one click
- 📊 **Booking History** and earnings tracking
- 📱 **Real-time Notifications** for new requests
- 🗺️ **Route Information** with pickup/drop locations

### **System Features**
- 🔍 **Advanced Search** and filtering
- 📊 **Analytics Dashboard** (admin)
- 🔒 **Role-based Access Control**
- ⚡ **Rate Limiting** and security
- 📝 **Audit Logs** for all actions
- 🌐 **Responsive Design** for all devices

---

## 🔄 **Development Workflow**

### **Code Organization**
```bash
# Business Logic
src/lib/services/        # Core business logic
src/lib/repositories/    # Data access layer
src/lib/factories/       # Dependency injection

# API Layer  
src/app/api/            # REST endpoints
src/lib/middleware/     # Authentication, validation

# Frontend
src/app/components/     # React components
src/lib/hooks/         # Custom React hooks
```

### **Development Commands**
```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Production build
npm run start           # Start production server
npm run lint            # ESLint checking

# Database
npx prisma studio       # Database GUI
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create and apply migration
npx prisma db push      # Sync schema without migration

# Debugging
npm run dev -- --inspect # Start with Node debugger
```

### **Environment Setup**
```bash
# Development
NODE_ENV=development
DEBUG=true

# Production
NODE_ENV=production
DEBUG=false
```

### **Testing Strategy** (Recommended)
```bash
# Unit Tests
tests/unit/services/     # Service layer tests
tests/unit/repositories/ # Repository tests

# Integration Tests  
tests/integration/api/   # API endpoint tests
tests/integration/db/    # Database tests

# E2E Tests
tests/e2e/              # Full user journey tests
```

---

## 🚀 **Deployment**

### **Production Checklist**

#### **Environment Configuration**
- [ ] Production database configured
- [ ] JWT secret properly set (32+ characters)
- [ ] SMTP configuration validated
- [ ] SSL certificates installed
- [ ] CORS settings configured

#### **Database Setup**
```bash
# Production migration
NODE_ENV=production npx prisma migrate deploy

# Verify schema
npx prisma db pull
npx prisma generate
```

#### **Security Configuration**
```env
# Production Environment
NODE_ENV=production
JWT_SECRET="production-jwt-secret-minimum-32-characters"
DATABASE_URL="mysql://user:pass@prod-host:3306/cab_booking"
SMTP_SECURE=true
```

### **Deployment Options**

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### **Docker Deployment**
```dockerfile
# Dockerfile (create this)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### **Traditional VPS**
```bash
# PM2 Process Manager
npm install -g pm2
pm2 start npm --name "cab-booking" -- start
pm2 startup
pm2 save
```

### **Performance Monitoring**
- **APM Integration**: New Relic, DataDog
- **Error Tracking**: Sentry, Bugsnag  
- **Log Management**: LogRocket, Loggly
- **Uptime Monitoring**: Pingdom, StatusCake

---

## 🤝 **Contributing**

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Set up environment variables
5. Run migrations: `npx prisma migrate dev`
6. Start development: `npm run dev`

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow project configuration
- **Prettier**: Consistent code formatting
- **Commit Messages**: Conventional commits format

### **Pull Request Process**
1. Ensure tests pass: `npm run lint`
2. Update documentation if needed
3. Add/update tests for new features
4. Submit PR with clear description
5. Address review feedback

### **Architecture Guidelines**
- Follow established design patterns
- Use service factory for dependency injection
- Implement proper error handling and logging
- Add authentication to new API endpoints
- Follow security best practices

### **Database Changes**
- Create proper migrations: `npx prisma migrate dev --name descriptive-name`
- Update schema documentation
- Add appropriate indexes
- Test migration rollback

---

## 📚 **Additional Resources**

### **Documentation**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Email configuration guide
- [API Reference](./docs/api.md) - Complete API documentation

### **External Dependencies**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Community**
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Architecture and implementation questions
- **Wiki**: Additional guides and tutorials

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 **Project Status**

**Current Version**: 2.0.0 (Major Architecture Refactor)
**Status**: ✅ Production Ready
**Last Updated**: June 6, 2026

### **Recent Improvements** (v2.0.0)
- 🔒 **Enhanced Security**: JWT authentication, API protection, secure cookies
- 🏗️ **Modern Architecture**: Design patterns, service factory, structured logging
- 📊 **Database Optimization**: Enhanced schema, indexes, migrations
- ⚡ **Performance**: Rate limiting, caching, optimized queries
- 📝 **Documentation**: Comprehensive guides and API documentation

---

**Built with ❤️ using Next.js, TypeScript, and modern architecture patterns**


📋 Test Credentials:
═══════════════════════════════════════
🔐 Password for all users: TestPass123!

👨‍🚗 Driver Accounts:
   • rajesh.driver@example.com
   • amit.driver@example.com
   • priya.driver@example.com
   • suresh.driver@example.com
   • kavita.driver@example.com

👥 Passenger Accounts:
   • john.passenger@example.com
   • sarah.passenger@example.com
   • mike.passenger@example.com
   • lisa.passenger@example.com
   • david.passenger@example.com
   • emma.passenger@example.com
