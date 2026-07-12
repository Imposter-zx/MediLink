# MediLink API Backend

Healthcare-compliant backend API for MediLink platform built with NestJS.

## Features

### Phase 1-3: Core Platform
- 🔐 OIDC Authentication with RBAC
- 🏥 FHIR Resource Management (Medplum)
- 🔒 Role-Based Access Control
- 💬 Real-time Messaging (WebSocket)
- 📊 Multi-role dashboards (Patient, Pharmacy, Delivery)
- 🔐 PHI Encryption (AES-256-GCM)

### Phase 4: Production Hardening
- 🧪 Comprehensive Testing Suite (61+ tests, 90% coverage)
- 📋 Audit Logging with Compliance Reports
- ⏱️ Rate Limiting (6 tiers)
- 🛡️ Centralized Exception Handling
- 🔍 Trace IDs for debugging

### Phase 5: Enterprise Features
- 🔑 Two-Factor Authentication (TOTP)
- 💊 Prescription Refill Management
- 🗺️ Geolocation & Delivery Optimization
- 🔍 Advanced Medication Search with Filters
- 🔔 Multi-Channel Notifications (Email, SMS, Push, In-App)
- 👨‍⚕️ Doctor EHR System

## Prerequisites

- Node.js 20+
- npm/yarn
- Medplum account (optional - included with demo)

## Installation

```bash
npm install
```

## Configuration

Create `.env` file in `backend/medilink-api/`:

```env
# Server
PORT=3000
NODE_ENV=development

# Medplum FHIR (optional for demo)
MEDPLUM_BASE_URL=https://api.medplum.com/
MEDPLUM_CLIENT_ID=your_client_id
MEDPLUM_CLIENT_SECRET=your_client_secret

# Security
ENCRYPTION_KEY=generate_32_byte_hex_key
JWT_SECRET=your_jwt_secret

# Frontend
FRONTEND_URL=http://localhost:5173

# Optional: Database (Phase 6)
DATABASE_URL=postgresql://user:password@localhost/medilink
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Watch mode
npm run start:watch

# Debug mode
npm run start:debug
```

## Project Structure

```
src/
├── config/              # Environment and configuration
├── common/              # Shared utilities
│   ├── decorators/      # @Roles, @Session decorators
│   ├── guards/          # Auth, RBAC guards
│   ├── middleware/      # Rate limiting middleware
│   ├── filters/         # Exception filters
│   ├── exceptions/      # Custom exception classes
│   └── types/           # TypeScript interfaces
├── modules/             # Feature modules
│   ├── auth/            # Authentication & 2FA
│   ├── audit/           # Audit logging
│   ├── patients/        # Patient management
│   ├── prescriptions/   # Prescriptions & refills
│   ├── messaging/       # Real-time messaging
│   ├── delivery/        # Delivery management
│   └── doctor/          # Doctor EHR system
└── services/            # Shared services
    ├── fhir.service.ts          # FHIR client wrapper
    ├── encryption.service.ts    # AES-256-GCM encryption
    ├── geolocation.service.ts   # Distance/ETA/routing
    ├── medication-search.service.ts  # Advanced search
    ├── notification.service.ts  # Multi-channel notifications
    └── two-factor.service.ts    # TOTP authentication
```

## Module Overview

### Auth Module
- Traditional username/password login
- Session-based authentication
- TOTP two-factor authentication
- Backup code management
- Automatic role-based redirects

### Audit Module
- Comprehensive action logging (LOGIN, CREATE, UPDATE, DELETE, etc.)
- User activity tracking
- Data access auditing
- Compliance reporting (HIPAA-ready)
- CSV export functionality

### Doctor Module
- Doctor profile management
- Patient roster management
- Prescription lifecycle management
- Medical history tracking (allergies, conditions, surgeries)
- Vital signs recording
- Refill approval workflow

### Prescriptions Module
- Prescription management
- Refill request creation and approval
- Eligibility checking
- Status tracking
- Refill statistics

### Patients Module
- Patient profile management
- Medical record organization
- Condition tracking
- Medication history

### Delivery Module
- Delivery order management
- Real-time tracking
- Location updates
- ETA calculations
- Route optimization

### Messaging Module
- WebSocket-based chat
- Real-time communication
- Message persistence

### Services

#### GeolocationService
- Haversine distance calculation
- ETA estimation with speed adjustment
- Route optimization (nearest-neighbor)
- Service area validation
- Delivery fee calculation
- Real-time location tracking

#### MedicationSearchService
- Full-text medication search
- Advanced filtering (condition, price, rating, etc.)
- Drug interaction checking
- Generic alternative suggestions
- Symptom-based recommendations
- Cost comparison

#### NotificationService
- Multi-channel delivery (Email, SMS, Push, In-App)
- Template-based messaging
- User preference management
- Notification statistics
- Quiet hours support

#### TwoFactorService
- TOTP secret generation
- QR code generation
- Token verification
- Backup code management
- Recovery mechanism

## API Documentation

### Core Endpoints

**Authentication**
```
POST   /api/auth/login               - Login
POST   /api/auth/logout              - Logout
GET    /api/auth/profile             - Get user profile
```

**Audit (Phase 4)**
```
GET    /api/audit/logs               - Get audit logs
GET    /api/audit/compliance-report  - Compliance report
GET    /api/audit/export-csv         - Export CSV
```

**Doctor EHR (Phase 5)**
```
GET    /api/doctor/profile/{id}                  - Doctor profile
POST   /api/doctor/prescriptions                 - Create prescription
GET    /api/doctor/patients                      - List patients
GET    /api/doctor/patient/{id}/history         - Patient history
POST   /api/doctor/patient/{id}/vitals          - Record vitals
GET    /api/doctor/stats/{id}                   - Doctor statistics
```

**Prescriptions & Refills (Phase 5)**
```
POST   /api/prescriptions/refill                    - Request refill
GET    /api/prescriptions/refills                   - Get refills
PATCH  /api/prescriptions/refills/{id}/approve     - Approve refill
PATCH  /api/prescriptions/refills/{id}/reject      - Reject refill
GET    /api/prescriptions/refills/stats            - Refill stats
```

**Medications (Phase 5)**
```
GET    /api/medications/search                     - Search medications
POST   /api/medications/search                     - Advanced filter
POST   /api/medications/interactions               - Check interactions
GET    /api/medications/{id}/alternatives         - Get alternatives
GET    /api/medications/{id}/generics             - Get generics
POST   /api/medications/recommend-by-symptoms    - Symptom recommendations
```

**Geolocation (Phase 5)**
```
POST   /api/geolocation/distance                        - Calculate distance
POST   /api/geolocation/eta                            - Calculate ETA
POST   /api/geolocation/tracking/{id}/start            - Start tracking
PATCH  /api/geolocation/tracking/{id}/location         - Update location
POST   /api/geolocation/route/optimize                 - Optimize route
POST   /api/geolocation/delivery-fee                   - Calculate fee
```

**Notifications (Phase 5)**
```
POST   /api/notifications/send                        - Send notification
GET    /api/notifications                            - Get notifications
POST   /api/notifications/{id}/read                   - Mark as read
GET    /api/notifications/preferences                - Get preferences
POST   /api/notifications/preferences                - Update preferences
GET    /api/notifications/stats                      - Get statistics
```

**Two-Factor Auth (Phase 5)**
```
POST   /api/auth/2fa/generate    - Generate TOTP secret
POST   /api/auth/2fa/verify      - Verify token
POST   /api/auth/2fa/enable      - Enable 2FA
```

## Testing

```bash
# Run all unit tests
npm run test

# Run with coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e

# Watch mode (auto-rerun on changes)
npm run test:watch

# Run specific test file
npm run test -- auth.service.spec

# Debug tests
npm run test:debug
```

**Test Coverage:**
- Services: >95%
- Controllers: >90%
- Modules: >85%
- **Total:** ~90%
- **Total Tests:** 61+

## Error Handling

All errors follow a consistent format with trace IDs:

```json
{
  "statusCode": 400,
  "timestamp": "2026-04-20T10:30:00Z",
  "path": "/api/prescriptions",
  "method": "POST",
  "message": "Validation failed",
  "error": "Bad Request",
  "traceId": "trace-1719381000-abc123",
  "details": {
    "medication": ["medication is required"]
  }
}
```

## Rate Limiting

Endpoints are rate-limited by tier:

| Tier | Limit | Window |
|------|-------|--------|
| LOGIN | 5 | 15 min |
| CREATE | 50 | 1 min |
| READ | 200 | 1 min |
| UPDATE | 50 | 1 min |
| DELETE | 20 | 1 min |
| EXPORT | 10 | 1 hour |

Response headers include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1719381234
```

## Security

- AES-256-GCM encryption for PHI
- RBAC with 4 roles (Patient, Pharmacy, Delivery, Doctor)
- Session-based authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- Helmet for HTTP headers
- CORS for cross-origin requests
- Audit logging for compliance

## Performance

- Lazy loading of modules
- Efficient database queries
- In-memory caching (for demo)
- WebSocket for real-time updates
- Request/response compression

## Deployment

### Docker

```bash
docker build -t medilink-api .
docker run -p 3000:3000 medilink-api
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
ENCRYPTION_KEY=<32-byte-hex-key>
JWT_SECRET=<strong-secret>
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=<postgresql-connection>
```

## Monitoring & Logging

- Structured logging with timestamps
- Trace IDs for request tracking
- Audit trail for compliance
- Performance metrics (response times)

## Documentation

- **Complete Phase 5 Guide:** See `../PHASE5_COMPLETE.md`
- **Phase 4 Features:** See `../PHASE4_COMPLETE.md`
- **Quick Start:** See `../QUICKSTART.md`
- **Dependencies:** See `./DEPENDENCIES.md`

## Support

For issues or questions:
1. Check the documentation in this file
2. Review Phase-specific documentation
3. Check test files for usage examples
4. Create an issue in the GitHub repository

---
## Documentation Update
Last updated: July 12, 2026
- Backend session and authentication improvements implemented.
- Verified backend build passes after auth updates.

