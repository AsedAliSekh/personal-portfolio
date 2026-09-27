# Futuristic Full-Stack Personal Portfolio & CMS

A premium, cinematic, highly interactive full-stack personal portfolio and developer CMS built for a modern Computer Science professional, Software Engineer, and Cyber Security Practitioner.

---

## Architecture Overview

```
portfolio-project/
├── frontend/                     # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/           # 3D Canvas, Custom Cursor, Futuristic Loader, Terminal, Navbar, Footer
│   │   ├── contexts/             # AuthContext (JWT) & PortfolioDataContext (Dynamic Sync)
│   │   ├── pages/                # Public Pages & Dedicated Admin CMS Dashboard Pages
│   │   │   ├── admin/            # Dashboard, Projects, Skills, Experience, Blog, Messages, Media, Settings
│   │   ├── sections/             # Modular Homepage Sections (Hero 3D, About, Orbit, CyberLab, etc.)
│   │   ├── services/             # Axios REST API Client with Bearer Token Interceptor
│   │   └── types/                # Strict TypeScript Data Contracts
│   ├── public/                   # Cyber favicon and SVG icons
│   └── package.json
│
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/               # Environment Variables & Dual MongoDB / JSON Resilient Store
│   │   ├── controllers/          # Centralized Request Controllers (Auth, Projects, Blog, CMS, Media)
│   │   ├── middleware/           # JWT Auth Guard, Helmet, CORS, Centralized Error Handler
│   │   ├── models/               # Mongoose Schemas & TypeScript Data Models
│   │   ├── routes/               # REST API Endpoints
│   │   ├── services/             # File Storage, Email Notification, High-Reliability Store
│   │   ├── seed.ts               # Database Seeding Script with Rich Technical Content
│   │   └── server.ts             # Express Application Bootstrap
│   ├── uploads/                  # Local File & Media Upload Storage
│   └── package.json
└── README.md
```

---

## Tech Stack

### Frontend
- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Custom Cyber Glassmorphism & Neon Glow Tokens
- **3D & Canvas**: Three.js, Canvas Confetti
- **Animation**: Framer Motion
- **Icons**: Lucide React + Custom Cyber Brand SVGs
- **HTTP Client**: Axios with automatic JWT header injection

### Backend
- **Runtime**: Node.js & Express with TypeScript (`tsx`)
- **Database**: Dual-Mode (MongoDB / Mongoose with automatic fallback to high-reliability local JSON engine for zero-setup local development)
- **Security**: JWT Authentication, bcrypt password hashing, Helmet, CORS, Rate Limiting
- **File Uploads**: Multer with file type & size validation

---

## Quick Start & Local Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed       # Seeds rich demo data (projects, skills, research, blog, admin user)
npm run dev        # Starts REST API server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open your browser at **`http://localhost:5173/`**.

---

## Default Admin Credentials

- **Admin Login Route**: `/admin/login`
- **Email**: `admin@portfolio.dev`
- **Password**: `Admin@123456`

---

## Features & Highlights

### 1. Futuristic Visual Identity & 3D Hero
- **Interactive Three.js Scene**: Dynamic rotating wireframe icosahedron with floating particle constellation reacting to mouse cursor position.
- **Interactive Tech Orbit**: 3D technology orbit visualization showcasing modern programming stacks.
- **Futuristic Custom Cursor**: Outer spring ring with hover expansion and dynamic `"VIEW"` label.
- **Cyber Initializing Loader**: Telemetry sequence `[AS] SYSTEM INITIALIZING 00 → 100`.

### 2. Full Dynamic Content Management System (Admin Panel)
- **Overview Dashboard**: Real-time telemetry, total page views, project views, contact messages, and quick actions.
- **Project CMS**: Create, edit, delete, publish/unpublish, feature, and upload screenshots for case studies.
- **Skills CMS**: Categorized skill ecosystem (Frontend, Backend, AI/ML, Cyber Security, DevOps) with level indicators.
- **Experience Timeline CMS**: Add roles, companies, achievements, and tech stacks.
- **Blog CMS**: Markdown-ready technical articles, category filtering, reading time calculation, and tags.
- **Messages Inbox**: View inbound contact messages, mark as read, and filter by project budget.
- **Media Upload Manager**: Upload images, PDF certificates, and download resume files with one-click copyable URLs.
- **System Settings & Dynamic Section Builder**: Toggle any homepage section on/off live without redeploying code.

### 3. Interactive Cyber Terminal
- Integrated command line terminal emulator supporting:
  - `whoami`
  - `skills`
  - `projects`
  - `contact`
  - `status`
  - `clear`
  - `help`

---

## REST API Documentation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | System health check | No |
| `POST` | `/api/auth/login` | Admin login & JWT issue | No |
| `GET` | `/api/auth/me` | Current authenticated user | Bearer JWT |
| `GET` | `/api/profile` | Developer profile & availability | No |
| `PUT` | `/api/profile` | Update developer profile | Bearer JWT |
| `GET` | `/api/projects` | List all projects | No |
| `GET` | `/api/projects/:slug`| Single project detail | No |
| `POST` | `/api/projects` | Create new project | Bearer JWT |
| `PUT` | `/api/projects/:id` | Update project | Bearer JWT |
| `DELETE`| `/api/projects/:id`| Delete project | Bearer JWT |
| `GET` | `/api/skills` | List all skills | No |
| `POST` | `/api/skills` | Create skill | Bearer JWT |
| `GET` | `/api/experience` | Experience timeline | No |
| `GET` | `/api/education` | Academic education | No |
| `GET` | `/api/certifications`| Industry certifications | No |
| `GET` | `/api/research` | Research & papers | No |
| `GET` | `/api/blog` | Blog posts list | No |
| `GET` | `/api/blog/:slug` | Single blog article | No |
| `POST` | `/api/contact` | Inbound contact submission | No |
| `GET` | `/api/contact/messages`| View contact messages | Bearer JWT |
| `POST` | `/api/media/upload` | Upload media / PDF file | Bearer JWT |
| `GET` | `/api/settings` | Site settings & SEO | No |
| `PUT` | `/api/settings` | Update settings & sections | Bearer JWT |
