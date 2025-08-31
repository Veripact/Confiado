# Privy Setup for Confiado

## Current Problem
403 Error "Login with Google not allowed" - indicates incorrect OAuth configuration.

## Step-by-Step Solution

### 1. Configure Privy Dashboard
1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create a new application or use the existing one
3. In **Settings > Login Methods**, enable Google OAuth
4. Configure the **Redirect URIs**:
   - `http://localhost:3000` (development)
   - Your production domain
5. Copy your **App ID** from the dashboard

### 2. Create Environment Variables
Create a `.env.local` file in the project root:

```bash
# Copy .env.example and rename it to .env.local
cp .env.example .env.local
```

Edit `.env.local` with your real values:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_real_app_id_here
NEXT_PUBLIC_APP_NAME=Confiado
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Verify OAuth Configuration in Google
In the Privy dashboard, ensure that:
- Google OAuth is enabled
- The redirect URIs include `http://localhost:3000`
- The domain is verified

### 4. Restart Server
```bash
pnpm dev
```

## Alternative: Temporarily Disable Google
If you need to continue developing, you can temporarily disable Google OAuth by editing `contexts/PrivyContext.tsx`:

```typescript
loginMethods: ['email', 'wallet'], // Remove 'google', 'twitter'
```

## Important Notes
- The current hardcoded App ID is for testing and does not have Google OAuth configured
- You need your own Privy App ID with OAuth configured
- The `.env.local` file is in `.gitignore` for security

