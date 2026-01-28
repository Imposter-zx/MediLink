# MediLink: Production-Grade Healthcare Connectivity Platform

MediLink is a high-performance, secure, and accessible healthcare platform bridging the gap between patients, pharmacies, and delivery services. Built with a production-first architecture using React 19, Three.js, and FHIR standards.

---

## 🚀 Key Features

### 🔐 Authentication & User Management

- **Professional Login Page:** Medical-grade UI with email/phone detection, password visibility toggle, and remember me functionality
- **Comprehensive Settings Page:** Six dedicated sections for complete user control:
  - **Account:** Profile management with picture upload, name, email, and phone
  - **Security:** Password changes, two-factor authentication, active session management
  - **Medical Preferences:** Preferred pharmacy, delivery address, allergies, and chronic conditions
  - **Notifications:** Medication reminders, delivery updates, email/SMS/push preferences
  - **Accessibility:** Font size adjustment, high contrast, dark mode, animation controls
  - **Privacy:** Data sharing permissions, data export, account deletion

### 🏥 Medplum FHIR Integration

- **Real-time Data:** Fetches clinical resources (`MedicationKnowledge`) directly from Medplum
- **Smart Ordering:** Automatically creates `MedicationRequest` resources for patient prescriptions
- **FHIR-Compliant:** Adheres to HL7 FHIR standards for healthcare interoperability

### 🛡️ Hardened Security

- **RBAC (Role-Based Access Control):** Granular access permissions for Patient, Pharmacy, and Delivery roles
- **XSS Protection:** Secure authentication flow using memory-only session management and preparation for `httpOnly` cookies
- **Audit Logging:** Integrated logging for unauthorized access attempts
- **Session Management:** Track and manage active devices with remote sign-out capability

### ♿ Medical-Grade Accessibility

- **Theme System:** Support for **Light Comfort**, **Dark Medical**, and **High Contrast** modes
- **Font Scaling:** Real-time font size adjustment (80%-150%) for visually impaired users
- **ARIA Support:** Full screen reader compatibility with semantic HTML
- **Keyboard Navigation:** Complete keyboard control with visible focus indicators
- **Elderly-Friendly:** Large touch targets, high contrast text, clear layouts
- **Reduce Motion:** Option to minimize animations for users with motion sensitivity

### ⚡ Performance Optimization

- **Adaptive 3D Experience:** Three.js landing scene that automatically scales quality based on hardware capabilities and battery status
- **Manual Chunking:** Optimized build strategy splitting large vendors (React, Three.js, Mantine) for lightning-fast caching
- **Lazy Loading:** Component-level code splitting to minimize initial TTI
- **Persistent State:** Settings and preferences stored locally with Zustand persistence

### 🎨 Reusable UI Components

- **Toggle:** Accessible switch component with smooth animations
- **Slider:** Range slider with visual feedback and keyboard support
- **TagsInput:** Multi-tag input for medical data (allergies, conditions)
- **FileUpload:** Profile picture upload with drag-and-drop and preview
- **Card:** Consistent container component with medical styling
- **Button:** Versatile button with variants and loading states

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite
- **State Management:** Zustand with persistence middleware
- **Clinical Data:** Medplum FHIR API
- **3D Graphics:** Three.js, @react-three/fiber
- **UI Architecture:** Tailwind CSS, Mantine (Notifications)
- **Icons:** Lucide React
- **Routing:** React Router v6

### Backend (NestJS)

- **Framework:** NestJS, TypeScript
- **FHIR Server:** Medplum (HL7 FHIR R4)
- **Real-time:** WebSocket (Socket.io)
- **Encryption:** AES-256-GCM for PHI
- **Authentication:** Session-based (ready for OIDC)
- **Validation:** class-validator, class-transformer
- **Security:** Helmet, CORS, RBAC

---

## 📦 Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn
- Docker (for production simulation)

### Installation

1.  **Clone & Install:**

    ```bash
    git clone https://github.com/Imposter-zx/MediLink.git
    cd MediLink
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file based on `.env.example`:

    ```bash
    cp .env.example .env
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    Access the application at `http://localhost:5173`

4.  **Backend API (Optional):**

    ```bash
    cd backend/medilink-api
    npm install

    # Configure .env with your Medplum credentials
    cp .env.example .env

    # Start backend server
    npm run start:dev
    ```

    Backend API runs on `http://localhost:3000`

---

## 🎯 Available Routes

- **`/`** - Homepage with medical landing animation
- **`/login`** - Secure login page
- **`/settings`** - Comprehensive user settings
- **`/patient`** - Patient dashboard (role-protected)
- **`/pharmacy`** - Pharmacy dashboard (role-protected)
- **`/delivery`** - Delivery dashboard (role-protected)
- **`/library`** - Medication knowledge library

---

## 🧭 Navigation

### Accessing Settings

- Click the **⚙️ Settings icon** in the navbar
- Select **"Settings"** from the dropdown menu
- Or navigate directly to `/settings`

### Signing In

- Click the green **"Sign In"** button in the navbar
- Or navigate directly to `/login`

### Theme Switching

- Click the **⚙️ Settings icon** in the navbar
- Use the **Theme Switcher** in the dropdown
- Or go to Settings → Accessibility section

---

## 🏥 Backend Architecture

MediLink features a production-grade, healthcare-compliant backend API built with NestJS.

### Core Features

✅ **FHIR-Compliant API** - Full CRUD operations on healthcare resources  
✅ **Real-time Messaging** - WebSocket-based encrypted communication  
✅ **End-to-End Encryption** - AES-256-GCM for all PHI  
✅ **RBAC Authorization** - Role-based access on all endpoints  
✅ **Audit Trail** - Complete Provenance and AuditEvent logging  
✅ **HIPAA-Ready** - Healthcare compliance built-in  
✅ **Automated Testing** - Comprehensive unit test suite for core services  
✅ **Docker Orchestration** - Full-stack deployment with Redis for session management

### API Endpoints

**Authentication**

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/session` - Current session info

**Prescriptions (MedicationRequest)**

- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - List prescriptions (role-filtered)
- `GET /api/prescriptions/:id` - Get prescription details
- `PATCH /api/prescriptions/:id/status` - Update status

**Patients (Patient)**

- `GET /api/patients/:id` - Get patient profile
- `PATCH /api/patients/:id` - Update profile

**Delivery (Task)**

- `POST /api/deliveries` - Create delivery task
- `GET /api/deliveries` - List deliveries (role-filtered)
- `PATCH /api/deliveries/:id` - Update delivery status
- `PATCH /api/deliveries/:id/assign` - Assign driver

**Messaging (Communication)**

- `GET /api/messages/conversation?userId=X` - Get conversation
- `GET /api/messages/by-context?type=X&id=Y` - Context messages
- `POST /api/messages` - Send message
- **WebSocket:** `/messaging` namespace for real-time

### FHIR Resources Used

| Resource            | Purpose             |
| ------------------- | ------------------- |
| `MedicationRequest` | Prescription orders |
| `Patient`           | Patient profiles    |
| `Task`              | Delivery workflows  |
| `Communication`     | Encrypted messages  |
| `Provenance`        | Audit trails        |
| `AuditEvent`        | Security logging    |

### Security Implementation

**Encryption:**

- All message content encrypted with AES-256-GCM
- IV and AuthTag stored as FHIR extensions
- Decryption only for authorized recipients

**Authorization:**

- Session-based authentication
- RBAC middleware on all protected routes
- Role-specific data filtering
- Ownership verification in services

**Audit Logging:**

- Provenance for all resource mutations
- AuditEvent for security events
- Immutable compliance trail

See `backend/` directory for complete documentation.

---

## 🐳 Production Deployment

MediLink is container-ready for professional deployment.

### Docker

Build a multi-stage production image:

```bash
docker compose up --build
```

### CI/CD

- **Automated Builds:** GitHub Actions workflow (`.github/workflows/ci.yml`)
- **Linting:** ESLint validation on every push
- **Type Checking:** React prop validation

### Production Server

- **Nginx:** Optimized serving with security headers
- **Gzip Compression:** Reduced bundle sizes
- **HTTPS Ready:** SSL/TLS configuration support

---

## 🏗️ Project Structure

```
MediLink/
├── src/                  # Frontend application
│   ├── app/              # Core app configuration
│   │   ├── App.jsx       # Main app component
│   │   ├── routes.jsx    # Route definitions
│   │   └── Navbar.jsx    # Navigation bar
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Settings.jsx
│   │   └── *Dashboard.jsx
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI primitives
│   │   └── chat/         # Messaging components
│   ├── stores/           # Zustand state stores
│   │   ├── authStore.js
│   │   ├── chatStore.js
│   │   └── themeStore.js
│   ├── hooks/            # Custom React hooks
│   └── styles/           # Global styles
├── backend/              # Backend API
│   └── medilink-api/     # NestJS application
│       ├── src/
│       │   ├── modules/  # Feature modules
│       │   │   ├── auth/
│       │   │   ├── prescriptions/
│       │   │   ├── patients/
│       │   │   ├── delivery/
│       │   │   └── messaging/
│       │   ├── services/     # Shared services
│       │   │   ├── fhir.service.ts
│       │   │   └── encryption.service.ts
│       │   └── common/       # Guards, decorators
│       └── README.md     # Backend documentation
└── .github/
    └── workflows/        # CI/CD pipelines
```

---

## 🔒 Security Features

### Authentication

- Secure session management
- Password visibility controls
- Remember me functionality
- Two-factor authentication support

### Data Protection

- HIPAA-compliant design principles
- Encrypted data transmission (HTTPS)
- Secure data export (JSON format)
- Safe account deletion with confirmation

### Privacy Controls

- Data sharing preferences
- Anonymized research data option
- Marketing communication controls
- Download personal data feature

---

## ♿ Accessibility Features

### Visual

- Font size adjustment (80%-150%)
- High contrast mode
- Dark medical theme
- Readable typography (16px base)

### Navigation

- Full keyboard support
- ARIA labels and roles
- Focus indicators
- Screen reader friendly

### User Experience

- Large touch targets (48px minimum)
- Clear error messages
- Consistent layouts
- Reduce motion option

---

## 📚 Documentation

- **Walkthrough:** Complete feature documentation in `brain/walkthrough.md`
- **Navigation Guide:** User guide for accessing features
- **Implementation Plan:** Technical architecture details
- **Task Tracking:** Development progress in `brain/task.md`

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows existing patterns
- Accessibility standards are maintained
- Medical UI design is preserved
- All tests pass

---

## 📜 License

This project is licensed under the MIT License.

---

## 🌟 Highlights

✅ **Production-Ready** - Docker, CI/CD, optimized builds  
✅ **FHIR-Compliant** - Healthcare interoperability standards  
✅ **Accessibility-First** - WCAG 2.1 Level AA compliant  
✅ **Medical-Grade UI** - Professional healthcare design  
✅ **Secure by Design** - RBAC, audit logging, encryption  
✅ **Performance Optimized** - Lazy loading, code splitting  
✅ **Automated Tests** - Unit test suite for core backend services  
✅ **Orchestrated** - Full Docker Compose setup with Redis  
✅ **Elderly-Friendly** - Large text, high contrast, simple UX

---

**Built with ❤️ for better healthcare connectivity**
