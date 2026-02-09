# AI Creative Studio

**Enterprise-Grade AI SaaS Platform | No-Code Admin Management | Multi-Provider AI Integration**

A production-ready, white-label AI creative platform built with Next.js 16, React 19, and TypeScript. This platform enables businesses to deploy a complete AI-powered creative studio without writing a single line of code. Every aspect of the application—from landing page content to AI model configurations—is fully manageable through an intuitive admin dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Key Differentiators](#key-differentiators)
- [Architecture](#architecture)
- [Admin Panel Capabilities](#admin-panel-capabilities)
- [Platform Features](#platform-features)
- [AI Providers and Models](#ai-providers-and-models)
- [External Integrations](#external-integrations)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Security](#security)
- [License](#license)

---

## Overview

AI Creative Studio is a comprehensive SaaS solution designed for entrepreneurs, agencies, and enterprises who want to launch their own AI-powered creative platform. The system provides three core AI capabilities:

1. **Image Generation** — DALL-E 3, Gemini Imagen, Stability AI, and custom model support
2. **Video Generation** — Kling AI integration for text-to-video and image-to-video
3. **Intelligent Chat** — GPT-4, Gemini Pro, Claude, and multi-model conversation support

What sets this platform apart is its **complete no-code administration**. Business owners can customize every element of their platform through the admin dashboard, eliminating the need for developer intervention after initial deployment.

---

## Key Differentiators

### Complete No-Code Administration

Unlike traditional SaaS templates that require code modifications for customization, this platform provides:

| Feature | Traditional Approach | AI Creative Studio |
|---------|---------------------|-------------------|
| Landing Page Content | Edit `.tsx` files | Admin Dashboard |
| AI Model Management | Environment variables | Visual Model Manager |
| Pricing Plans | Database migrations | Drag-and-drop Editor |
| Legal Documents | Static files | Rich Text Editor |
| Branding and Logos | Replace image files | Upload Interface |
| Feature Toggles | Code deployment | One-click Toggle |
| User Management | Raw database queries | Full Admin Panel |

### Enterprise-Ready Features

- **Multi-tenant Architecture** — Single codebase, infinite customization
- **Role-Based Access Control** — Super Admin, Admin, Support, Read-Only roles
- **Comprehensive Audit Logging** — Track every administrative action
- **Rate Limiting and Abuse Prevention** — Built-in moderation system
- **Credit-Based Billing** — Flexible monetization with Stripe integration
- **External Platform Integration** — WhatsApp, Telegram, Discord, Slack bots

---

## Architecture

```
+-----------------------------------------------------------------------------+
|                              CLIENT LAYER                                    |
+-----------------+-----------------+-----------------+----------------------+
|   Landing Page  |  User Platform  |  Admin Panel    |  External Platforms  |
|   (Marketing)   |  (Generation)   |  (Management)   |  (WhatsApp/Telegram) |
+--------+--------+--------+--------+--------+--------+----------+-----------+
         |                 |                 |                   |
         +-----------------+-----------------+-------------------+
                                    |
+-----------------------------------+-----------------------------------+
|                           NEXT.JS 16 APP ROUTER                        |
+---------------------------------------------------------------------------+
|  Server Components  |  Server Actions  |  API Routes  |  Middleware        |
+---------------------------------------------------------------------------+
                                    |
+-----------------------------------+-----------------------------------+
|                            SERVICE LAYER                               |
+-----------------+-----------------+-----------------+------------------+
|   AI Service    |  Auth Service   |  Payment Service|  Integration Svc |
|   (Multi-Model) |  (Clerk)        |  (Stripe)       |  (Webhooks)      |
+--------+--------+--------+--------+--------+--------+----------+-------+
         |                 |                 |                   |
+--------+-----------------+-----------------+-------------------+-------+
|                            DATA LAYER                                  |
+------------------------------------------------------------------------+
|                     PostgreSQL + Prisma ORM                            |
|   Users | Generations | Transactions | Settings | CMS Content | Logs   |
+------------------------------------------------------------------------+
```

---

## Admin Panel Capabilities

The admin dashboard provides complete control over every aspect of the platform:

### 1. Global Settings (`/admin/settings`)

**General Settings**
- Site name, description, and URL
- Support email configuration
- SEO keywords and meta tags

**Branding**
- Logo upload (light and dark mode variants)
- Favicon customization
- Brand name configuration

**Landing Page**
- Hero section content (title, subtitle, badge)
- Typography controls (font family, size for each element)
- Demo media configuration (video/image popup on "Watch Demo" button)
- Feature section customization
- CTA section content

**Payment Configuration**
- Stripe API keys (publishable, secret, webhook)
- Credit pricing settings
- Welcome credits for new users
- Daily free credit allocation

**AI API Keys**
- Default OpenAI API key
- Default Gemini API key
- Kling AI credentials
- Per-model API key override

**Theme Settings**
- Default theme (dark/light)
- User theme toggle permission

### 2. AI Model Management (`/admin/models`)

Complete visual control over AI models with extensive configuration options:

**Basic Configuration**
- Provider selection (OpenAI, Gemini, Kling, Anthropic, Mistral, Stability, Replicate, HuggingFace, Custom)
- Model type (LLM, Image, Video, Audio, Embedding, Multimodal)
- API identifier and custom endpoints
- Model-specific API keys

**Pricing Configuration**
- Pricing model (Per Request, Per Token, Per Second, Per Image, Tiered)
- Input/Output token costs for LLMs
- Credit cost per generation
- Plan tier requirements

**Rate Limits and Quotas**
- Requests per minute
- Requests per day
- Max tokens per request
- Max images per request

**Capabilities and Constraints**
- Feature flags (vision, function_calling, streaming, json_mode)
- Supported image sizes and formats
- Context window size
- Quality presets (standard, HD, ultra)

**Access Control**
- Public/Private visibility
- Beta feature flag
- Deprecation status
- Required plan tier

### 3. User Management (`/admin/users`)

- Complete user listing with search and filters
- Credit balance management (add/subtract with reason logging)
- Account blocking/unblocking
- Stripe customer ID linking
- Generation history per user
- Credit transaction audit trail

### 4. Content Management System

**Features Manager (`/admin/features`)**
- Create/edit landing page feature cards
- Icon selection from Lucide library
- Gradient color configuration
- Badge labels (New, Popular, etc.)
- Media attachments (image/video with admin-configurable URLs)
- Display order control
- Active/inactive toggle

**Gallery Manager (`/admin/gallery`)**
- Showcase curated AI generations
- Prompt attribution
- Model labeling
- Display ordering

**Testimonials (`/admin/testimonials`)**
- Customer review management
- Author details and avatars
- Star ratings (1-5)
- Featured testimonials

**Blog System (`/admin/blog`)**
- Rich text editor with markdown support
- Category management
- Tag system
- Featured posts
- Publish scheduling
- View analytics

**Legal Documents (`/admin/legal`)**
- Terms of Service
- Privacy Policy
- Refund Policy
- Cookie Policy
- Version history tracking

**Help Center (`/admin/help-center`)**
- FAQ management
- Category organization
- Publishable content

### 5. Pricing Plans (`/admin/plans`)

Visual pricing plan editor:
- Plan name and description
- Price configuration
- Credit allocation
- Feature list (bullet points)
- Popular plan highlighting
- Active/inactive toggle

### 6. Chat Configuration

**Chat Prompts (`/admin/chat-prompts`)**
- Predefined conversation starters
- Category organization
- Icon assignment
- Display ordering

**Chat Integrations (`/admin/chat-integrations`)**
- WhatsApp Business API configuration
- Telegram Bot setup
- Discord Bot integration
- Slack App configuration
- Custom Webhook endpoints
- Connection testing

**Voice Settings (`/admin/voice-settings`)**
- TTS voice selection (alloy, echo, fable, onyx, nova, shimmer)
- Speech speed control
- Transcription model selection

### 7. Footer Management (`/admin/footer`)

- Link categories (Product, Company, Resources, Legal)
- Individual link management with external link support
- Social media links with platform icons
- Contact information (email, phone, address)

### 8. Navigation Management (`/admin/navigation`)

- Header navigation items
- Dropdown menu support
- Icon assignment
- Display ordering
- Active/inactive toggle

### 9. Cookie Consent (`/admin/cookies`)

- Banner content customization
- Category descriptions (Analytics, Marketing, Functional)
- Position and theme settings
- Consent expiration configuration

### 10. Analytics and Monitoring (`/admin/analytics`)

- Revenue tracking
- Credit usage statistics
- Generation counts by model
- Active user metrics
- Time-series data visualization

### 11. System Health (`/admin/health`)

- Component status monitoring
- Latency metrics
- Error count tracking
- Database connection status
- API endpoint health

### 12. Audit Logs (`/admin/audit-logs`)

Complete audit trail:
- Every admin action logged
- Resource identification
- IP address tracking
- Timestamp recording
- Filterable by action type, admin, date range

### 13. Role Management (`/admin/roles`)

- Super Admin, Admin, Support, Read-Only roles
- Permission-based access
- Role assignment to admin users

### 14. Feature Flags (`/admin/feature-flags`)

- Toggle features without deployment
- Percentage-based rollouts
- A/B testing support

---

## Platform Features

### Image Generation Studio (`/platform/studio`)

- Multi-model support with visual model selector
- Aspect ratio presets (1:1, 16:9, 9:16, 4:3, 3:4)
- Quality settings (Standard, HD, Ultra)
- Style presets (Vivid, Natural, Cinematic, Anime, etc.)
- Real-time generation with loading states
- Personal gallery with history
- Download in original format
- Prompt history and favorites
- Credit cost display per model

### Video Generation (`/platform/studio`)

- Text-to-video generation
- Image-to-video animation
- Duration controls (5s, 10s)
- Resolution settings
- Generation queue with status tracking
- Video preview and download

### AI Chat (`/platform/chat`)

- Multi-model conversation support
- Model switching mid-conversation
- Conversation history with search
- Voice input (speech-to-text)
- Voice output (text-to-speech)
- Code syntax highlighting
- Markdown rendering
- Conversation export
- Predefined prompt suggestions

### User Dashboard (`/platform`)

- Credit balance display
- Recent generations overview
- Usage statistics
- Quick action buttons

### Gallery (`/platform/gallery`)

- Personal generation gallery
- Grid and list views
- Download and share options
- Prompt copying

### History (`/platform/history`)

- Complete generation history
- Filter by type (image, video, chat)
- Search functionality
- Bulk actions

### Billing (`/platform/billing`)

- Current plan display
- Credit purchase with Stripe
- Transaction history
- Stripe Customer Portal link

### Settings (`/platform/settings`)

- Profile management
- API access toggle
- Theme preferences
- Notification settings

---

## AI Providers and Models

### Supported Providers

| Provider | Image | Video | Chat | Voice |
|----------|-------|-------|------|-------|
| OpenAI | DALL-E 3, DALL-E 2 | — | GPT-4, GPT-4o, GPT-4o-mini | Whisper, TTS |
| Google | Gemini Imagen 3 | — | Gemini 2.0 Flash, Gemini Pro | — |
| Kling AI | — | Text-to-Video, Image-to-Video | — | — |
| Anthropic | — | — | Claude 3, Claude 3.5 | — |
| Stability AI | SDXL, SD 3 | — | — | — |
| Mistral | — | — | Mistral Large, Mistral Medium | — |
| Cohere | — | — | Command, Command R+ | — |
| Replicate | Various | Various | Various | — |
| HuggingFace | Various | Various | Various | — |
| Custom | Configurable | Configurable | Configurable | Configurable |

### API Key Resolution Priority

The system resolves API keys in the following order:
1. **Model-specific API key** — Stored in `AiModel.apiKey` for granular control
2. **Default provider key** — Configured in `GlobalSettings` via Admin Panel
3. **Environment variable** — Fallback from `.env` file

This hierarchy allows maximum flexibility where specific models can use different API keys while maintaining sensible defaults.

### Model Configuration Options

Each model can be configured with:
- Credit cost per generation
- Rate limits (requests per minute/day)
- Token limits (input/output)
- Quality presets
- Supported formats and sizes
- Plan tier requirements
- Beta/Deprecated flags
- Custom API endpoints

---

## External Integrations

The platform supports AI chat through external messaging platforms. Users on these platforms automatically get accounts created and can interact with the AI using credits.

### WhatsApp Business API

- Automatic user provisioning based on phone number
- Credit-based billing for external users
- Conversation history synchronization
- Media message support
- Admin-configurable webhook endpoint

### Telegram Bot

- Bot token configuration via admin panel
- Automatic user creation from Telegram ID
- Command support
- Group chat compatibility
- Inline query responses

### Discord Bot

- Server and channel configuration
- Role-based access control
- Slash command support
- Embed message formatting
- Thread reply support

### Slack App

- Workspace integration setup
- Channel-specific responses
- Thread replies
- Interactive components
- Event subscriptions

### Custom Webhooks

For advanced integrations:
- Configurable inbound/outbound endpoints
- Authentication header support
- Payload transformation
- Response mapping
- Error handling

### Integration User Credits

External platform users receive a configurable credit allocation (default: 100 credits) that can be adjusted in Global Settings.

---

## Technology Stack

### Core Framework
- **Next.js 16.1.2** — App Router, React Server Components, Server Actions
- **React 19.2.3** — Latest concurrent features and optimizations
- **TypeScript** — Full type safety across the codebase

### Styling and UI
- **Tailwind CSS** — Utility-first CSS framework
- **Radix UI** — Accessible component primitives
- **Framer Motion 12** — Production-ready animations
- **Lucide React** — Comprehensive icon library
- **class-variance-authority** — Component variant management
- **next-themes** — Dark/light mode support

### Database and ORM
- **PostgreSQL** — Primary database
- **Prisma ORM 5.22** — Type-safe database access
- **Supabase** — Recommended managed PostgreSQL provider

### Authentication
- **Clerk** — Complete authentication solution
  - Email/password authentication
  - Social logins (Google, GitHub, etc.)
  - Multi-factor authentication
  - Session management
  - User metadata

### Payments
- **Stripe** — Payment processing
  - Credit card payments
  - Subscription management (optional)
  - Customer portal
  - Webhook handling
  - Invoice generation

### AI SDKs
- **OpenAI SDK 6.x** — GPT and DALL-E integration
- **Google GenAI** — Gemini integration
- **Custom HTTP clients** — Kling AI, Stability, others

### Utilities
- **date-fns** — Date manipulation
- **clsx** — Conditional class names
- **react-markdown** — Markdown rendering
- **jsonwebtoken** — JWT handling for integrations

### Development
- **ESLint** — Code linting
- **cross-env** — Cross-platform environment variables

### Deployment
- **Vercel** — Recommended hosting platform
- **Docker** — Containerization support
- **Node.js 20+** — Runtime requirement

---

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- PostgreSQL database (local, Supabase, or any provider)
- Clerk account (free tier available)
- Stripe account (for payments)
- At least one AI provider API key

### Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd ai-creative-studio
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**

```bash
cp .env.example .env
```

4. **Edit Environment Variables**

Open `.env` and configure the required variables:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# AI Providers (At least one required, can be set via Admin Panel)
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."

# Stripe (Optional, can be set via Admin Panel)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

5. **Initialize Database**

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Optional: Seed sample data
npx prisma db seed
```

6. **Start Development Server**

```bash
npm run dev
```

7. **Access the Application**

- **Landing Page**: http://localhost:3000
- **User Platform**: http://localhost:3000/platform
- **Admin Panel**: http://localhost:3000/admin

8. **Create Admin Account**

Sign up through the application, then manually add your user to the `AdminUser` table:

```sql
INSERT INTO "AdminUser" (id, "userId", email, role)
VALUES ('admin-id', 'your-clerk-user-id', 'your@email.com', 'SUPER_ADMIN');
```

Or use Prisma Studio:

```bash
npx prisma studio
```

---

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

The `vercel.json` configuration is pre-configured for optimal deployment.

### Docker

**Using Docker Compose (Recommended for self-hosting)**

```bash
# Start all services (PostgreSQL + App + Adminer)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

**Manual Docker Build**

```bash
# Build image
docker build -t ai-creative-studio .

# Run container
docker run -p 3000:3000 --env-file .env ai-creative-studio
```

### Self-Hosted (Node.js)

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "ai-studio" -- start
pm2 save
```

---

## Environment Configuration

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled connection) |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key |
| `CLERK_SECRET_KEY` | Clerk secret API key |

### Optional Variables (Configurable via Admin Panel)

| Variable | Admin Panel Location | Description |
|----------|---------------------|-------------|
| `OPENAI_API_KEY` | Settings > AI Keys | OpenAI API key |
| `GEMINI_API_KEY` | Settings > AI Keys | Google Gemini API key |
| `KLING_ACCESS_KEY` | Settings > AI Keys | Kling AI access key |
| `KLING_SECRET_KEY` | Settings > AI Keys | Kling AI secret key |
| `STRIPE_SECRET_KEY` | Settings > Payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Settings > Payments | Stripe public key |
| `STRIPE_WEBHOOK_SECRET` | Settings > Payments | Stripe webhook secret |

### Application Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | http://localhost:3000 | Application base URL |
| `NODE_ENV` | development | Environment mode |

---

## Database Schema

The Prisma schema contains 35+ models organized into logical domains:

### Core User Models
- `User` — Platform users with credits and authentication
- `AdminUser` — Admin accounts with role-based access
- `AdminCreditLog` — Credit adjustment audit trail

### AI System Models
- `AiModel` — AI model definitions with extensive configuration
- `ModelCreditCost` — Per-model credit pricing
- `GeneratedImage` — Generation history and outputs
- `AiUsageModeration` — Rate limiting and abuse prevention

### Chat System Models
- `ChatConversation` — Conversation threads
- `ChatMessage` — Individual messages with metadata
- `ChatIntegration` — External platform configurations
- `ChatPrompt` — Predefined conversation starters
- `VoiceSettings` — Text-to-speech configuration

### CMS Models
- `LandingFeature` — Landing page feature cards
- `GalleryItem` — Showcase gallery items
- `Testimonial` — Customer reviews
- `BlogPost` — Blog articles
- `LegalContent` — Legal documents (ToS, Privacy, etc.)
- `HelpCenterContent` — Help documentation

### Navigation and Footer
- `NavItem` — Navigation menu items
- `FooterLinkCategory` — Footer link sections
- `FooterLink` — Individual footer links
- `SocialLink` — Social media links
- `ContactInfo` — Contact information

### Settings and Configuration
- `GlobalSettings` — System-wide configuration
- `FeatureFlag` — Feature toggles
- `CookieSettings` — Cookie consent configuration
- `ContactSettings` — Contact form settings

### Billing and Analytics
- `PricingPlan` — Subscription/credit plans
- `Transaction` — Payment records
- `StripeBillingLog` — Stripe event logs
- `AnalyticsRecord` — Usage metrics
- `AuditLog` — Admin action logs
- `SystemHealthMetric` — Health monitoring

### Contact System
- `ContactSubmission` — Contact form submissions
- `ContactSettings` — Contact page configuration

### Integration Documentation
- `IntegrationDoc` — Admin-managed integration guides

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/docs` | API documentation |
| `GET` | `/api/footer` | Footer data |
| `GET` | `/api/legal/[type]` | Legal documents |

### Authenticated Endpoints (Clerk JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Image generation |
| `POST` | `/api/chat` | Chat completion |
| `POST` | `/api/voice` | Text-to-speech |
| `POST` | `/api/voice/transcribe` | Speech-to-text |
| `GET` | `/api/prompts` | Prompt suggestions |

### Admin Endpoints (Admin Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST/PUT/DELETE` | `/api/admin/users` | User management |
| `GET/POST/PUT/DELETE` | `/api/admin/models` | Model management |
| `GET/POST` | `/api/admin/settings` | Settings management |
| `GET` | `/api/admin/analytics` | Analytics data |

### Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/stripe` | Stripe payment webhooks |
| `POST` | `/api/integrations/whatsapp` | WhatsApp message handler |
| `POST` | `/api/integrations/telegram` | Telegram update handler |
| `POST` | `/api/integrations/discord` | Discord interaction handler |
| `POST` | `/api/integrations/slack` | Slack event handler |

### Cron Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cron/daily-credits` | Daily credit refill |
| `GET` | `/api/cron/analytics` | Analytics aggregation |

---

## Security

### Authentication
- Clerk-managed authentication with industry-standard security
- Social login support (Google, GitHub, Apple, etc.)
- Multi-factor authentication option
- Secure session management with automatic refresh

### Authorization
- Role-based access control (SUPER_ADMIN, ADMIN, SUPPORT, READ_ONLY)
- Permission-based actions for granular control
- Admin audit logging for compliance

### Data Protection
- API keys encrypted at rest in database
- Environment variable isolation
- Input sanitization on all endpoints
- SQL injection prevention through Prisma ORM
- XSS protection via React's built-in escaping

### Rate Limiting
- Per-user request limits (configurable per model)
- IP-based throttling
- Abuse flag system with automatic suspension
- Moderation queue for flagged users

### API Security
- JWT token validation for all authenticated endpoints
- Webhook signature verification (Stripe, etc.)
- CORS configuration
- Request size limits

---

## Project Structure

```
ai-creative-studio/
|
+-- app/                          # Next.js App Router
|   +-- (auth)/                   # Authentication pages
|   |   +-- sign-in/
|   |   +-- sign-up/
|   |
|   +-- admin/                    # Admin dashboard
|   |   +-- page.tsx              # Dashboard home
|   |   +-- settings/             # Global settings
|   |   +-- models/               # AI model management
|   |   +-- users/                # User management
|   |   +-- features/             # Landing features CMS
|   |   +-- gallery/              # Gallery management
|   |   +-- testimonials/         # Testimonials CMS
|   |   +-- blog/                 # Blog management
|   |   +-- plans/                # Pricing plans
|   |   +-- chat-integrations/    # External platform setup
|   |   +-- chat-prompts/         # Prompt management
|   |   +-- voice-settings/       # Voice configuration
|   |   +-- footer/               # Footer CMS
|   |   +-- navigation/           # Navigation CMS
|   |   +-- legal/                # Legal documents
|   |   +-- help-center/          # Help content
|   |   +-- analytics/            # Analytics dashboard
|   |   +-- audit-logs/           # Audit trail
|   |   +-- roles/                # Role management
|   |   +-- feature-flags/        # Feature toggles
|   |   +-- cookies/              # Cookie settings
|   |   +-- contact/              # Contact submissions
|   |   +-- health/               # System health
|   |   +-- moderation/           # User moderation
|   |   +-- model-costs/          # Credit cost config
|   |   +-- billing/              # Billing logs
|   |   +-- integrations/         # Integration docs
|   |   +-- about/                # About page CMS
|   |   +-- prompt-suggestions/   # Prompt suggestions
|   |
|   +-- platform/                 # User platform
|   |   +-- page.tsx              # Dashboard
|   |   +-- studio/               # Generation studio
|   |   +-- chat/                 # AI chat
|   |   +-- gallery/              # Personal gallery
|   |   +-- history/              # Generation history
|   |   +-- billing/              # Subscription/credits
|   |   +-- settings/             # User settings
|   |   +-- help/                 # Help center
|   |
|   +-- api/                      # API routes
|   |   +-- generate/             # Generation endpoint
|   |   +-- chat/                 # Chat endpoint
|   |   +-- voice/                # Voice endpoints
|   |   +-- webhooks/             # Webhook handlers
|   |   +-- integrations/         # Platform integrations
|   |   +-- admin/                # Admin API
|   |   +-- health/               # Health check
|   |   +-- cron/                 # Scheduled tasks
|   |
|   +-- components/               # React components
|   |   +-- landing/              # Landing page components
|   |   +-- ui/                   # UI primitives
|   |   +-- chat/                 # Chat components
|   |   +-- gallery/              # Gallery components
|   |
|   +-- hooks/                    # Custom React hooks
|   +-- globals.css               # Global styles
|   +-- layout.tsx                # Root layout
|   +-- page.tsx                  # Landing page
|
+-- lib/                          # Utilities and services
|   +-- ai-service.ts             # AI provider abstraction
|   +-- db.ts                     # Prisma client instance
|   +-- stripe.ts                 # Stripe utilities
|   +-- stripe-actions.ts         # Stripe server actions
|   +-- actions.ts                # General server actions
|   +-- admin-actions.ts          # Admin server actions
|   +-- contact-actions.ts        # Contact form actions
|   +-- config.ts                 # App configuration
|   +-- utils.ts                  # Utility functions
|   +-- schemas.ts                # Validation schemas
|   +-- seo.ts                    # SEO utilities
|   +-- crypto.ts                 # Encryption utilities
|   +-- demo-mode.ts              # Demo mode handling
|   +-- prompt-enhancer.ts        # Prompt enhancement
|   +-- integrations/             # External platform handlers
|       +-- message-handler.ts    # Unified message processing
|
+-- prisma/
|   +-- schema.prisma             # Database schema
|   +-- seed.ts                   # Seed data script
|
+-- scripts/                      # Utility scripts
|   +-- add-ai-models.ts          # Model seeding
|   +-- migrate-encrypt-api-keys.ts
|   +-- verify-env.ts
|   +-- update-landing.ts
|
+-- public/                       # Static assets
|
+-- docker-compose.yml            # Docker composition
+-- Dockerfile                    # Container definition
+-- vercel.json                   # Vercel configuration
+-- package.json                  # Dependencies
+-- tsconfig.json                 # TypeScript config
+-- tailwind.config.ts            # Tailwind config
+-- next.config.ts                # Next.js config
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

---

## Support

For technical support, customization requests, or enterprise licensing inquiries, please contact through the official support channels.

---

## License

Commercial License. All rights reserved.

This software is licensed for commercial use. You may:
- Deploy the platform for your own SaaS business
- Customize and white-label the application
- Use for unlimited projects

You may not:
- Redistribute the source code
- Resell the source code
- Sub-license to third parties

See LICENSE file for complete terms.

---

**AI Creative Studio** — Deploy your AI platform today. Manage it forever without writing code.


---
*Bu repo, projenin Public Vitrin sürümüdür. Hassas iş mantığı ve API anahtarları güvenlik nedeniyle gizlenmiştir.*