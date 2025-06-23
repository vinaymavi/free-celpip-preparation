# Routing Implementation

This document describes the routing implementation added to the CELPIP Preparation application.

## Overview

The application now uses React Router v7 for client-side routing, providing a better user experience with proper URL navigation, browser history support, and direct access to specific sections via URLs.

## Key Changes

### 1. Dependencies Added

- `react-router-dom` - Main routing library
- `@types/react-router-dom` - TypeScript type definitions

### 2. Files Modified

#### `src/main.tsx`

- Updated to use `RouterProvider` instead of directly rendering the App component
- Imports router configuration from `src/router/index.tsx`

#### `src/router/index.tsx` (New File)

- Defines the application routes using `createBrowserRouter`
- Maps URL paths to React components
- Includes redirect from root path to `/dashboard`

#### `src/App.tsx`

- Refactored to use React Router's `Outlet` component
- Uses `useLocation` and `useNavigate` hooks for route management
- Removed manual section switching logic

#### `src/components/Layout.tsx`

- Updated navigation to use React Router's `Link` components
- Removed dependency on `onSectionChange` callback (now optional for backward compatibility)
- Both desktop and mobile navigation now use proper routing

#### `src/components/Dashboard.tsx`

- Added `useNavigate` hook support
- Made `onSectionSelect` prop optional
- Falls back to navigation when callback is not provided

## Route Structure

```
/                    → Redirects to /dashboard
/dashboard          → Dashboard component
/reading            → ReadingSection component
/writing            → WritingSection component
/speaking           → SpeakingSection component
/listening          → ListeningSection component
```

## Features

### URL Navigation

- Users can now navigate directly to specific sections via URLs
- Browser back/forward buttons work correctly
- URLs are bookmarkable and shareable

### Navigation Components

- Desktop navigation uses `Link` components for proper routing
- Mobile navigation (hamburger menu) also uses routing
- Active section highlighting based on current URL

### Backward Compatibility

- Components that previously used callback-based navigation will continue to work
- Dashboard component supports both routing and callback patterns

## Usage

### Development Server

```bash
yarn dev
```

### Building for Production

```bash
yarn build
```

## Technical Notes

### Router Configuration

The router is configured as a Browser Router (using HTML5 history API) which requires proper server configuration for production deployment to handle client-side routes.

### State Management

- Section state is now managed by the URL rather than React state
- Current section is determined from `location.pathname`

### Error Handling

- Invalid routes will fall back to the dashboard
- No special 404 handling implemented (falls back to root redirect)

## Future Enhancements

Potential improvements for the routing system:

1. **Nested Routes**: Add sub-routes for different practice exercises within each section
2. **Route Guards**: Add authentication/authorization guards for protected routes
3. **404 Page**: Implement a proper 404 page for invalid routes
4. **Route Parameters**: Add support for dynamic routes (e.g., `/reading/:exerciseId`)
5. **Route Transitions**: Add page transition animations between routes
6. **SEO**: Add proper meta tags and titles for each route

## Server Configuration

For production deployment, ensure your web server is configured to serve `index.html` for all routes to support client-side routing. For example:

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Apache

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
