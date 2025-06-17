# Supabase Auth Configuration

## OAuth Providers Setup

To configure OAuth providers in your Supabase project, follow these steps:

### 1. Google OAuth
1. Go to Supabase Dashboard → Authentication → Settings → Auth Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: `your-google-client-id.apps.googleusercontent.com`
   - **Client Secret**: `your-google-client-secret`
4. Set Authorized redirect URLs:
   - Development: `https://your-project-id.supabase.co/auth/v1/callback`
   - Production: `https://your-domain.com/auth/v1/callback`

### 2. GitHub OAuth
1. Enable GitHub provider in Supabase
2. Add your GitHub OAuth credentials:
   - **Client ID**: `your-github-client-id`
   - **Client Secret**: `your-github-client-secret`
3. Update GitHub OAuth App settings:
   - Homepage URL: `http://localhost:3000` (dev) / `https://your-domain.com` (prod)
   - Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`

### 3. Microsoft OAuth
1. Enable Microsoft provider in Supabase
2. Add your Microsoft OAuth credentials:
   - **Client ID**: `your-microsoft-client-id`
   - **Client Secret**: `your-microsoft-client-secret`
3. Update Azure AD app registration:
   - Redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

### 4. Email Configuration
1. Go to Authentication → Settings → SMTP Settings
2. Configure email templates for:
   - Confirmation emails
   - Password reset emails
   - Email change confirmations

### 5. Site URL Configuration
Set the Site URL in Authentication → Settings:
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### 6. Additional Redirect URLs
Add these URLs to the Additional Redirect URLs section:
- `http://localhost:3000/auth/callback`
- `https://your-domain.com/auth/callback` (for production)

## Authentication Flow

The authentication flow will work as follows:

1. User clicks OAuth provider button
2. Redirected to provider's auth page
3. Provider redirects back to Supabase callback URL
4. Supabase handles the callback and creates/updates user
5. User is redirected to your app with session cookies set
6. Middleware validates session and allows access

## Email Templates

Customize the email templates in Authentication → Settings → Email Templates:

- **Confirm signup**: Welcome message with verification link
- **Reset password**: Password reset instructions
- **Change email address**: Email change confirmation

## RLS Policies

Make sure to set up Row Level Security policies for your user data tables to ensure proper access control.