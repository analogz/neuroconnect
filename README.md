# NeuroConnect

A community platform for identifying and acting on neurologic care needs — with AAN oversight. Built with React + Vite, backed by Firebase, deployed on Netlify.

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

## Firebase Setup (Production)

### 1. Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it (e.g., `neuroconnect`)
3. Disable Google Analytics (optional for now)
4. Click **Create project**

### 2. Enable Authentication

1. In the Firebase console, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your domain to **Authorized domains** (e.g., `your-site.netlify.app`)

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select a region close to your users
4. After creation, go to the **Rules** tab and paste the contents of `firestore.rules`

### 4. Get Your Config

1. Go to **Project settings** → **General** → **Your apps**
2. Click the web icon (`</>`) to register a web app
3. Copy the config values

### 5. Set Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Firebase values:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=neuroconnect-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neuroconnect-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=neuroconnect-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Run again — the app will now use Firebase auth and Firestore:

```bash
npm run dev
```

## Deploy to Netlify

### Option A: Git-based (Recommended)

1. Push this repo to GitHub
2. Go to https://app.netlify.com → **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in **Site settings** → **Environment variables**:
   - Add all `VITE_FIREBASE_*` variables from your `.env.local`
6. Click **Deploy site**

Every push to `main` will auto-deploy.

### Option B: Manual Deploy

```bash
npm run build
```

Drag the `dist/` folder to https://app.netlify.com/drop

### Custom Domain

In Netlify: **Domain management** → **Add custom domain** → follow DNS instructions.

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
