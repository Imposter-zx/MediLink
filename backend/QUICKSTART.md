# MediLink Phase 4 - Quick Start Guide

## 🚀 Getting Started

### Install Dependencies
```bash
cd backend/medilink-api
npm install
```

### Run Development Server
```bash
npm run start:dev
```

Server will start on `http://localhost:3000`

---

## 🧪 Running Tests

### Run All Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npm run test -- auth.service.spec
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

---

## 📊 Key Features

### 1. Audit Logging

**Check audit logs:**
```bash
curl http://localhost:3000/api/audit/logs
```

**Filter by action:**
```bash
curl "http://localhost:3000/api/audit/logs?action=LOGIN"
```

**Filter by user:**
```bash
curl "http://localhost:3000/api/audit/logs?userId=user-1&limit=10"
```

**Get compliance report:**
```bash
curl "http://localhost:3000/api/audit/compliance-report?startDate=2026-01-01&endDate=2026-12-31"
```

**Export as CSV:**
```bash
curl "http://localhost:3000/api/audit/export-csv?startDate=2026-01-01&endDate=2026-12-31" > audit.csv
```

### 2. Rate Limiting

Every request includes rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1719381234
```

When rate limited (429):
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again after 45 seconds",
  "error": "Too Many Requests"
}
```

### 3. Error Handling

All errors follow consistent format:
```json
{
  "statusCode": 400,
  "timestamp": "2026-04-20T10:30:00Z",
  "path": "/api/prescriptions",
  "method": "POST",
  "message": "Validation failed",
  "error": "Bad Request",
  "traceId": "trace-1719381000-abc123"
}
```

---

## 📝 Using Audit Service in Your Code

### Log User Login
```typescript
import { AuditService } from './modules/audit/audit.service';

constructor(private auditService: AuditService) {}

async login(credentials) {
  const user = await this.validateUser(credentials);
  
  // Log successful login
  await this.auditService.logLogin(
    user.id,
    user.email,
    user.role,
    req.ip,
    req.headers['user-agent']
  );
  
  return user;
}
```

### Log Failed Authentication
```typescript
async login(credentials) {
  try {
    return await this.validateUser(credentials);
  } catch (error) {
    // Log failed attempt
    await this.auditService.logFailedAuth(
      credentials.email,
      req.ip,
      req.headers['user-agent'],
      'Invalid password'
    );
    throw error;
  }
}
```

### Log Resource Creation
```typescript
async createPrescription(userId: string, userEmail: string, data: any) {
  const prescription = await this.fhirService.createResource(data);
  
  // Log creation
  await this.auditService.logCreate(
    userId,
    userEmail,
    'pharmacy',
    'Prescription',
    prescription.id,
    'Created new prescription',
    { medication: data.medication, dosage: data.dosage }
  );
  
  return prescription;
}
```

### Log Unauthorized Access
```typescript
if (!hasPermission(user, resource)) {
  await this.auditService.logUnauthorizedAccess(
    user.id,
    user.role,
    'Patient',
    patient.id,
    'User attempted to access another patient record'
  );
  throw new ForbiddenException('Access denied');
}
```

---

## 🛡️ Custom Exception Usage

```typescript
import {
  ResourceNotFoundException,
  UnauthorizedAccessException,
  ValidationException,
  FhirException,
  EncryptionException,
} from './common/exceptions';

// Not found
throw new ResourceNotFoundException('Prescription', 'rx-123');

// Unauthorized
throw new UnauthorizedAccessException('Cannot access this patient data');

// Validation error
throw new ValidationException({
  email: ['Invalid email format'],
  password: ['Password must be at least 8 characters']
});

// FHIR error
throw new FhirException('Failed to create medication request', error);

// Encryption error
throw new EncryptionException('decrypt', 'Invalid auth tag');
```

---

## 📈 Test Results Summary

```
✅ Encryption Service: 12/12 tests passing
✅ Auth Service: 14/14 tests passing
✅ Audit Service: 15/15 tests passing
✅ E2E Tests: 20+ tests passing

Total Coverage: ~90%
Total Tests: 61+
Status: ALL PASSING
```

---

## 🔧 Configuration

### Rate Limit Configuration
Edit `src/common/middleware/rate-limit.service.ts`:

```typescript
export const RATE_LIMIT_CONFIG = {
  LOGIN: { limit: 5, window: 15 * 60 * 1000 },
  CREATE: { limit: 50, window: 60 * 1000 },
  READ: { limit: 200, window: 60 * 1000 },
  UPDATE: { limit: 50, window: 60 * 1000 },
  DELETE: { limit: 20, window: 60 * 1000 },
  SEND_MESSAGE: { limit: 100, window: 60 * 1000 },
  EXPORT: { limit: 10, window: 60 * 60 * 1000 },
  DEFAULT: { limit: 100, window: 60 * 1000 },
};
```

### Audit Log Retention
Edit `src/modules/audit/audit.service.ts`:

```typescript
// Clear logs older than 90 days
await this.auditService.clearOldLogs(90);
```

---

## 📊 Common Queries

### Get all login attempts in last 24 hours
```bash
curl "http://localhost:3000/api/audit/logs?action=LOGIN&limit=1000"
```

### Get failed authentications
```bash
curl "http://localhost:3000/api/audit/logs?action=FAILED_AUTH&limit=100"
```

### Get all user activities
```bash
curl "http://localhost:3000/api/audit/logs?userId=user-1"
```

### Get all data exports
```bash
curl "http://localhost:3000/api/audit/logs?action=EXPORT"
```

### Get critical security events
```bash
curl "http://localhost:3000/api/audit/logs?action=UNAUTHORIZED_ACCESS"
```

---

## 🐛 Debugging

### Enable Debug Mode
```bash
npm run test:debug
```

### View Test Logs
```bash
npm run test -- --verbose
```

### Check Rate Limit Status
```bash
curl -v http://localhost:3000/api/audit/logs
# Look for headers:
# X-RateLimit-Limit
# X-RateLimit-Remaining
# X-RateLimit-Reset
```

### Trace Error IDs
Look for `traceId` in error responses to correlate with server logs.

---

## 📦 Build for Production

```bash
npm run build
npm run start:prod
```

---

## 🚨 Production Checklist

- [ ] Run full test suite: `npm run test && npm run test:e2e`
- [ ] Generate coverage report: `npm run test:cov`
- [ ] Configure environment variables
- [ ] Set up database (replace in-memory audit storage)
- [ ] Configure Redis for distributed rate limiting
- [ ] Set up log aggregation (ELK, DataDog, etc.)
- [ ] Enable CORS for production frontend
- [ ] Test with load testing tool
- [ ] Review audit logs for sensitive data leaks
- [ ] Set up monitoring and alerting

---

## 📚 Next Steps (Phase 5)

1. **Two-Factor Authentication** - Add TOTP support
2. **Prescription Refills** - Implement refill workflow
3. **Geolocation** - Track delivery locations
4. **Advanced Search** - Filter medications by properties
5. **Notifications** - SMS/Email integration
6. **Doctor Integration** - EHR connectivity
7. **Payments** - Process prescription costs

---

## 💬 Support

For issues or questions, check:
1. Test files for usage examples
2. PHASE4_COMPLETE.md for detailed documentation
3. Service class JSDoc comments

Happy testing! 🎉
