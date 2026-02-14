# NeuroConnect Infrastructure Guide

## Live Site

**URL:** https://neuroconnect-app.netlify.app

---

## Firebase

**Project:** neuroconnect
**Project ID:** neuroconnect-c5a64
**Plan:** Spark (free)
**Region:** nam5 (US)

### Authentication
- **Provider:** Google Sign-In (enabled)
- **Support email:** harris.nicholas.c@gmail.com
- **Authorized domains:**
  - localhost
  - neuroconnect-c5a64.firebaseapp.com
  - neuroconnect-c5a64.web.app
  - neuroconnect-app.netlify.app

### Firestore Database
- **Mode:** Production
- **Security rules:** Users can read any user profile but only write their own (`request.auth.uid == userId`). Posts are publicly readable; any authenticated user can create or update; only the author or users with role `'aan'` can delete.
- **Composite index:** `posts` collection — `type` Ascending + `createdAt` Descending

### SDK Config

```
apiKey: AIzaSyA1AJ4nI4M708Nk8bHDTvBt-eaEzgneCO0
authDomain: neuroconnect-c5a64.firebaseapp.com
projectId: neuroconnect-c5a64
storageBucket: neuroconnect-c5a64.firebasestorage.app
messagingSenderId: 1072187994644
appId: 1:1072187994644:web:5456b744b1377daea06d01
```

---

## Netlify

**Project name:** neuroconnect-app
**Team:** harris-nicholas-c's team
**Source repo:** github.com/analogz/neuroconnect (main branch)
**Build command:** `npm run build`
**Publish directory:** `dist`
**Auto-deploy:** Yes — pushes to `main` trigger a new build automatically.

### Environment Variables (set in Netlify)

```
VITE_FIREBASE_API_KEY=AIzaSyA1AJ4nI4M708Nk8bHDTvBt-eaEzgneCO0
VITE_FIREBASE_AUTH_DOMAIN=neuroconnect-c5a64.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neuroconnect-c5a64
VITE_FIREBASE_STORAGE_BUCKET=neuroconnect-c5a64.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1072187994644
VITE_FIREBASE_APP_ID=1:1072187994644:web:5456b744b1377daea06d01
SECRETS_SCAN_SMART_DETECTION_ENABLED=false
```

The `VITE_` prefix exposes these to the client-side Vite build. `SECRETS_SCAN_SMART_DETECTION_ENABLED=false` disables Netlify's secret scanner, which otherwise flags the Firebase API key (which is designed to be public/client-side).

---

## Local Development

For local dev, create a `.env.local` file in the project root with the same `VITE_` variables above. The `localhost` domain is already authorized in Firebase Auth.

---

## Key Consoles

- **Firebase Console:** https://console.firebase.google.com/u/1/project/neuroconnect-c5a64
- **Netlify Dashboard:** https://app.netlify.com/projects/neuroconnect-app
- **GitHub Repo:** https://github.com/analogz/neuroconnect
