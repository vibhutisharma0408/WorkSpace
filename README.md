# TeamSpace - Collaborative Workspace Platform

Getting started:

1. Create a `.env` file at the project root with your Firebase keys and Cloudinary (free) config:

```
VITE_FIREBASE_API_KEY=... 
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

2. Install and run:

```
npm install
npm run dev
```

Stack: React + Vite, TailwindCSS + DaisyUI, Firebase Auth, Firestore, React Router.

Files storage
- Default implementation stores files locally in the browser (localStorage) per workspace.
- Data is ephemeral per browser and limited by quota; suitable for demos.
- You can switch to Cloudinary or Firebase Storage later by updating `src/data/files.js` and env vars.

Cloudinary setup (free):
1. Create a Cloudinary account (free).
2. Settings → Upload → Upload presets → Add unsigned preset (enable, restrict to formats if desired).
3. Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` from your dashboard.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
