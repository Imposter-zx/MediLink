# MediLink Backend Dependencies

## Core NestJS Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/common` | ^10.0.0 | Core NestJS utilities |
| `@nestjs/core` | ^10.0.0 | NestJS core framework |
| `@nestjs/platform-express` | ^10.0.0 | Express integration |
| `@nestjs/config` | ^3.0.0 | Environment configuration |
| `@nestjs/websockets` | ^10.0.0 | WebSocket support |
| `@nestjs/platform-socket.io` | ^10.0.0 | Socket.io integration |
| `reflect-metadata` | ^0.1.0 | Metadata reflection |
| `rxjs` | ^7.0.0 | Reactive programming |

## FHIR & Healthcare

| Package | Version | Purpose |
|---------|---------|---------|
| `@medplum/core` | Latest | FHIR core utilities |
| `@medplum/client` | Latest | Medplum FHIR client wrapper |

## Security & Encryption

| Package | Version | Purpose |
|---------|---------|---------|
| `helmet` | ^7.0.0 | HTTP headers security |
| `@nestjs/passport` | ^10.0.0 | Passport authentication |
| `passport` | ^0.7.0 | Authentication middleware |
| `crypto` | Built-in | Native Node.js encryption (AES-256-GCM) |

## Validation & Transformation

| Package | Version | Purpose |
|---------|---------|---------|
| `class-validator` | ^0.14.0 | DTO validation |
| `class-transformer` | ^0.5.0 | Object transformation |

## Real-Time Communication

| Package | Version | Purpose |
|---------|---------|---------|
| `socket.io` | ^4.0.0 | WebSocket server |
| `socket.io-client` | ^4.0.0 | WebSocket client (frontend) |

## Authentication (Phase 5)

| Package | Version | Purpose |
|---------|---------|---------|
| `speakeasy` | ^2.0.0 | TOTP generation & verification |
| `qrcode` | ^1.5.0 | QR code generation |

## Development Dependencies

| Package | Purpose |
|---------|---------|
| `@types/node` | TypeScript Node types |
| `@nestjs/testing` | NestJS testing utilities |
| `jest` | Test framework |
| `ts-jest` | TypeScript Jest support |
| `ts-loader` | TypeScript loader |
| `typescript` | TypeScript compiler |
| `eslint` | Code linting |
| `prettier` | Code formatting |

## Installation

### All at Once

```bash
cd backend/medilink-api

npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/websockets @nestjs/platform-socket.io @medplum/core @medplum/client helmet @nestjs/passport passport class-validator class-transformer socket.io socket.io-client speakeasy qrcode reflect-metadata rxjs
```

### By Category

**Core Framework:**
```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
```

**Configuration & Environment:**
```bash
npm install @nestjs/config
```

**Real-Time Communication:**
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io socket.io-client
```

**FHIR & Healthcare:**
```bash
npm install @medplum/core @medplum/client
```

**Security:**
```bash
npm install helmet @nestjs/passport passport
```

**Validation:**
```bash
npm install class-validator class-transformer
```

**Phase 5 Features:**
```bash
npm install speakeasy qrcode
```

## Feature Coverage by Package

### Authentication (Phase 1)
- `passport`, `@nestjs/passport` - Session-based auth
- `class-validator`, `class-transformer` - Input validation

### FHIR Integration (Phase 2)
- `@medplum/core`, `@medplum/client` - FHIR resource management
- `helmet` - API security

### Real-Time Messaging (Phase 3)
- `socket.io`, `socket.io-client` - WebSocket communication
- `@nestjs/websockets`, `@nestjs/platform-socket.io` - NestJS WebSocket

### Testing & Audit (Phase 4)
- `@nestjs/testing`, `jest`, `ts-jest` - Testing framework
- Built-in `crypto` - PHI encryption (AES-256-GCM)

### Enterprise Features (Phase 5)
- `speakeasy` - TOTP two-factor authentication
- `qrcode` - QR code generation for 2FA setup
- `class-validator` - Refill request validation
- `@medplum/client` - Doctor/patient FHIR operations

## Encryption

**Note:** MediLink uses Node.js built-in `crypto` module for AES-256-GCM encryption:
- No external encryption library needed
- High-performance native implementation
- NIST-approved algorithm
- Used for PHI data protection

## Version Updates

Check for updates:
```bash
npm outdated
```

Update all packages:
```bash
npm update
```

## Production Dependencies

For production deployment, ensure:
- All packages are in `dependencies` (not `devDependencies`)
- `node_modules` is properly installed
- Environment variables are configured
- Consider using `npm ci` for reproducible builds

Example `package.json` dependencies section:
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "@medplum/core": "latest",
    "@medplum/client": "latest",
    "helmet": "^7.0.0",
    "@nestjs/passport": "^10.0.0",
    "passport": "^0.7.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "socket.io": "^4.0.0",
    "socket.io-client": "^4.0.0",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.0",
    "reflect-metadata": "^0.1.0",
    "rxjs": "^7.0.0"
  }
}
```

## Troubleshooting

### Missing Dependencies Error
```bash
npm install --save <package-name>
```

### TypeScript Errors
Ensure `tsconfig.json` is properly configured:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process (replace PID)
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Testing Dependencies

```bash
npm install --save-dev @nestjs/testing jest @types/jest ts-jest
```

Test configuration in `jest.config.js`:
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
};
```

## Related Documentation

- **Phase 4:** See `../PHASE4_COMPLETE.md` for testing details
- **Phase 5:** See `../PHASE5_COMPLETE.md` for new services
- **Setup:** See `../SETUP_COMPLETE.md` for configuration
- **Quick Start:** See `../QUICKSTART.md` for running commands

---
## Documentation Update
Last updated: July 12, 2026
- Backend session and authentication improvements implemented.
- Verified backend build passes after auth updates.

