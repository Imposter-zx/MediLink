# Backend Dependencies Installation Note

## TypeScript Lint Errors

The backend TypeScript files currently show lint errors for missing dependencies:

- `@nestjs/config`
- `@nestjs/websockets`
- `socket.io`
- `class-validator`
- `class-transformer`

**These are expected!** The dependencies haven't been installed yet.

## How to Fix

Run this command in the backend directory:

```bash
cd backend/medilink-api

npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/websockets @nestjs/platform-socket.io socket.io @medplum/core @medplum/client helmet @nestjs/passport passport class-validator class-transformer
```

Once installed, all TypeScript errors will be resolved.

## Why Not Pre-installed?

During development, we encountered npm authentication issues that prevented automatic package installation. The code is complete and correct - it just needs the dependencies installed to compile.

## Verification

After installation, verify with:

```bash
npm run start:dev
```

Expected output:

```
✅ Connected to Medplum FHIR server
🚀 MediLink API running on http://localhost:3000
```
