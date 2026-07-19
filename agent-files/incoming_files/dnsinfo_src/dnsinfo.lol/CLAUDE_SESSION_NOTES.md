# Claude Session Notes - DNS Intel Project
**Last Updated:** January 30, 2026

## Project Overview
DNS Intel (dnsinfo.lol) - A DNS intelligence API service with:
- Express.js/TypeScript backend
- Static HTML frontend with vanilla JS
- SQLite database for users, sessions, subscriptions
- OAuth authentication (Google, Twitter)
- Stripe billing integration

## Recent Work Completed

### 1. Legal Pages Created
- `/privacy` - Privacy Policy page
- `/terms` - Terms of Service page
- `/contact` - Contact Us page
- All pages have matching design with particle animations
- Routes added in `src/index.ts`

### 2. Footer Updates
- All HTML pages updated with 2026 copyright
- Footer links added: Home, API Docs, Pricing, Terms, Privacy, Contact

### 3. Session/Cookie Fixes (CRITICAL)
**Problem:** Users could log in via Google OAuth but session wasn't persisting across page navigation.

**Root Causes & Fixes:**
- `dotenv` wasn't loading `.env` properly - Fixed with explicit path: `dotenv.config({ path: path.resolve(__dirname, '../.env') })`
- Cookie `secure: true` was blocking cookies over HTTP - **Temporarily set to `secure: false`**
- Added `proxy: true` to session config for reverse proxy support
- Added explicit `req.session.save()` in OAuth callbacks before redirect
- Session config in `src/index.ts`:
  ```typescript
  cookie: {
    secure: false,  // TODO: Re-enable when HTTPS proxy headers configured
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax',
    path: '/'
  }
  ```

### 4. Twitter OAuth Updated to 2.0
- Changed from `passport-twitter` (OAuth 1.0) to `@superfaceai/passport-twitter-oauth2`
- Updated in `src/config/passport.ts`
- `.env` has new Twitter OAuth 2.0 credentials (CLIENT_ID and CLIENT_SECRET)

### 5. Auth Check Scripts Added to All Pages
**Problem:** Logged-in users saw "Login" in nav instead of "Dashboard" when navigating to other pages.

**Solution:** Added JavaScript auth check to all public HTML pages that:
- Calls `/auth/me` on page load
- If authenticated: updates nav "Login" link to "Dashboard"
- Files updated: `index.html`, `pricing.html`, `terms.html`, `privacy.html`, `contact.html`, `coming-soon.html`, `login.html`

### 6. Pricing Page Redirect
- Authenticated users visiting `/pricing` are automatically redirected to `/dashboard`
- All subscription management happens from dashboard

## Current Status
- **Google OAuth:** Working
- **Twitter OAuth:** Updated to 2.0, needs testing
- **Session persistence:** Working across page navigation
- **Navigation:** Home/Pricing links work correctly for authenticated users

## TODO / Remaining Work
1. **Test Twitter OAuth 2.0** - Verify login works with new OAuth 2.0 implementation
2. **Test subscription flow** - Full trial/paid subscription flow from dashboard
3. **Re-enable secure cookies** - Once reverse proxy is configured to pass proper HTTPS headers, change `secure: false` back to `secure: true` in `src/index.ts`
4. **Production deployment** - Verify everything works in production environment

## Key Files
- `src/index.ts` - Main server, session config
- `src/routes/auth.ts` - Auth routes, OAuth callbacks
- `src/config/passport.ts` - Passport strategies (Google, Twitter, Local)
- `public/dashboard.html` - User dashboard
- `public/login.html` - Login/register page
- `.env` - Environment variables (OAuth credentials, session secret)

## Debug Endpoints
- `GET /auth/session-check` - Returns session status (hasSession, isAuthenticated, hasUser)
- `GET /auth/me` - Returns current user data if authenticated

## Build & Run
```bash
npm run build    # Compile TypeScript
npm start        # Run server (or use pm2/forever in production)
```

Server runs on port 3000 by default (configurable via PORT env var).
