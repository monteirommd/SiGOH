<div align="center">

# SiGOH
### Sistema de Gestão de Ocupação Hospitalar

**Real-time hospital bed management — built for the floor, designed for decision-makers.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)

[🇧🇷 Leia em Português](./README.pt-BR.md)

</div>

---

## The Problem

Hospitals lose visibility. Beds sit idle while patients wait. Staff updates paper sheets or slow ERP dashboards. Managers make capacity decisions on stale data.

SiGOH fixes this with a real-time occupancy map that every role in the hospital can act on — from the floor technician updating a single bed to the administrator planning capacity across entire blocks.

---

## What It Does

SiGOH is a **production web application** deployed for an active hospital, built to replace manual bed-tracking processes. It gives different hospital roles a purpose-built interface tailored to their needs:

| Role | Interface | Capabilities |
|------|-----------|--------------|
| **Technician** (Técnico) | Mobile-first | Update bed status, view block layout |
| **Manager** (Gestor Base) | Desktop dashboard | Monitor occupancy rates, view analytics, run presentations |
| **Admin** (Gestor Admin) | Full desktop suite | All above + manage users, blocks, wards, and beds |

### Core Features

- **Live Bed Map** — Visual grid of every bed in every ward, color-coded by status, updated in real time across all connected sessions
- **Status State Machine** — Beds transition through `AVAILABLE → OCCUPIED → CLEANING → AVAILABLE`, with `BLOCKED` as an admin-only terminal state
- **Occupancy Analytics** — Charts showing real-time and historical occupancy rates per block, ward, and hospital-wide, with color-coded thresholds (green/yellow/red)
- **Presentation Mode** — An automated carousel of occupancy slides designed to run on TVs or conference room displays, giving management a live hospital overview without interaction
- **Complete Audit Trail** — Every bed status change is logged with timestamp and the name of who made it
- **Role-Based Access Control** — Route protection, permission guards, and UI rendering all controlled by user role, enforced both client-side and via Firestore

---

## Tech Stack

### Frontend
- **React 19** with functional components, hooks, and Context API
- **TypeScript** — strictly typed throughout, including Firestore data models
- **React Router 7** — declarative routing with role-based protected layouts
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI** — accessible, composable component system
- **Recharts** — responsive pie charts, bar charts, and time-series occupancy graphs

### Backend & Infrastructure
- **Firebase Firestore** — NoSQL real-time database with composite indexes for performant queries
- **Firebase Auth** — email/password authentication with session caching
- **Firebase Cloud Functions** — server-side operations (user creation, password reset flows)
- **Firebase Hosting** — SPA deployment with rewrite rules
- **Firebase Emulator Suite** — full local dev environment mirroring production

### Tooling
- **Vite 7** — sub-second HMR and optimized production builds
- **ESLint + TypeScript ESLint** — enforced code quality
- **Firestore seed scripts** — reproducible data setup for both production and emulator

---

## Architecture

```
src/
├── pages/
│   ├── login/                  # Auth flow
│   ├── desktop/
│   │   ├── dashboard/          # Multi-view: map, charts, table
│   │   ├── apresentacao/       # Presentation carousel mode
│   │   └── gestao/             # CRUD admin pages (users, blocks, wards, beds)
│   └── mobile/
│       ├── home/               # Technician block selection
│       └── bloco/              # Bed status update interface
├── components/
│   ├── mapa/                   # Bed map visualization system
│   ├── graficos/               # Recharts occupancy analytics
│   └── slides/                 # Presentation slide components
├── context/
│   ├── auth-context.tsx        # Firebase Auth + user profile state
│   └── app-data-context.tsx    # Real-time Firestore listeners + derived Maps
├── service/                    # Firestore CRUD — one module per entity
├── model/                      # TypeScript interfaces for all domain entities
└── utils/                      # Occupancy calculations, status color mapping
```

### Data Model

```typescript
type StatusLeito = "DISPONIVEL" | "OCUPADO" | "LIMPEZA" | "BLOQUEADO"
type UserRole    = "TECNICO" | "GESTOR_BASE" | "GESTOR_ADMIN"

// Firestore collections: blocos → enfermarias → leitos
// Every status change writes to historico_leitos (audit log)
```

---

## Engineering Highlights

**Real-time multi-user sync without polling** — `AppDataContext` wraps Firestore `onSnapshot` listeners for all entities, propagating live updates across all connected clients automatically. Cleanup is handled via listener unsubscription on unmount.

**O(1) lookups at scale** — derived `Map<id, entity[]>` structures (e.g., `leitosByBloco`, `leitosByEnfermaria`) are computed via `useMemo` once and reused throughout the component tree, avoiding repeated array filters on every render.

**Atomic status transitions** — bed status updates and history log writes are executed as Firestore transactions, preventing partial writes under concurrent updates.

**Session-cached auth** — user profile is cached in `sessionStorage` after first fetch, eliminating redundant Firestore reads on page reloads while maintaining Firebase Auth as the source of truth.

**Progressive disclosure by role** — a single `usePermission` hook and a `ProtectedLayout` component gate every route and UI action, with no role logic scattered through business components.

---

## Running Locally

```bash
# Clone and install
git clone https://github.com/monteirommd/sigoh.git
cd sigoh
npm install

# Configure Firebase credentials
cp .env.example .env
# Fill in your Firebase project values in .env

# Start local development (against Firebase emulator)
npm run emulator       # Starts Firebase emulators
npm run seed:emulator  # Seeds emulator with sample data
npm run dev            # Starts Vite dev server
```

**Emulator ports:** Auth `9099` · Firestore `8080` · Functions `5001` · Hosting `5000`

---

## About the Developer

Hi, I'm **Mateus Monteiro** — a full-stack developer focused on building real products that solve real operational problems.

SiGOH is a production system I designed and built from scratch: requirements gathering, data modeling, architecture, frontend, backend, deployment, and ongoing iteration. It runs in an active hospital environment.

What this project demonstrates:

- **Domain translation** — understanding a healthcare workflow well enough to model it precisely in code, not just build a generic CRUD app
- **Full-stack ownership** — from Firestore schema design and Cloud Functions to component architecture and responsive UI
- **Production mindset** — audit logs, role enforcement, atomic transactions, emulator-based local dev, and seeded test data aren't afterthoughts — they were built in from the start
- **UX thinking across roles** — a mobile technician and a desktop admin have fundamentally different workflows; the system respects that instead of forcing everyone into the same interface

I'm open to **full-stack**, **frontend**, or **backend** roles where I can own real features and work on products that matter. I'm most effective on small, high-trust teams where engineers have end-to-end ownership.

**Contact:**
- Email: [mateusmonteiroduarte@gmail.com](mailto:mateusmonteiroduarte@gmail.com)
- GitHub: [@monteirommd](https://github.com/monteirommd)
- LinkedIn: [mateusmonteiroduarte](https://www.linkedin.com/in/mateusmonteiroduarte/)

---

<div align="center">
<sub>Built with TypeScript · React · Firebase · Tailwind CSS</sub>
</div>
