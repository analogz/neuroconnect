# NeuroConnect

A community platform for identifying and acting on neurologic care needs — with AAN oversight. Built with React + Vite, backed by Firebase, deployed on Netlify.

**Live site:** https://neuroconnect-app.netlify.app
**GitHub repo:** https://github.com/analogz/neuroconnect

## Architecture

```
src/
├── components/          # UI components
│   ├── common.jsx       # Avatar, badges, buttons
│   ├── Onboarding.jsx   # 4-step onboarding flow
│   ├── PostCard.jsx     # Feed post cards
│   ├── PostDetail.jsx   # Full post view + comments
│   ├── Sidebar.jsx      # Profile, AI suggestions, stats
│   └── NewPostModal.jsx # Create new post
├── config/
│   └── firebase.js      # Firebase initialization
├── data/
│   └── mockData.js      # Seed data, constants, post types
├── hooks/
│   ├── useAuth.js       # Authentication (Firebase or demo)
│   └── usePosts.js      # Post CRUD + real-time sync
├── styles/
│   └── index.css        # Global styles
├── App.jsx              # Main app shell
└── main.jsx             # Entry point
```

## Quick Start (Demo Mode)

The app runs fully in demo mode with mock data — no Firebase required.

```bash
npm install
npm run dev
```

Open http://localhost:5173 and walk through the onboarding.

## Firebase

**Console:** https://console.firebase.google.com/u/1/project/neuroconnect-c5a64
**Project ID:** `neuroconnect-c5a64`
**Plan:** Spark (free) · **Region:** nam5 (US)

### Authentication

- **Provider:** Google Sign-In
- **Authorized domains:** `localhost`, `neuroconnect-c5a64.firebaseapp.com`, `neuroconnect-c5a64.web.app`, `neuroconnect-app.netlify.app`

### Firestore Database

- **Mode:** Production
- **Security rules:** Defined in `firestore.rules`. Users can read any profile but only write their own (`request.auth.uid == userId`). Posts are publicly readable; any authenticated user can create or update; only the author or users with role `'aan'` can delete.
- **Composite index:** `posts` collection — `type` Ascending + `createdAt` Descending

### Environment Variables

For local development, copy `.env.example` to `.env.local` and fill in the Firebase values:

```bash
cp .env.example .env.local
```

The app reads these `VITE_FIREBASE_*` variables at build time via Vite. See `.env.example` for the full list. Without them, the app runs in demo mode with mock data.

## Netlify

**Dashboard:** https://app.netlify.com/projects/neuroconnect-app
**Site URL:** https://neuroconnect-app.netlify.app

- **Source:** `github.com/analogz/neuroconnect` (main branch)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Auto-deploy:** Pushes to `main` trigger a new build automatically.
- **Environment variables:** All `VITE_FIREBASE_*` variables are set in the Netlify dashboard under **Site settings → Environment variables**.

## Features

- **Onboarding** — 4-step flow capturing name, role (Community / AAN), conditions of interest, and location
- **AI-personalized feed** — posts scored by condition match, region, priority, and engagement
- **Post types** — Need, Initiative, Resource, Discussion with color-coded badges
- **AAN inline oversight** — verified members can Endorse and Flag Priority on any post
- **Comments** — threaded discussion on each post
- **AI suggestions sidebar** — personalized recommendations based on profile
- **Community pulse** — live stats on priority needs and trending conditions
- **Demo mode** — works fully without Firebase for testing and presentations

## Tech Stack

- **React 18** + **Vite** — fast dev, optimized builds
- **Firebase Auth** — Google sign-in
- **Cloud Firestore** — real-time database
- **Netlify** — CI/CD and hosting
- **Manrope + Cormorant Garamond** — typography
