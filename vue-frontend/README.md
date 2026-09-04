# Collaborate Vue frontend

This is a browser-based Vue 3 version of the Expo/React Native application. It is self-contained and does not alter the Expo project. It was generated using the Codex AI agent, and was manually reviewed by Ethan James for functionality verification.

## Run it

```bash
cd UI/CollaborateFrontend/vue-frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the REST API address. The default points to the application's Vagrant API VM (`http://192.168.56.11:3000`). The API must permit the Vite development origin through CORS.

## Included flows

- Sign up and log in (the active username is stored in browser local storage)
- Browse people and create meeting requests
- View and accept incoming meeting requests
- View connections and exchange messages, refreshing messages every three seconds
