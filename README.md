<p align="center">
  <img src="docs/images/logo-banner.png" alt="AI Creative Studio" width="800" />
</p>

<h1 align="center">AI Creative Studio</h1>

<p align="center">
  <strong>Enterprise-Grade SaaS Platform for AI Image, Video & Chat Generation</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-6C47FF?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-Commercial-FF4154?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe" alt="Stripe" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js" alt="Node.js" />
</p>

<br/>

<p align="center">
  <img src="docs/images/hero-preview.png" alt="AI Creative Studio - Dashboard Preview" width="900" />
</p>

---

<br/>

## Table of Contents

<table>
<tr>
<td width="50%" valign="top">

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [AI Models & Providers](#ai-models--providers)
- [Platform Integrations](#platform-integrations)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)

</td>
<td width="50%" valign="top">

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [License](#license)

</td>
</tr>
</table>

<br/>

---

<br/>

## Overview

**AI Creative Studio** is a production-ready, full-stack SaaS platform that unifies AI-powered image generation, video creation, intelligent chat, and voice processing into a single, beautifully crafted application. Built with **Next.js 16**, **React 19**, and **TypeScript**, it provides everything you need to launch your own AI-powered creative platform -- from a CMS-driven landing page to a complete admin dashboard.

Whether you are building a startup, scaling an enterprise tool, or launching on marketplaces like CodeCanyon, this platform delivers a polished, extensible foundation with **30+ admin panel modules**, **multi-provider AI support**, and **real-time billing integration**.

<br/>

### Why AI Creative Studio?

| Capability | Description |
|:---|:---|
| **Production-Ready** | Battle-tested architecture with health monitoring, error handling, and graceful degradation |
| **Multi-Provider AI** | OpenAI, Google Gemini, Kling AI, Anthropic Claude, Stable Diffusion, and more |
| **Full CMS** | Every section of the landing page, legal pages, blog, and help center is admin-manageable |
| **Enterprise Auth** | Clerk-powered authentication with role-based admin access (Super Admin, Admin, Support, Read-Only) |
| **Monetization-Ready** | Stripe integration with credit system, pricing plans, and detailed billing logs |
| **Omnichannel AI** | Extend AI to WhatsApp, Telegram, Discord, and Slack via built-in integrations |
| **SEO-Optimized** | Dynamic metadata, Open Graph, JSON-LD structured data, sitemaps, and robots.txt |
| **PWA Support** | Installable as a Progressive Web App on any device |

<br/>

---

<br/>

## Live Demo

<table>
<tr>
<td align="center" width="33%">
  <img src="docs/images/demo-landing.png" alt="Landing Page" width="280" />
  <br/><br/>
  <strong>Landing Page</strong>
  <br/>
  <sub>CMS-driven, fully customizable</sub>
</td>
<td align="center" width="33%">
  <img src="docs/images/demo-studio.png" alt="AI Studio" width="280" />
  <br/><br/>
  <strong>AI Studio</strong>
  <br/>
  <sub>Image, Video & Chat generation</sub>
</td>
<td align="center" width="33%">
  <img src="docs/images/demo-admin.png" alt="Admin Panel" width="280" />
  <br/><br/>
  <strong>Admin Panel</strong>
  <br/>
  <sub>30+ management modules</sub>
</td>
</tr>
</table>

<br/>

---

<br/>

## Key Features

### AI Generation Engine

<table>
<tr>
<td width="50%">

**Image Generation**
- Multi-model support (DALL-E 2, DALL-E 3, Gemini, Stable Diffusion)
- Configurable aspect ratios (1:1, 16:9, 9:16, 4:3)
- Quality presets (Standard, HD, Ultra)
- Magic Prompt enhancement for optimized results
- Drag-and-drop image upload for vision models
- Gallery management with prompt reuse

</td>
<td width="50%">

**Video Generation**
- Kling AI video generation (image-to-video)
- Configurable duration, mode, and CFG scale
- Negative prompt support
- Mask-based generation controls
- Real-time generation status tracking
- Direct download with CORS proxy

</td>
</tr>
<tr>
<td width="50%">

**AI Chat & LLM**
- GPT-4o, Claude 3.5, Gemini 2.0 support
- Multi-turn conversation history
- Vision support (image analysis)
- Streaming responses
- Configurable system prompt, temperature, max tokens
- Preset prompt suggestions by category

</td>
<td width="50%">

**Voice Processing**
- Text-to-Speech via OpenAI TTS
- Speech-to-Text via Whisper
- Multiple voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- Adjustable speed settings
- Admin-configurable voice parameters

</td>
</tr>
</table>

<br/>

### Platform & User Features

<table>
<tr>
<td width="50%">

- Unified AI Studio workspace
- Personal image gallery with download
- Conversation history and management
- Credit-based usage system
- Stripe-powered billing and subscriptions
- User profile and settings management
- API key management per user

</td>
<td width="50%">

- Guest browsing mode (no auth required)
- Dark / Light theme toggle
- PWA installation support
- Responsive design (mobile-first)
- Real-time toast notifications
- Help center and FAQ
- Contact form with file upload

</td>
</tr>
</table>

<br/>

### CMS-Driven Landing Page

Every element of the landing page is managed through the admin panel:

<table>
<tr>
<td width="33%">

**Hero Section**
- Custom title, subtitle, badge
- CTA buttons with URLs
- Stats counters
- Trusted-by company logos
- Demo media (video/image)
- Custom fonts and sizes

</td>
<td width="33%">

**Content Sections**
- AI Models Showcase
- Feature cards with icons/gradients
- Integrations display
- Testimonials carousel
- Gallery showcase
- CTA section with benefits

</td>
<td width="33%">

**Navigation & Footer**
- Dynamic navbar with nested items
- Footer link categories
- Social media links
- Contact information
- Blog integration
- Legal page links

</td>
</tr>
</table>

<br/>

---

<br/>

## AI Models & Providers

<table>
<tr>
<th align="left">Provider</th>
<th align="left">Models</th>
<th align="left">Capabilities</th>
<th align="center">Status</th>
</tr>
<tr>
<td><strong>OpenAI</strong></td>
<td>DALL-E 2, DALL-E 3, GPT-4o</td>
<td>Image Generation, Chat, Vision, TTS, STT</td>
<td align="center"><img src="https://img.shields.io/badge/-Active-34D058?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Google</strong></td>
<td>Gemini 2.0, Gemini 3 Pro Image Preview</td>
<td>Chat, Multimodal, Image Generation</td>
<td align="center"><img src="https://img.shields.io/badge/-Active-34D058?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Kuaishou</strong></td>
<td>Kling AI v1</td>
<td>Video Generation (Image-to-Video)</td>
<td align="center"><img src="https://img.shields.io/badge/-Active-34D058?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Anthropic</strong></td>
<td>Claude 3.5 Sonnet</td>
<td>Chat, Analysis, Code Generation</td>
<td align="center"><img src="https://img.shields.io/badge/-Active-34D058?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Stability AI</strong></td>
<td>Stable Diffusion</td>
<td>Image Generation</td>
<td align="center"><img src="https://img.shields.io/badge/-Active-34D058?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Replicate</strong></td>
<td>Custom Models</td>
<td>Multi-purpose</td>
<td align="center"><img src="https://img.shields.io/badge/-Supported-0366D6?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Mistral</strong></td>
<td>Mistral Large, Mixtral</td>
<td>Chat, Code</td>
<td align="center"><img src="https://img.shields.io/badge/-Supported-0366D6?style=flat-square" /></td>
</tr>
<tr>
<td><strong>Cohere</strong></td>
<td>Command R+</td>
<td>Chat, RAG</td>
<td align="center"><img src="https://img.shields.io/badge/-Supported-0366D6?style=flat-square" /></td>
</tr>
<tr>
<td><strong>HuggingFace</strong></td>
<td>Inference API</td>
<td>Multi-purpose</td>
<td align="center"><img src="https://img.shields.io/badge/-Supported-0366D6?style=flat-square" /></td>
</tr>
</table>

> **API Key Resolution Priority:** Model-specific key --> Default key from Admin Settings --> Environment variable fallback. This three-tier system ensures maximum flexibility for multi-tenant deployments.

<br/>

---

<br/>

## Platform Integrations

Extend your AI capabilities to popular messaging platforms with built-in bot integrations:

<table>
<tr>
<td align="center" width="20%">
  <img src="docs/images/integration-whatsapp.png" alt="WhatsApp" width="64" height="64" />
  <br/><br/>
  <strong>WhatsApp</strong>
  <br/>
  <sub>Business Cloud API</sub>
</td>
<td align="center" width="20%">
  <img src="docs/images/integration-telegram.png" alt="Telegram" width="64" height="64" />
  <br/><br/>
  <strong>Telegram</strong>
  <br/>
  <sub>Bot API</sub>
</td>
<td align="center" width="20%">
  <img src="docs/images/integration-discord.png" alt="Discord" width="64" height="64" />
  <br/><br/>
  <strong>Discord</strong>
  <br/>
  <sub>API v10</sub>
</td>
<td align="center" width="20%">
  <img src="docs/images/integration-slack.png" alt="Slack" width="64" height="64" />
  <br/><br/>
  <strong>Slack</strong>
  <br/>
  <sub>Bot API</sub>
</td>
<td align="center" width="20%">
  <img src="docs/images/integration-webhook.png" alt="Webhooks" width="64" height="64" />
  <br/><br/>
  <strong>Webhooks</strong>
  <br/>
  <sub>Custom REST</sub>
</td>
</tr>
</table>

Each integration includes:
- Bi-directional message support (send and receive)
- Automatic user mapping and conversation management
- Credit-based usage tracking per external user
- Admin panel configuration (API keys, webhook URLs, channel IDs)
- Test functionality for verifying connections

<br/>

---

<br/>

## Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
| Technology | Version | Purpose |
|:---|:---|:---|
| Next.js | 16.1 | React Framework (App Router) |
| React | 19.2 | UI Library |
| TypeScript | 5.8 | Type Safety |
| Tailwind CSS | 3.4 | Utility-First Styling |
| shadcn/ui | Latest | Component Library |
| Framer Motion | 12.31 | Animations |
| Recharts | 3.7 | Data Visualization |
| Lucide React | 0.562 | Icon Library |

</td>
<td width="50%">

### Backend & Infrastructure
| Technology | Version | Purpose |
|:---|:---|:---|
| PostgreSQL | 16 | Primary Database |
| Prisma | 5.22 | ORM & Migrations |
| Clerk | 6.36 | Authentication |
| Stripe | 20.3 | Payments & Billing |
| Docker | Latest | Containerization |
| Vercel | Latest | Edge Deployment |
| Node.js | 20+ | Runtime |
| Sonner | 2.0 | Toast Notifications |

</td>
</tr>
</table>

<br/>

---

<br/>

## Architecture

```
ai-creative-studio/
|
|-- app/                          # Next.js App Router
|   |-- page.tsx                  # CMS-driven landing page
|   |-- layout.tsx                # Root layout (SEO, fonts, theme)
|   |
|   |-- platform/                 # User-facing platform
|   |   |-- studio/               # AI Studio (image, video, chat)
|   |   |-- gallery/              # Personal image gallery
|   |   |-- chat/                 # AI Chat interface
|   |   |-- billing/              # Credit purchase & billing
|   |   |-- settings/             # User settings
|   |   |-- history/              # Generation history
|   |   +-- help/                 # Help center
|   |
|   |-- admin/                    # Admin dashboard (30+ modules)
|   |   |-- settings/             # Global site settings
|   |   |-- models/               # AI model management
|   |   |-- users/                # User management
|   |   |-- analytics/            # Revenue & usage analytics
|   |   |-- blog/                 # Blog CMS
|   |   |-- gallery/              # Gallery CMS
|   |   |-- chat-integrations/    # Bot integrations config
|   |   |-- moderation/           # Content moderation
|   |   |-- feature-flags/        # Feature flag management
|   |   +-- ...                   # 20+ more modules
|   |
|   |-- api/                      # API Routes
|   |   |-- generate/             # Image generation API
|   |   |-- chat/                 # Chat completion API
|   |   |-- voice/                # TTS & STT APIs
|   |   |-- checkout/             # Stripe checkout
|   |   |-- webhooks/             # Stripe webhooks
|   |   |-- integrations/         # Bot webhook receivers
|   |   |-- kling/                # Video generation
|   |   +-- admin/                # Admin CRUD APIs (22 routes)
|   |
|   |-- blog/                     # Public blog
|   |-- docs/                     # Developer documentation
|   |-- contact/                  # Contact form
|   |-- legal/                    # Legal pages (dynamic)
|   +-- about/                    # About page
|
|-- lib/                          # Core libraries
|   |-- ai-service.ts             # Multi-provider AI service
|   |-- db.ts                     # Prisma client singleton
|   |-- stripe.ts                 # Stripe client
|   |-- stripe-actions.ts         # Stripe server actions
|   |-- seo.ts                    # SEO & JSON-LD utilities
|   |-- config.ts                 # App configuration
|   |-- crypto.ts                 # API key encryption
|   |-- prompt-enhancer.ts        # Magic Prompt AI enhancer
|   +-- integrations/             # Chat platform handlers
|
|-- prisma/
|   |-- schema.prisma             # Database schema (30+ models)
|   +-- seed.ts                   # Database seed script
|
|-- scripts/                      # Utility scripts
|-- public/                       # Static assets
+-- docker-compose.yml            # Docker orchestration
```

<br/>

---

<br/>

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|:---|:---|
| Node.js | 20.0.0 |
| npm | 10.0.0 |
| PostgreSQL | 16 (or Supabase/Neon) |
| Clerk Account | [clerk.com](https://clerk.com) |
| Stripe Account | [stripe.com](https://stripe.com) |
| OpenAI API Key | [platform.openai.com](https://platform.openai.com) |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ai-creative-studio.git
cd ai-creative-studio
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables)).

**4. Initialize the database**

```bash
npx prisma db push
npx prisma db seed
```

**5. Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

<br/>

### Quick Start with Docker

```bash
# Start all services (PostgreSQL + App + Adminer)
docker-compose up -d

# The app will be available at http://localhost:3000
# Adminer (DB management) at http://localhost:8080
```

<br/>

---

<br/>

## Environment Variables

<details>
<summary><strong>Click to expand full environment variable reference</strong></summary>

<br/>

### Core Application

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | Yes | PostgreSQL direct connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Public application URL |

### Authentication (Clerk)

| Variable | Required | Description |
|:---|:---:|:---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Sign-in page path (default: `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Sign-up page path (default: `/sign-up`) |

### Payments (Stripe)

| Variable | Required | Description |
|:---|:---:|:---|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |

### AI Providers

| Variable | Required | Description |
|:---|:---:|:---|
| `OPENAI_API_KEY` | No | OpenAI API key (fallback) |
| `GEMINI_API_KEY` | No | Google Gemini API key (fallback) |
| `KLING_ACCESS_KEY` | No | Kling AI access key (fallback) |
| `KLING_SECRET_KEY` | No | Kling AI secret key (fallback) |

### Storage

| Variable | Required | Description |
|:---|:---:|:---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

> **Note:** AI API keys can also be configured per-model through the Admin Panel, with a three-tier priority system: Model-specific key --> Admin default key --> Environment variable.

</details>

<br/>

---

<br/>

## Deployment

### Vercel (Recommended)

<table>
<tr>
<td width="60%">

**One-Click Deploy**

1. Push your repository to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Add all environment variables
4. Deploy

Vercel will automatically detect Next.js and configure the build pipeline. Cron jobs for analytics collection and health checks are pre-configured in `vercel.json`.

</td>
<td width="40%" align="center">

<img src="docs/images/deploy-vercel.png" alt="Deploy to Vercel" width="260" />

</td>
</tr>
</table>

### Docker

```bash
# Build the production image
docker build -t ai-creative-studio .

# Run with docker-compose (includes PostgreSQL & Adminer)
docker-compose up -d
```

The Docker setup includes:
- **Multi-stage build** for optimized image size
- **PostgreSQL 16 Alpine** with health checks
- **Adminer** for database management
- **Non-root user** for security
- **dumb-init** for proper signal handling

### Self-Hosted

```bash
# Build for production
npm run build

# Start the production server
npm start
```

For self-hosted deployments, use the provided setup scripts:

```bash
# Linux/macOS
chmod +x setup-production-env.sh
./setup-production-env.sh

# Windows
setup-production-env.bat
```

<br/>

---

<br/>

## Admin Panel

The admin panel provides **30+ management modules** accessible at `/admin`. Role-based access control supports four permission levels:

<table>
<tr>
<th align="center">Role</th>
<th align="left">Permissions</th>
</tr>
<tr>
<td align="center"><strong>Super Admin</strong></td>
<td>Full access to all modules, user management, system settings, API keys</td>
</tr>
<tr>
<td align="center"><strong>Admin</strong></td>
<td>Content management, user moderation, analytics, model configuration</td>
</tr>
<tr>
<td align="center"><strong>Support</strong></td>
<td>Contact submissions, user inquiries, help center management</td>
</tr>
<tr>
<td align="center"><strong>Read Only</strong></td>
<td>View-only access to dashboard, analytics, and audit logs</td>
</tr>
</table>

<br/>

### Module Overview

<table>
<tr>
<td width="33%" valign="top">

**Core Management**
- Dashboard & KPI Metrics
- User Management & Credits
- AI Model Configuration
- Model Credit Costs
- Role & Permission Management
- Audit Logs
- Feature Flags
- Analytics & Revenue
- Health Monitoring

</td>
<td width="33%" valign="top">

**Content Management**
- Blog CMS (Posts, Categories, Tags)
- Gallery Curation
- Testimonials Management
- Help Center Articles
- Legal Pages (Versioned)
- About Page Configuration
- Contact Submissions
- Prompt Suggestions

</td>
<td width="33%" valign="top">

**System Configuration**
- Global Site Settings
- Navigation Management
- Footer CMS
- Cookie Consent Settings
- Chat Integrations
- Chat Prompt Library
- Voice Settings (TTS/STT)
- Billing & Pricing Plans
- Moderation & Abuse Flags

</td>
</tr>
</table>

<br/>

<p align="center">
  <img src="docs/images/admin-dashboard.png" alt="Admin Dashboard" width="900" />
</p>

<br/>

---

<br/>

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/generate` | Generate AI images |
| `POST` | `/api/chat` | Send chat messages to LLM |
| `POST` | `/api/voice/tts` | Text-to-Speech conversion |
| `POST` | `/api/voice/stt` | Speech-to-Text transcription |
| `POST` | `/api/kling/token` | Generate Kling AI JWT token |
| `POST` | `/api/checkout` | Create Stripe checkout session |
| `GET` | `/api/plans` | Retrieve pricing plans |
| `GET` | `/api/prompts` | Get prompt suggestions |
| `GET` | `/api/health` | System health status |
| `GET` | `/api/maintenance` | Maintenance mode status |
| `GET` | `/api/docs` | Documentation content |
| `GET` | `/api/legal` | Legal page content |
| `GET` | `/api/footer` | Footer data |
| `GET` | `/api/download` | CORS proxy for file downloads |

### Webhook Endpoints

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/webhooks` | Stripe payment webhooks |
| `POST` | `/api/integrations/discord` | Discord bot webhook |
| `POST` | `/api/integrations/slack` | Slack bot webhook |

### Admin API

The admin API provides **22 CRUD endpoints** under `/api/admin/` covering all management modules. Each endpoint requires authenticated admin access with appropriate role permissions.

<details>
<summary><strong>View all admin endpoints</strong></summary>

<br/>

| Endpoint | Description |
|:---|:---|
| `/api/admin/analytics` | Revenue & usage analytics |
| `/api/admin/audit-logs` | Admin action audit trail |
| `/api/admin/billing` | Billing management |
| `/api/admin/chat-integrations` | Bot integration configuration |
| `/api/admin/chat-prompts` | Prompt suggestion management |
| `/api/admin/contact-submissions` | Contact form submissions |
| `/api/admin/credits` | User credit management |
| `/api/admin/feature-flags` | Feature flag toggles |
| `/api/admin/footer` | Footer content management |
| `/api/admin/gallery` | Gallery item curation |
| `/api/admin/health` | System health metrics |
| `/api/admin/help` | Help center articles |
| `/api/admin/integrations` | Integration documentation |
| `/api/admin/legal` | Legal page management |
| `/api/admin/model-costs` | Model credit cost config |
| `/api/admin/moderation` | Content moderation |
| `/api/admin/pricing-plans` | Pricing plan management |
| `/api/admin/roles` | Admin role management |
| `/api/admin/settings` | Global settings |
| `/api/admin/testimonials` | Testimonial management |
| `/api/admin/users` | User management |
| `/api/admin/voice-settings` | Voice configuration |

</details>

<br/>

---

<br/>

## Screenshots

<table>
<tr>
<td align="center" width="50%">
  <img src="docs/images/screenshot-landing.png" alt="Landing Page" width="440" />
  <br/><br/>
  <strong>Landing Page</strong>
</td>
<td align="center" width="50%">
  <img src="docs/images/screenshot-studio.png" alt="AI Studio" width="440" />
  <br/><br/>
  <strong>AI Studio</strong>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/images/screenshot-chat.png" alt="AI Chat" width="440" />
  <br/><br/>
  <strong>AI Chat Interface</strong>
</td>
<td align="center" width="50%">
  <img src="docs/images/screenshot-gallery.png" alt="Gallery" width="440" />
  <br/><br/>
  <strong>Image Gallery</strong>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/images/screenshot-admin.png" alt="Admin Panel" width="440" />
  <br/><br/>
  <strong>Admin Dashboard</strong>
</td>
<td align="center" width="50%">
  <img src="docs/images/screenshot-billing.png" alt="Billing" width="440" />
  <br/><br/>
  <strong>Billing & Credits</strong>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/images/screenshot-blog.png" alt="Blog" width="440" />
  <br/><br/>
  <strong>Blog</strong>
</td>
<td align="center" width="50%">
  <img src="docs/images/screenshot-docs.png" alt="Documentation" width="440" />
  <br/><br/>
  <strong>Developer Documentation</strong>
</td>
</tr>
</table>

<br/>

---

<br/>

## Database Schema

The application uses **30+ Prisma models** organized into logical domains:

<table>
<tr>
<td width="33%" valign="top">

**Users & Auth**
- User
- AdminUser
- AdminCreditLog
- AiUsageModeration

**AI & Generation**
- AiModel
- ModelCreditCost
- GeneratedImage
- PromptSuggestion

</td>
<td width="33%" valign="top">

**Content & CMS**
- BlogPost
- GalleryItem
- Testimonial
- HelpArticle
- LegalContent
- LandingFeature
- NavItem
- FooterLinkCategory

</td>
<td width="33%" valign="top">

**System & Config**
- GlobalSettings
- FeatureFlag
- AuditLog
- AnalyticsRecord
- HealthMetric
- CookieSettings
- ContactSubmission
- ChatIntegration

</td>
</tr>
</table>

<br/>

### Database Commands

```bash
# Push schema changes to database
npx prisma db push

# Seed the database with initial data
npx prisma db seed

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Generate Prisma client
npx prisma generate
```

<br/>

---

<br/>

## Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code analysis |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (visual editor) |
| `npm run prepare-delivery` | Package project for marketplace delivery |
| `npm run migrate:encrypt-keys` | Encrypt existing API keys in database |

<br/>

---

<br/>

## Credit System

The platform uses a flexible credit-based billing model:

| Feature | Credits |
|:---|:---|
| Welcome Bonus (new users) | 5 credits |
| Daily Free Credits | 3 credits/day (refilled if below 10) |
| Integration Users | 100 credits |
| Per-Model Cost | Configurable via Admin Panel |

Credits are deducted per generation based on the AI model used. Administrators can configure per-model credit costs, adjust user balances with audit logging, and manage pricing plans through the admin panel.

<br/>

---

<br/>

## Browser Support

| Browser | Version |
|:---|:---|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

<br/>

---

<br/>

## Changelog

### v2.0.0 (Current)

- Next.js 16 and React 19 upgrade
- Multi-provider AI support (OpenAI, Gemini, Kling, Claude, Stable Diffusion)
- Video generation with Kling AI
- Voice processing (TTS/STT)
- Platform integrations (WhatsApp, Telegram, Discord, Slack)
- 30+ admin panel modules
- CMS-driven landing page
- Blog, Help Center, and Legal CMS
- Feature flags with rollout percentages
- Health monitoring system
- Cookie consent (GDPR-compliant)
- PWA support
- Comprehensive SEO with JSON-LD
- Docker deployment support
- API key encryption

<br/>

---

<br/>

## Support

<table>
<tr>
<td align="center" width="33%">
  <br/>
  <strong>Documentation</strong>
  <br/><br/>
  Access the built-in developer documentation at <code>/docs</code> for detailed integration guides and API references.
  <br/><br/>
</td>
<td align="center" width="33%">
  <br/>
  <strong>Issue Tracker</strong>
  <br/><br/>
  Report bugs and request features through the CodeCanyon item comments section.
  <br/><br/>
</td>
<td align="center" width="33%">
  <br/>
  <strong>Updates</strong>
  <br/><br/>
  All future updates are included with your purchase. Check CodeCanyon for the latest version.
  <br/><br/>
</td>
</tr>
</table>

<br/>

---

<br/>

## License

<<<<<<< Updated upstream
## License & Commercial Use 

**⚠️ NOTICE: PROPRIETARY SHOWCASE**

This repository contains a **limited showcase version** of a commercial SaaS product. The code provided here is for **educational and portfolio demonstration purposes only**.

### ❌ For Visitors of this Repository (Public Access)
You are **NOT** allowed to:
- Deploy this codebase for commercial use.
- Use these files to create a competing product.
- Redistribute or resell this source code.

### ✅ For Commercial License Holders (Paid Customers)
If you obtain a valid commercial license from the author, you will receive the **full production codebase** which grants you the right to:
- Deploy the platform for your own SaaS business.
- Customize and white-label the application.
- Use for unlimited projects.

**Interested in purchasing a license or white-labeling this platform?**
Please contact the author for pricing and details.

Copyright © 2026. All rights reserved.
=======
**This is a commercial product.** This project is licensed under a **Commercial License**. 

Unauthorized copying, distribution, modification, public display, or public performance of this software is strictly prohibited. Purchase grants you a license to use this software under the terms specified at the point of sale.

For licensing inquiries, visit the [product page](https://codecanyon.net/item/ai-creative-studio).

**All rights reserved.**

<br/>
>>>>>>> Stashed changes

---

<p align="center">
  <img src="docs/images/logo-footer.png" alt="AI Creative Studio" width="120" />
</p>

<p align="center">
  <strong>AI Creative Studio</strong> -- Built with precision for the modern web.
</p>

<<<<<<< Updated upstream
---
*Bu repo, projenin Public Vitrin sürümüdür. Hassas iş mantığı ve API anahtarları güvenlik nedeniyle gizlenmiştir.*
=======
<p align="center">
  <sub>Next.js 16 / React 19 / TypeScript 5.8 / PostgreSQL / Prisma / Stripe / Clerk</sub>
</p>
>>>>>>> Stashed changes
