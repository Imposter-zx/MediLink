# MediLink: Production-Grade Healthcare Connectivity Platform

MediLink is a high-performance, secure, and accessible healthcare platform bridging the gap between patients, pharmacies, and delivery services. Built with a production-first architecture using React 19, Three.js, and FHIR standards.

## 🚀 Key Features

### 🏥 Medplum FHIR Integration

- **Real-time Data:** Fetches clinical resources (`MedicationKnowledge`) directly from Medplum.
- **Smart Ordering:** Automatically creates `MedicationRequest` resources for patient prescriptions.

### 🛡️ Hardened Security

- **RBAC (Role-Based Access Control):** Granular access permissions for Patient, Pharmacy, and Delivery roles.
- **XSS Protection:** Secure authentication flow using memory-only session management and preparation for `httpOnly` cookies.
- **Audit Logging:** Integrated logging for unauthorized access attempts.

### ♿ Elderly-Friendly Accessibility

- **Theme System:** Support for **Light Comfort**, **Dark Medical**, and **High Contrast** modes.
- **Font Scaling:** Real-time font size adjustment for visually impaired users.
- **Navigation:** Keyboard-optimized interface with focus indicators and granular error boundaries.

### ⚡ Performance Optimization

- **Adaptive 3D Experience:** Three.js landing scene that automatically scales quality based on hardware capabilities and battery status.
- **Manual Chunking:** Optimized build strategy splitting large vendors (React, Three.js, Mantine) for lightning-fast caching.
- **Lazy Loading:** Component-level code splitting to minimize initial TTI.

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite
- **State Management:** Zustand
- **Clinical Data:** Medplum FHIR API
- **3D Graphics:** Three.js, @react-three/fiber
- **UI Architecture:** Tailwind CSS, Mantine (Notifications)

## 📦 Getting Started

### Prerequisites

- Node.js (v20+)
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

3.  **Run Development Tools:**
    ```bash
    npm run dev
    ```

## 🐳 Production Scaling

MediLink is container-ready for professional deployment.

- **Docker:** Build a multi-stage production image:
  ```bash
  docker compose up --build
  ```
- **CI/CD:** Automated build and linting via GitHub Actions (`.github/workflows/ci.yml`).
- **Nginx:** Optimized production serving with security headers and Gzip compression.

## 📜 License

This project is licensed under the MIT License.
