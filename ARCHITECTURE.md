# Cab Booking Site - Architecture Documentation

## 🏗️ Architecture Overview

This document describes the enhanced architecture and design patterns implemented in the Cab Booking Site (Cab Insta) application.

## 🔄 Recent Major Refactoring (June 2026)

The application has undergone a comprehensive refactoring to implement modern architecture patterns, enhance security, and improve maintainability.

### 🛡️ Security Improvements

#### 1. **API Authentication & Authorization**
- **Issue**: Multiple API endpoints were unprotected (`/api/bookings/pending`, `/api/email/send`, `/api/bookings` POST/GET)
- **Solution**: Implemented `withAuth` decorator pattern with role-based access control
- **Implementation**: 
  - Created `src/lib/middleware/apiAuth.ts` with JWT verification
  - Added role-based permissions (driver/passenger)
  - Implemented rate limiting to prevent abuse

#### 2. **Cookie Security**
- **Issue**: `uuid` and `role` cookies were `httpOnly: false`, vulnerable to XSS
- **Solution**: Moved to secure httpOnly-only JWT token with API-based user profile
- **Implementation**:
  - All cookies now `httpOnly: true` and `secure: true` in production
  - Created `/api/user/profile` endpoint for client-side user info
  - Client components will need updates to use API instead of cookie reading

#### 3. **Credential Management**
- **Issue**: Real credentials exposed in `EMAIL_SETUP.md`
- **Solution**: Removed credentials and created proper environment validation

### 🏛️ Design Patterns Implemented

#### 1. **Factory Pattern** (`src/lib/factories/ServiceFactory.ts`)
```typescript
const serviceFactory = ServiceFactory.getInstance();
const authService = serviceFactory.createAuthService();
```
- Centralizes service creation and dependency injection
- Implements singleton pattern for service instances
- Enables easy testing and service swapping

#### 2. **Observer Pattern** (`src/lib/services/LoggingService.ts`)
```typescript
class LoggingService {
  private observers: LogObserver[] = [];
  
  addObserver(observer: LogObserver): void {
    this.observers.push(observer);
  }
}
```
- Multiple log destinations (console, file, external services)
- Extensible logging system with structured metadata
- Production-ready log buffering and flushing

#### 3. **Decorator Pattern** (`src/lib/middleware/apiAuth.ts`)
```typescript
const authenticatedHandler = withAuth(
  withRateLimit(handler, { maxRequests: 5, windowMs: 60000 }),
  { roles: ["passenger"] }
);
```
- Composable middleware for API routes
- Authentication, rate limiting, and role checking
- Clean separation of concerns

#### 4. **Strategy Pattern** (`src/lib/config/ConfigurationService.ts`)
```typescript
interface ConfigValidator {
  validate(key: string, value: string | undefined): ValidationResult;
}
```
- Different validation strategies for different config types
- Extensible configuration validation system
- Environment-specific configuration loading

### 📊 Database Improvements

#### Enhanced Schema (`prisma/schema.prisma`)
- **Added Enums**: `BookingStatus`, `CarType` for type safety
- **Added Indexes**: Performance optimization for common queries
- **Added Constraints**: Proper foreign keys with cascade rules
- **Added Timestamps**: `created_at`, `updated_at`, `acceptedAt`, etc.
- **Added Geo Data**: Latitude/longitude for location tracking
- **Added Financial Fields**: `estimatedFare`, `actualFare`

#### Migration System
- Created proper migration structure in `prisma/migrations/`
- Version-controlled schema changes
- Production-ready migration with indexes

### 🔧 Configuration Management

#### Before (Legacy)
```typescript
const value = process.env.KEY || "default";
if (!value) throw new Error("Missing KEY");
```

#### After (Enhanced)
```typescript
const configService = ConfigurationService.getInstance();
const value = configService.get("KEY"); // Validated and typed
```

**Features:**
- Centralized configuration with validation
- Type-safe configuration access
- Environment-specific validation strategies
- Detailed error reporting for missing/invalid config

### 📝 Structured Logging

#### Implementation
```typescript
logger.logApiRequest("POST", "/api/bookings", userId, metadata);
logger.logBusinessEvent("booking_created", { bookingId, userId });
logger.logAuthEvent("login", userId);
```

**Features:**
- Structured logging with metadata
- Multiple observers (console, file, external)
- Context-aware logging (API, AUTH, BUSINESS, EMAIL)
- Production-ready log buffering

### 🔄 Dependency Management

#### Removed
- `jsonwebtoken` (unused, replaced with `jose`)
- `headlessui` (duplicate/unused)
- `@types/jsonwebtoken` (no longer needed)

#### Enhanced
- Proper TypeScript types throughout
- Service factory for dependency injection
- Configuration service for environment management

## 📁 File Structure

```
src/
├── app/
│   ├── api/                     # API routes with authentication
│   │   ├── bookings/           # Secured booking APIs
│   │   ├── user/profile/       # New secure profile API
│   │   └── email/send/         # Secured email API
│   └── components/             # React components
├── lib/
│   ├── config/                 # Configuration management
│   │   └── ConfigurationService.ts
│   ├── factories/              # Factory pattern implementation
│   │   └── ServiceFactory.ts
│   ├── middleware/             # API middleware
│   │   └── apiAuth.ts          # Authentication & rate limiting
│   ├── services/               # Business logic layer
│   │   ├── LoggingService.ts   # Structured logging
│   │   ├── AuthService.ts      # Authentication logic
│   │   ├── BookingService.ts   # Booking business logic
│   │   └── EmailService.ts     # Enhanced email service
│   ├── repositories/           # Data access layer
│   ├── utils/                  # Utility functions
│   └── env.ts                  # Legacy env (backward compatibility)
└── prisma/
    ├── schema.prisma           # Enhanced database schema
    └── migrations/             # Version-controlled migrations
```

## 🔒 Security Model

### Authentication Flow
1. User logs in via `/api/passenger_login` or `/api/driver_login`
2. Server validates credentials and generates JWT
3. JWT stored as httpOnly, secure cookie
4. Client uses `/api/user/profile` to get user info
5. All protected APIs use `withAuth` middleware

### Authorization Levels
- **Public**: Landing page, login/register
- **Authenticated**: Profile API, my bookings
- **Passenger Only**: Create bookings, booking form
- **Driver Only**: Pending bookings, accept/reject bookings
- **Rate Limited**: Email sending, booking creation

### Data Protection
- All sensitive cookies are httpOnly and secure
- JWT tokens contain minimal payload (userId, role)
- API responses don't expose sensitive data
- Structured logging excludes sensitive information

## 🚀 Performance Optimizations

### Database
- Strategic indexes on frequently queried fields
- Proper foreign key constraints for data integrity
- Enum types for better storage efficiency
- Composite indexes for complex queries

### API
- Service factory singleton pattern reduces object creation
- Log buffering reduces I/O operations
- Rate limiting prevents abuse
- Structured error handling improves debugging

### Configuration
- Lazy loading of configuration values
- Validation caching to prevent repeated checks
- Environment-specific optimizations

## 🧪 Testing Strategy

### Factory Pattern Benefits
- Easy service mocking via factory
- Dependency injection for test isolation
- Service reset functionality for test cleanup

### Configuration Testing
- Environment validation testing
- Invalid configuration scenarios
- Default value handling

### API Testing
- Authentication middleware testing
- Rate limiting verification
- Role-based access control validation

## 🔄 Migration Guide

### For Developers

#### Cookie Access Changes
**Before:**
```typescript
const cookies = new Cookies();
const role = cookies.get("role");
const userId = cookies.get("uuid");
```

**After:**
```typescript
const response = await fetch("/api/user/profile");
const { role, userId } = await response.json();
```

#### Service Creation Changes
**Before:**
```typescript
const authService = new AuthService();
```

**After:**
```typescript
const authService = serviceFactory.createAuthService();
```

#### Configuration Access Changes
**Before:**
```typescript
const dbUrl = process.env.DATABASE_URL;
```

**After:**
```typescript
const dbUrl = configService.get("DATABASE_URL");
```

### Breaking Changes
1. **Client Components**: Need to update cookie reading to API calls
2. **API Responses**: Login APIs no longer return tokens in response body
3. **Database**: New schema requires migration
4. **Environment**: Enhanced validation may require config fixes

## 🎯 Future Improvements

### Recommended Next Steps
1. **Client Component Updates**: Update React components to use profile API
2. **Testing Suite**: Add comprehensive test coverage
3. **Deployment Pipeline**: Add CI/CD with security scanning
4. **Monitoring**: Add APM and error tracking
5. **Documentation**: API documentation with OpenAPI/Swagger
6. **Caching**: Add Redis for session management and caching
7. **File Storage**: Add proper file upload handling
8. **Notifications**: Real-time notifications with WebSockets

### Architecture Evolution
- Consider microservices for scaling
- Implement Event Sourcing for audit trails
- Add CQRS for read/write optimization
- Consider GraphQL for flexible API queries

## 📋 Checklist for Deployment

### Pre-Production
- [ ] Run database migrations
- [ ] Update client components to use profile API
- [ ] Configure SMTP settings properly
- [ ] Set up structured logging destination
- [ ] Configure rate limiting thresholds
- [ ] Set up monitoring and alerting
- [ ] Security audit and penetration testing

### Production Environment
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure secure database connection
- [ ] Set up backup and recovery procedures
- [ ] Configure log aggregation
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up load balancing if needed

---

This architecture provides a solid foundation for scalable, secure, and maintainable cab booking application with modern design patterns and best practices.