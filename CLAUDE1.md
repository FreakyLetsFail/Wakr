# Wakr - AI-Powered Wake-Up Call Service

## Project Overview
Wakr is a Next.js 15 application providing intelligent wake-up calls with AI-generated personalized messages, habit tracking, and smart audio optimization. The app focuses on GDPR compliance, cost optimization, and user productivity.

## Key Features
- **Intelligent Wake Calls**: AI-generated personalized wake-up messages with weather, appointments, and motivation
- **GitHub-Style Habit Tracking**: Visual progress tracking with commit-grid design
- **Smart Audio Caching**: Cost-optimized TTS through intelligent audio caching and reuse
- **GDPR Compliance**: End-to-end encryption, data export, and complete deletion on request
- **Roaming Optimization**: Automatic cost optimization through local phone numbers worldwide
- **Gamification**: Coin system, achievements, and rewards for user engagement

## Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **Database**: Supabase (PostgreSQL) with TypeScript types
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **Voice**: Twilio for voice calls
- **Push Notifications**: Web Push API
- **UI**: Tailwind CSS with Radix UI components
- **State Management**: Zustand
- **Queue Processing**: BullMQ with Redis
- **Validation**: Zod

## Database Schema
The application uses a comprehensive Supabase PostgreSQL schema with Row Level Security (RLS) including:
- User management with GDPR compliance
- Wake call configurations and logs
- Habit tracking and completions
- Gamification (coins, achievements, rewards)
- Audio caching for cost optimization
- Analytics and billing events
- GDPR data processing logs
- RLS policies for secure data access

## Available Scripts
- `npm run dev` - Start development server with Turbo
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure
```
/app - Next.js App Router structure
  /(auth) - Authentication pages (login, register)
  /(dashboard) - Main dashboard pages
  /(legal) - Legal pages (privacy, terms)
  /(marketing) - Marketing pages
  /api - API routes (auth, webhooks, cron jobs)
/components - Reusable UI components
/lib - Utility functions and configurations
  /supabase-db - Supabase database client and helpers
  /crypto - GDPR encryption utilities
  /analytics - Analytics tracking
/services - Business logic services
  /audio - Audio processing and TTS
  /integrations - External API integrations
/server - Server-side API routers and services
/hooks - Custom React hooks
/providers - React context providers
/stores - State management with Zustand
/types - TypeScript type definitions
/scripts - Database and utility scripts
/tests - Test files (e2e, integration, unit)
```

## Key Services
- **AudioCache**: Cost-effective TTS caching system
- **AudioComposer**: Dynamic audio composition for wake calls
- **TwilioTTS**: Twilio Text-to-Speech integration
- **Stripe**: Payment processing and subscription management
- **Analytics**: GDPR-compliant analytics tracking
- **Notifications**: Push notification service

## Environment Variables
The application requires various environment variables for:
- Supabase (database and authentication)
- Twilio (voice calls and TTS)
- Stripe (payments)
- External APIs (weather, calendar integrations)
- Encryption keys for GDPR compliance

## Development Status
**Current State**: Successfully migrated to Supabase! Full auth and database integration completed.

**Completed Migration**:
- ✅ Created comprehensive CLAUDE.md documentation
- ✅ Fixed TypeScript configuration
- ✅ Fixed Tailwind CSS configuration
- ✅ Fixed onboarding page TypeScript types
- ✅ **Migrated from NextAuth.js to Supabase Auth**
- ✅ **Migrated from Drizzle ORM to Supabase client**
- ✅ **Created RLS policies for secure data access**
- ✅ **Generated TypeScript types for Supabase schema**
- ✅ **Updated all API routes to use Supabase**

**Current Setup**:
- 🔐 **Authentication**: Supabase Auth with OAuth providers
- 🛡️ **Database**: Supabase PostgreSQL with Row Level Security
- 🔄 **API**: Server and client components use proper Supabase clients
- ✅ **Security**: RLS policies ensure users can only access their own data

**Next Steps for Production**:
1. Run `/scripts/enable-rls-fixed.sql` in Supabase SQL Editor
2. Configure OAuth providers in Supabase Auth settings  
3. Set up proper environment variables
4. Update Supabase auth settings (OTP expiry, password protection)
5. Test all authentication flows
6. Deploy and test RLS policies

## Development Workflow
1. Database changes: Update in Supabase Dashboard → regenerate types
2. Type checking: Run `npm run type-check`
3. Linting: Run `npm run lint`
4. Testing: Test auth flows and RLS policies

## Subscription Tiers
- **Trial**: 24-hour free trial with limited features
- **Basic**: €12.99/month - Daily wake calls, 5 custom calls, 10 habits
- **Pro**: €24.99/month - All features, AI personalization, unlimited habits

## GDPR Compliance
- All personal data is encrypted at rest
- Complete data export functionality
- Full data deletion on user request
- Consent tracking and management
- Data processing logging
- Privacy-by-design architecture

## Deployment
The application is designed for deployment on modern hosting platforms with support for:
- PostgreSQL database
- Redis for queue processing
- Environment variable configuration
- Webhook handling for Stripe and Twilio