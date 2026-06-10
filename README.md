# forge/mobile-client

Mobile app for the Forge developer platform. View project status and API usage alerts on the go.

## Stack

- **Framework:** Expo 51 + Expo Router
- **Language:** TypeScript 5
- **Storage:** expo-secure-store (tokens)
- **Navigation:** File-based routing via Expo Router

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android). Requires `backend-api` on port 3001 and `data-service` on port 3002.

To point at a non-localhost API, set `extra.backendUrl` and `extra.dataUrl` in `app.json`:
```json
{
  "expo": {
    "extra": {
      "backendUrl": "https://api.forge.example.com",
      "dataUrl": "https://data.forge.example.com"
    }
  }
}
```

## Screens

| Screen | Description |
|--------|-------------|
| Login (`/`) | Email + password sign in |
| Home tab | Project list with last-event metadata |
| Alerts tab | Recent API activity across all projects |
