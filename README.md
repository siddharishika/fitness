# Fitness Social

A full-stack fitness community app where users browse workout videos, training programs, and recipes. Coaches can upload content; all users can like items, leave reviews, and rate content (except their own). Includes account management, session auth, and ImageKit-backed media storage.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Client** | React 18, Vite, React Router, Bootstrap, Redux Toolkit, Axios, ImageKit React |
| **Server** | Node.js, Express, MongoDB / Mongoose, Passport (local), express-session |
| **Media** | ImageKit (videos, thumbnails, profile pictures, recipe photos) |

## Project structure

```
fitness/
├── client/                 # React SPA (Vite)
│   ├── src/
│   │   ├── Components/     # UI by feature (Auth, Video, Program, Recipe, MyFitnessJourney, Utils)
│   │   ├── App.jsx         # Routes
│   │   └── main.jsx
│   └── dist/               # Production build (served by Express)
├── server/
│   ├── apis/               # Route modules
│   ├── models/             # User, Video, Program, Recipe
│   ├── middleware.js       # Auth, coach, ownership guards
│   ├── utils/              # ImageKit, account deletion, cleanup
│   ├── scripts/
│   │   └── dryRunRoutes.js # API smoke test (no destructive writes)
│   └── app.js              # Express entry
└── README.md
```

## Features

- **Workout videos** — Browse all videos, filter by tags, watch, like, review, and rate.
- **Programs** — Multi-day schedules built from a coach’s videos; browse, show, like, review, rate.
- **Recipes** — Ingredients, steps, tags, photos; browse, show, like, review, rate.
- **Roles** — `user` (browse, like, review, rate) and `coach` (upload/edit/delete own content).
- **My Journey** — Liked videos/programs/recipes; coaches see My Videos, My Programs, My Recipes.
- **Account** — Sign up (profile picture required), login, edit profile, become a coach, delete account.
- **Auth UX** — Login prompts/modals, route toasts (404, require auth, require coach), 401 handling on login.
- **ImageKit cleanup** — Old files removed on video/recipe edit or delete; full cleanup on account deletion.
- **Reviews** — Comments show reviewer profile pictures (`ReviewComment` on show pages).

## Prerequisites

- Node.js 18+ (tested on Node 26)
- MongoDB database (local or Atlas)
- [ImageKit](https://imagekit.io/) account (public key, private key, URL endpoint)

## Environment variables

Create `.env` files from the templates below. **Do not commit real secrets.**

### `server/.env`

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=8080
SESSION_SECRET=your-long-random-secret
NODE_ENV=development

# ImageKit (same names used on server)
publicKey=your_imagekit_public_key
privateKey=your_imagekit_private_key
urlEndpoint=https://ik.imagekit.io/your_id
```

### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:8080

# ImageKit (Vite exposes these to the client)
publicKey=your_imagekit_public_key
urlEndpoint=https://ik.imagekit.io/your_id
```

In production, the client often uses `window.location.origin` when `VITE_API_BASE_URL` is unset, because Express serves the built SPA from the same host.

## Getting started (development)

Use **two terminals**.

### 1. Server

```bash
cd fitness/server
npm install
npm start
```

Server runs at **http://localhost:8080** by default.

### 2. Client

```bash
cd fitness/client
npm install
npm run dev
```

Client runs at **http://localhost:5173** with API calls to `VITE_API_BASE_URL`.

CORS allows `http://localhost:5173` in development.

## Production build

```bash
cd fitness/client
npm run build
```

Output goes to `client/dist/`. The server serves it and falls back to `index.html` for client routes.

```bash
cd fitness/server
npm start
```

`heroku-postbuild` in `server/package.json` installs the client and runs `npm run build` for deploy platforms.

## Frontend routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home (videos, programs, recipes previews) |
| `/workoutvideos`, `/workoutvideos/tags`, `/workoutvideos/tag/:tag` | Public | Video list & tags |
| `/show` | Public | Video detail (uses navigation state / refetch) |
| `/allprograms`, `/allprograms/tags`, `/allprograms/tag/:tag` | Public | Programs |
| `/showprogram` | Public | Program detail |
| `/allrecipes`, `/allrecipes/tags`, `/allrecipes/tag/:tag` | Public | Recipes |
| `/showrecipe` | Public | Recipe detail |
| `/login`, `/signup` | Public | Auth |
| `/myjourney` | Logged in | Dashboard |
| `/edituser` | Logged in | Edit account |
| `/likedvideos`, `/likedprograms`, `/likedrecipes` | Logged in | Liked content |
| `/myvideos`, `/myprograms`, `/myrecipes` | Coach | Own content |
| `/video/add`, `/video/edit` | Coach | Upload / edit video |
| `/program/add`, `/program/edit` | Coach | Add / edit program |
| `/recipe/add`, `/recipe/edit` | Coach | Add / edit recipe |
| `*` | Public | 404 + toast |

Protected routes use `RequireAuth` and `RequireCoach` where needed.

## API routes (summary)

All routes are mounted at the server root (no `/api` prefix).

### Auth (`authRoute.js`)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/signup` | — | Multipart; profile picture required |
| POST | `/login` | — | Body: `{ data: { username, password } }` |
| GET | `/logout` | — | Ends session |
| GET | `/me` | — | `{ user: null }` or user fields |
| PATCH | `/edituser` | Logged in | Profile / password / role |
| DELETE | `/deleteaccount` | Logged in | Deletes user data + ImageKit assets |

### Videos (`videoRoutes.js`, `uploadRoute.js`)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/allvideos`, `/allvideos/:tag` | — | List / filter |
| GET | `/show/:id` | — | Single video |
| GET | `/test` | — | Health check |
| POST | `/add` | Coach | Upload video + thumbnail |
| PATCH | `/edit/:id`, `/edit/f`, `/edit/imgf/:id` | Coach + owner | Metadata / file / thumbnail |
| DELETE | `/delete/:id` | Coach + owner | Deletes ImageKit files |
| POST | `/changevideolike` | Logged in | Toggle like |
| GET | `/getall` | Logged in | Coach’s videos |
| PATCH | `/addrating/:id` | Logged in | Not author / not coach |
| POST | `/video/addreview/:id` | Logged in | Not author |

### Programs (`programRoutes.js`)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/allprograms`, `/allprograms/:tag` | — | List / filter |
| GET | `/showprogram/:id` | — | Program + schedule videos |
| POST | `/addprogram` | Coach | Create |
| PATCH | `/editprogram` | Coach + owner | Update |
| POST | `/deleteprogram/:id` | Coach + owner | Delete |
| POST | `/changeprogramlike` | Logged in | Toggle like |
| GET | `/getlikedprograms`, `/getmyprograms` | Logged in | |
| PATCH | `/program/addrating/:id` | Logged in | |
| POST | `/program/addreview/:id` | Logged in | Not author |

### Recipes (`recipeRoutes.js`)

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/allrecipes`, `/allrecipes/:tag` | — | List / filter |
| GET | `/showrecipe/:id` | — | Single recipe |
| POST | `/addrecipe`, `/edit` | Coach | Create / update |
| DELETE | `/deleterecipe/:id` | Coach + owner | Removes ImageKit photo |
| POST | `/changerecipelike` | Logged in | |
| GET | `/getlikedrecipes`, `/getmyrecipes` | Logged in | |
| PATCH | `/recipe/addrating/:id` | Logged in | Not owner |
| POST | `/recipe/addreview/:id` | Logged in | Not owner |

### My Journey (`myJourney.js`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/getuser` | Logged in |
| GET | `/getlikedvideos` | Logged in |

Unauthenticated protected routes return `{ success: false, message: "..." }` with status **200** (middleware design for XHR-style clients).

## Testing API routes (dry run)

Smoke-test routes without creating real users or uploads:

```bash
# Server must be running
node server/scripts/dryRunRoutes.js
```

Optional base URL:

```bash
API_BASE=http://localhost:8080 node server/scripts/dryRunRoutes.js
```

Checks public GETs, auth guards, login/signup validation, and SPA `index.html`. Does **not** replace full authenticated E2E tests.

## Troubleshooting

### Port 8080 already in use (`EADDRINUSE`)

Another Node process is still bound to the port.

```bash
lsof -i :8080          # see what is using the port
lsof -ti :8080 | xargs kill   # stop it
cd fitness/server && npm start
```

Or press **Ctrl+C** in the terminal where the server is already running.

### Server won’t start — `SyntaxError` in `recipeRoutes.js`

If `console.log` removal left orphaned object literals, ensure `recipeRoutes.js` has no stray `{ name, tagsArr, ... });` blocks without a function call. The add/edit handlers should go straight from parsing input to `Recipe.create` / `findOneAndUpdate`.

### MongoDB driver warnings

`useNewUrlParser` and `useUnifiedTopology` are deprecated in Mongoose 8+; safe to remove from `mongoose.connect()` when convenient.

### Client can’t reach API

- Confirm `VITE_API_BASE_URL=http://localhost:8080` in `client/.env`.
- Restart Vite after changing env files.
- Use `withCredentials: true` on Axios calls (already set in components) for session cookies.

## Deployment notes

- Set `NODE_ENV=production`, strong `SESSION_SECRET`, and production `MONGO_URI`.
- CORS allows `https://fitness-social.onrender.com` and `https://fitnesssocial.onrender.com`.
- Session cookies use `secure` and `sameSite: none` in production.
- Build the client before starting the server so `client/dist` exists.

## Code quality

- Debug `console.*` calls removed from application source.
- Comments stripped except the default Vite comment in `vite.config.js`.
- Formatting normalized (2-space indentation).
- Server `files/` and `logs/` are gitignored.

## License

ISC (per `server/package.json`).
