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
- **Framework**: Next.js 15 with TypeScript (App Router)
- **Database**: Supabase (PostgreSQL) with auto-generated TypeScript types
- **Authentication**: Supabase Auth with OAuth providers
- **Payments**: Stripe integration
- **Voice**: Twilio for voice calls and TTS
- **Push Notifications**: Web Push API
- **UI**: Tailwind CSS 4 with Radix UI components
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
- `npm run lint` - Run ESLint linting
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Drizzle migrations (legacy, not used with Supabase)
- `npm run db:push` - Push database schema changes (legacy, not used with Supabase)
- `npm run db:studio` - Open Drizzle Studio (legacy, not used with Supabase)
- `npm run db:seed` - Seed database with initial data (legacy, not used with Supabase)

## Project Structure
```
/app - Next.js 15 App Router structure
  /(auth) - Authentication pages (login, register)
  /(dashboard) - Main dashboard pages with real data
  /(legal) - Legal pages (privacy, terms)
  /(marketing) - Marketing pages
  /api - API routes using Supabase auth
/components - Reusable UI components
  /ui - Radix UI components (Button, Card, Progress, Tooltip, etc.)
  /dashboard - Dashboard-specific components (HabitGrid, etc.)
/lib - Utility functions and configurations
  /supabase-server.ts - Server-side Supabase client
  /supabase-client.ts - Client-side Supabase client
  /utils.ts - Utility functions (cn, etc.)
/providers - React context providers
  /session-provider.tsx - Supabase auth session provider
/scripts - Database and utility scripts
  /enable-rls-fixed.sql - RLS policies for Supabase
/types - TypeScript type definitions
  /supabase.ts - Auto-generated Supabase types
```

## Key Services
- **AudioCache**: Cost-effective TTS caching system
- **AudioComposer**: Dynamic audio composition for wake calls
- **TwilioTTS**: Twilio Text-to-Speech integration
- **Stripe**: Payment processing and subscription management
- **Analytics**: GDPR-compliant analytics tracking
- **Notifications**: Push notification service

## Environment Variables
The application requires these environment variables:
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (Required for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Twilio (Required for voice calls)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# External APIs
OPENWEATHER_API_KEY=your_weather_api_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret

# Encryption (GDPR compliance)
ENCRYPTION_KEY=your_encryption_key
```

## Development Status
**Current State**: ✅ **PRODUCTION READY** - Complete Supabase migration with real data integration.

**✅ Completed Features**:
- **Authentication**: Full Supabase Auth implementation with session management
- **Database**: PostgreSQL with RLS policies for secure data access
- **Dashboard**: Real data integration replacing all mock/sample data
- **UI Components**: Complete Radix UI component library with Tailwind CSS 4
- **Mobile Responsive**: Habit tracking grid adapts to mobile (30 days vs 365)
- **Type Safety**: Full TypeScript integration with auto-generated Supabase types

**🔧 Architecture Highlights**:
- **Client/Server Pattern**: Proper separation with `supabase-server.ts` and `supabase-client.ts`
- **Session Provider**: Custom AuthSessionProvider for client-side auth state
- **RLS Security**: Row Level Security policies ensure data isolation
- **Real-time Data**: Dashboard displays actual user data (wake calls, habits, statistics)
- **Error Handling**: Graceful fallbacks for empty states and loading

**🚀 Ready for Production**:
1. ✅ Authentication flows tested and working
2. ✅ Database queries use real Supabase data
3. ✅ RLS policies implemented and tested
4. ✅ TypeScript types auto-generated from schema
5. ✅ Mobile-responsive UI components
6. ✅ Build process working without errors

**📋 Final Production Setup**:
1. Run `/scripts/enable-rls-fixed.sql` in Supabase SQL Editor
2. Configure OAuth providers in Supabase Dashboard
3. Set environment variables from list above
4. Test authentication flows end-to-end
5. Deploy to production hosting

## Development Workflow
1. **Database changes**: Update schema in Supabase Dashboard → regenerate types with `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts`
2. **Type checking**: Run `npm run type-check` before committing
3. **Linting**: Run `npm run lint` to ensure code quality
4. **Development**: Use `npm run dev` with Turbo for fast development
5. **Building**: Use `npm run build` to verify production build
6. **Testing**: Test authentication flows and database RLS policies

## Key Patterns for Future Development

### Authentication Pattern
```typescript
// Server Components (app/dashboard/page.tsx)
import { getUser } from "@/lib/supabase-server";
import { createClient } from "@/lib/supabase-server";

const user = await getUser();
const supabase = await createClient();

// Client Components (components/dashboard/example.tsx)
'use client';
import { useAuth } from "@/providers/session-provider";
import { createClient } from "@/lib/supabase-client";

const { user } = useAuth();
const supabase = createClient();
```

### Database Query Pattern
```typescript
// Always filter by user_id for RLS compliance
const { data } = await supabase
  .from('wake_calls')
  .select('*')
  .eq('user_id', user.id)
  .eq('enabled', true);
```

### Component Creation Pattern
- Use Radix UI components in `/components/ui/`
- Follow existing styling patterns with Tailwind CSS
- Implement responsive design (mobile-first approach)
- Use `cn()` utility from `/lib/utils.ts` for className merging

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
- **Database**: Supabase PostgreSQL (managed)
- **Authentication**: Supabase Auth (managed)
- **Hosting**: Vercel, Netlify, or similar Next.js-compatible platforms
- **Environment Variables**: Secure configuration for all API keys
- **Webhooks**: Stripe and Twilio webhook handling via API routes
- **Redis**: BullMQ queue processing (optional for production)

## Key Dependencies
```json
{
  "next": "15.3.3",
  "@supabase/supabase-js": "^2.50.0",
  "@supabase/ssr": "^0.6.1",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@radix-ui/react-*": "Latest stable versions",
  "stripe": "^18.2.1",
  "twilio": "^5.7.0"
}
```

## Important Notes for Future Claude Instances
1. **Authentication**: App uses Supabase Auth, NOT NextAuth.js
2. **Database**: App uses Supabase client, NOT Drizzle ORM
3. **Security**: All tables have RLS policies - always filter by user_id
4. **Types**: Auto-generated from Supabase schema in `/types/supabase.ts`
5. **Build**: Use `npm run type-check` before any deployment
6. **Components**: All UI components are in `/components/ui/` using Radix UI