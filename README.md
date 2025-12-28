# Titli.work Local Development Setup

This is a local development version of the titly.social networking platform.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Backend Requirements

The app expects a backend API running at `http://localhost:8000`. You can modify this in the `.env` file:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

### API Endpoints Expected

The frontend expects these API endpoints:
- `POST /api/auth/send-otp` - Send OTP for phone verification
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities/:id/action` - Take action on opportunity
- `GET /api/requests` - List user's requests
- `GET /api/connections` - List connections
- `POST /api/connections/:id/approve` - Approve connection

## Project Structure

```
src/
├── App.js                    # Main app with routing & auth context
├── components/
│   ├── AuthModal.jsx         # Login/signup modal
│   ├── ui/                   # shadcn/ui components
│   └── dashboard/            # Dashboard page components
├── pages/
│   ├── LandingPage.jsx       # Home/landing page
│   └── DashboardLayout.jsx   # Dashboard layout with navigation
├── hooks/                    # Custom React hooks
└── lib/                      # Utility functions
```

## Features

- Phone number authentication with OTP
- Profile creation with skills and social links
- View and respond to opportunities
- Create networking requests
- Manage connections
- Telegram bot integration for messaging Taj

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- shadcn/ui components (Radix UI primitives)
- Axios for API calls
- Sonner for toast notifications
