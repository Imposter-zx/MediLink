# MediLink API Backend

Healthcare-compliant backend API for MediLink platform built with NestJS.

## Features

- 🔐 OIDC Authentication
- 🏥 FHIR Resource Management (Medplum)
- 🔒 RBAC Authorization
- 💬 Real-time Messaging (WebSocket)
- 📊 Audit Logging
- 🔐 PHI Encryption

## Prerequisites

- Node.js 20+
- Redis (for sessions)
- Medplum account

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Medplum FHIR
MEDPLUM_BASE_URL=https://api.medplum.com/
MEDPLUM_CLIENT_ID=your_client_id
MEDPLUM_CLIENT_SECRET=your_client_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
ENCRYPTION_KEY=generate_32_byte_hex_key
JWT_SECRET=your_jwt_secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── config/          # Configuration files
├── common/          # Guards, interceptors, decorators
├── modules/         # Feature modules
│   ├── auth/
│   ├── patients/
│   ├── prescriptions/
│   ├── messaging/
│   └── delivery/
└── services/        # Shared services (FHIR, encryption)
```

## API Documentation

Access Swagger docs at: `http://localhost:3000/api`

## Testing

```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```
