# LearnMap

LearnMap is a lightweight MERN application that helps users generate, view, and save learning roadmaps. It integrates with Google GenAI (Gemini) to generate structured roadmap JSON, stores roadmaps in MongoDB, and exposes a simple API consumed by a React + React-Bootstrap frontend.

Core ideas:
- Generate-guided study roadmaps using an LLM (Gemini).
- Save and manage user-specific roadmaps.
- Responsive UI built with React and React-Bootstrap.

## Features
- Authenticate users (signup / login).
- Generate a roadmap using the Gemini API.
- Save generated roadmaps to MongoDB.
- List all saved roadmaps for the current user in a responsive grid.
- View a detailed roadmap with modules, lessons, and resources.
- Simple, token-based auth (JWT).

## Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JSON Web Tokens (JWT)
- AI: @google/genai (Gemini API)
- Frontend: React, React Router, React-Bootstrap, Axios
- Dev environment: nodemon (optional)

## Repository layout
- SERVER/ — Express server, controllers, models, routes, AI integration
- CLIENT/LearnMap/ — React app (Vite or CRA), components, pages
- README.md — this file

## Environment variables

Server (.env in SERVER)
- DB_URI — MongoDB connection string
- JWT_SECRET_KEY — secret used to sign JWTs
- GEMINI_API_KEY — API key for Google GenAI

Client (.env in CLIENT)
- VITE_API_BASE_URL — API base URL (example: `http://localhost:3000/api` or production URL)

Example CLIENT/.env:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Setup & run (development)

Prerequisites: Node.js, npm, MongoDB

1. Install & configure server
```bash
# from repository root
cd SERVER
npm install

# create .env with DB_URI, JWT_SECRET_KEY, GEMINI_API_KEY
# then start server
node index.js
# or with nodemon
nodemon index.js
```

2. Install & run client
```bash
cd CLIENT/LearnMap
npm install
npm run dev   # or npm start depending on scripts
```

Open the app (frontend) in the browser (default Vite port or as configured). The client expects the API base URL in VITE_API_BASE_URL.

## API (important endpoints)

- Authentication
  - POST /api/user/signup
    - body: { name, email, password }
  - POST /api/user/login
    - body: { email, password }
    - response: { token }

- Roadmap
  - GET /api/roadmap/allroadmap
    - headers: Authorization: <token>
    - returns: array of roadmap summaries for the authenticated user
  - GET /api/roadmap/get-roadmap/:id
    - headers: Authorization: <token>
    - returns: full roadmap document
  - POST /api/save
    - headers: Authorization: <token>
    - body: full roadmap object (saved to DB)

Example curl (get all roadmaps):
```bash
curl -H "Authorization: <JWT_TOKEN>" http://localhost:3000/api/roadmap/allroadmap
```

Example curl (get single roadmap):
```bash
curl -H "Authorization: <JWT_TOKEN>" http://localhost:3000/api/roadmap/get-roadmap/68fed2e585a9228462be18cf
```

## Frontend notes
- The client stores JWT in localStorage (key: `token`). Pass this token in the `Authorization` header when calling protected endpoints.
- UI components use React-Bootstrap; the app includes responsive grid and detail screens for roadmaps.

## CORS
For local development the server enables CORS (origin: '*') — this is convenient but not recommended for production when using credentials. For production set a specific origin and enable credentials only if required.

## Deployment
- Set environment variables on your host (DB_URI, JWT_SECRET_KEY, GEMINI_API_KEY, VITE_API_BASE_URL).
- Build the client and serve statically or deploy separately (e.g., Vercel for client, Heroku / DigitalOcean / VPS for server).
- Ensure CORS and allowed origins are configured correctly.

## Contributing
- Create issues for bugs or feature requests.
- Open PRs with clear descriptions and tests where applicable.

## License
MIT
