# MediLink Quick Start Guide (Phase 4 & 5)

## 🚀 Frontend - Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Frontend starts on `http://localhost:5173`

---

## 🚀 Backend - Getting Started

### Install Dependencies
```bash
cd backend/medilink-api
npm install
```

### Run Development Server
```bash
npm run start:dev
```

Backend API runs on `http://localhost:3000`

---

## 📋 Phase 5 Features - Quick Access

### 1. Two-Factor Authentication
**Route:** `/auth/two-factor`
**Roles:** Patient

```typescript
// Generate TOTP secret
POST /api/auth/2fa/generate
Response: { secret, qrCode }

// Verify token
POST /api/auth/2fa/verify
Body: { secret, token: "123456" }
Response: { backupCodes }

// Enable 2FA
POST /api/auth/2fa/enable
Body: { secret, backupCodes }
```

### 2. Prescription Refills
**Routes:** 
- Patient: `/patient/refills`
- Pharmacy: `/pharmacy/refills`

```typescript
// Request refill
POST /api/prescriptions/refill
Body: { prescriptionId }

// Get pending refills
GET /api/prescriptions/refills?status=PENDING

// Approve refill
PATCH /api/prescriptions/refills/{refillId}/approve
Body: { approverNote }

// Reject refill
PATCH /api/prescriptions/refills/{refillId}/reject
Body: { approverNote }

// Get stats
GET /api/prescriptions/refills/stats
```

### 3. Advanced Medication Search
**Route:** `/medications/search`
**Roles:** Patient, Public

```typescript
// Search medications
GET /api/medications/search?query=lisinopril

// Advanced filter
POST /api/medications/search
Body: { name, condition, minRating, maxPrice, prescriptionRequired, genericAvailable }

// Check interactions
POST /api/medications/interactions
Body: { medicationIds }

// Get alternatives
GET /api/medications/{medicationId}/alternatives

// Get generics
GET /api/medications/{medicationId}/generics

// Symptom-based recommendation
POST /api/medications/recommend-by-symptoms
Body: { symptoms }
```

### 4. Geolocation & Delivery Tracking
**Route:** `/delivery/tracking`
**Roles:** Delivery, Patient

```typescript
// Calculate distance
POST /api/geolocation/distance
Body: { from: { lat, lng }, to: { lat, lng } }

// Calculate ETA
POST /api/geolocation/eta
Body: { from, to, speedKmh }

// Start tracking
POST /api/geolocation/tracking/{deliveryId}/start

// Update location
PATCH /api/geolocation/tracking/{deliveryId}/location
Body: { latitude, longitude }

// Optimize route
POST /api/geolocation/route/optimize
Body: { locations }

// Calculate delivery fee
POST /api/geolocation/delivery-fee
Body: { distanceKm, baseFeeDollars, perKmRate }
```

### 5. Multi-Channel Notifications
**Routes:**
- Center: `/notifications`
- Settings: `/notifications/preferences`

```typescript
// Send notification
POST /api/notifications/send
Body: { userId, recipient, type, templateId, variables }

// Get notifications
GET /api/notifications?userId={userId}&limit=20

// Mark as read
POST /api/notifications/{notificationId}/read

// Get preferences
GET /api/notifications/preferences?userId={userId}

// Update preferences
POST /api/notifications/preferences
Body: { userId, email, sms, push, inApp, quietHours }

// Get stats
GET /api/notifications/stats?userId={userId}
```

### 6. Doctor EHR Module
**Route:** `/doctor`
**Roles:** Doctor

```typescript
// Get doctor profile
GET /api/doctor/profile/{doctorId}

// Create prescription
POST /api/doctor/prescriptions
Body: { patientId, medicationName, strength, dosage, frequency, daysSupply, refills }

// Get doctor's patients
GET /api/doctor/patients?doctorId={doctorId}

// Get patient medical history
GET /api/doctor/patient/{patientId}/history

// Get patient prescriptions
GET /api/doctor/patient/{patientId}/prescriptions

// Record vitals
POST /api/doctor/patient/{patientId}/vitals
Body: { bloodPressure, temperature, pulse, weight }

// Get doctor stats
GET /api/doctor/stats/{doctorId}

// Approve refill
PATCH /api/doctor/refills/{refillId}/approve

// Deny refill
PATCH /api/doctor/refills/{refillId}/deny
```

---

## 🧪 Running Tests

### Backend Tests

**Run all unit tests:**
```bash
cd backend/medilink-api
npm run test
```

**Run tests with coverage:**
```bash
npm run test:cov
```

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run specific test file:**
```bash
npm run test -- auth.service.spec
```

**Watch mode (auto-rerun on changes):**
```bash
npm run test:watch
```

**Debug tests:**
```bash
npm run test:debug
```

### Test Coverage Goals
- Services: >95%
- Controllers: >90%
- Modules: >85%
- **Total:** ~90%

---

## 📚 Frontend Routes

### All Available Routes
```
/                    - Home/Landing page
/login               - Login page
/settings            - User settings
/profile             - User profile
/library             - Medication library

PATIENT ROUTES:
/patient             - Patient dashboard
/patient/refills     - Prescription refills
/medications         - Medication list
/medications/search  - Advanced search with filters
/auth/two-factor     - 2FA setup

PHARMACY ROUTES:
/pharmacy            - Pharmacy dashboard
/pharmacy/refills    - Refill approval queue

DELIVERY ROUTES:
/delivery            - Delivery dashboard
/delivery/tracking   - Real-time tracking

DOCTOR ROUTES:
/doctor              - Doctor EHR dashboard

NOTIFICATION ROUTES:
/notifications              - Notification center
/notifications/preferences  - Notification settings
```

---

## 🎭 Demo Navigation

All dashboards support role switching in the navbar:

1. Click navbar buttons to switch roles:
   - **Patient** → Loads patient dashboard
   - **Pharmacy** → Loads pharmacy dashboard
   - **Delivery** → Loads delivery dashboard
   - **Doctor** → Loads doctor EHR (if available)

2. Auto-login triggers for seamless navigation
3. Session maintains user context

---

## 🛡️ Phase 4 Features (Production Ready)

### Audit Logging
**Endpoint:** `/api/audit/logs`

```bash
# Get all audit logs
curl http://localhost:3000/api/audit/logs

# Filter by action
curl "http://localhost:3000/api/audit/logs?action=LOGIN"

# Filter by user
curl "http://localhost:3000/api/audit/logs?userId=user-1"

# Get compliance report
curl "http://localhost:3000/api/audit/compliance-report?startDate=2026-01-01&endDate=2026-12-31"

# Export as CSV
curl "http://localhost:3000/api/audit/export-csv" > audit.csv
```

### Rate Limiting
All endpoints have rate limits. Response includes headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1719381234
```

Rate limits by tier:
- LOGIN: 5 per 15 minutes
- CREATE: 50 per minute
- READ: 200 per minute
- UPDATE: 50 per minute
- DELETE: 20 per minute
- EXPORT: 10 per hour

### Error Handling
All errors include trace ID for debugging:
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

## 🔧 Development Tips

### Accessing Settings
1. Click ⚙️ icon in navbar (top right)
2. Select option from dropdown:
   - My Profile
   - Notifications
   - Notification Settings
   - Two-Factor Auth
   - Settings

### Accessing New Phase 5 Features
1. **Patient Features:**
   - Click "Patient" in navbar → dashboard
   - Click "Refills" for prescription management
   - Click "Search Meds" for medication search
   - Settings → "Two-Factor Auth" to enable 2FA

2. **Pharmacy Features:**
   - Click "Pharmacy" in navbar → dashboard
   - Click "Approvals" for refill queue

3. **Delivery Features:**
   - Click "Delivery" in navbar → dashboard
   - Click "Tracking" for real-time location

4. **Doctor Features:**
   - Click "Doctor" in navbar → EHR dashboard
   - View patients, create prescriptions, record vitals

5. **Notifications:**
   - Click 🔔 bell icon for notification center
   - Click ⚙️ → "Notification Settings" for preferences

---

## 📊 Component Tree

```
TwoFactorSetup
  └── 5-step wizard with QR code

PrescriptionRefills
  ├── 3 tabs: Available, Pending, History
  ├── Refill request form
  └── Status tracking

AdvancedMedicationSearch
  ├── Search input
  ├── Filter panel
  └── Results grid with interaction warnings

NotificationCenter
  ├── 4 filter tabs
  ├── Notification list
  └── Mark as read / delete

NotificationPreferences
  ├── Channel toggles (email, SMS, push, in-app)
  ├── Type preferences
  └── Quiet hours setup

DoctorDashboard
  ├── 4 tabs: Patients, Prescriptions, Refills, History
  ├── Patient medical history view
  ├── Vital signs form
  └── Prescription creation form

DeliveryTracking
  ├── Delivery list
  ├── Map container
  └── ETA and driver info

PharmacyRefillApproval
  ├── Refill queue
  ├── Status tabs
  └── Approval form
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run preview
```

### Backend Deployment
```bash
cd backend/medilink-api
npm run build
npm run start
```

---

## 🐛 Troubleshooting

### Frontend Won't Load
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend API Not Responding
```bash
# Check if running on port 3000
curl http://localhost:3000/api/health

# Check environment variables
cat .env

# Restart backend
npm run start:dev
```

### Tests Failing
```bash
# Run with verbose output
npm run test -- --verbose

# Run specific test with debugging
npm run test:debug -- auth.service.spec
```

---

## 📞 Quick Links

- **Phase 4 Docs:** See `backend/PHASE4_COMPLETE.md`
- **Phase 5 Docs:** See `backend/PHASE5_COMPLETE.md`
- **GitHub:** https://github.com/Imposter-zx/MediLink
- **Issues:** Create issue in GitHub repository



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

---
## Documentation Update
Last updated: July 12, 2026
- Backend session and authentication improvements implemented.
- Verified backend build passes after auth updates.

