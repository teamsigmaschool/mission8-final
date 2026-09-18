# Mission 8 — Names API (Final / Hosted Version)

This is the completed API — the one you host and share with the whole
class. Every student POSTs their name here (not to each other) using
Postman.

## Routes

| Method | Route          | Description                                   |
|--------|----------------|------------------------------------------------|
| GET    | `/`            | Health check                                   |
| GET    | `/names`       | Returns the full list of names                 |
| POST   | `/names`       | Adds a name — rejects duplicates and missing names |
| DELETE | `/names/:name` | Removes a name from the list                   |

## Run locally

```bash
npm install
npm start
```

## Deploying (e.g. Render, Railway)

- Build command: `npm install`
- Start command: `npm start`
- The server reads `process.env.PORT`, so it works with whatever port
  the host assigns — no changes needed.

## Notes

- Storage is in-memory (`let names = []`), same as the starter. That
  means the list resets if the server restarts or redeploys — worth
  knowing if you plan to keep it running across multiple sessions.
- This file is also the answer key for the challenge slides (duplicate
  blocking, timestamps, DELETE endpoint) — safe to share with students
  at the end of the mission.
