# NOVA + Nova Coach 

> **Hackathon note:** NOVA (the scanner app) existed before this hackathon. **Nova Coach** — the
> Express/Gemini personalisation layer, login, and personal verdicts — was built today.

**Live app:** https://labelwise-henna.vercel.app
**API:** `<RENDER_URL>` _(add after deploying)_
**Demo video:** `<DEMO_LINK>`

## Problem

Packaged-food labels are hard to read, and a "healthy" score means little if the product contains
your allergen or works against your goals. A generic 62/100 can be a great choice for one person and
a bad one for another.

## Solution

NOVA scans a barcode or an ingredient label and gives a 0–100 general score using an on-device
additive database. **Nova Coach** adds a second, personal layer: logged-in users get a verdict —
**Good for you / Eat with caution / Avoid** — with a personal score and a one-sentence reason that
cites their own profile.

- Gemini rates the product against the user's goals, allergies, conditions and diet, returning strict JSON.
- **Hard allergen rule in code:** after Gemini responds, the server checks the ingredients against the
  user's allergies. Any match forces `avoid`, caps the personal score at 15 and names the allergen — a
  model mistake can never mark an allergen as safe.
- If Gemini fails or takes longer than 8 s, the verdict falls back to the general score.
- Guests keep the original local-only experience; nothing is required to sign up.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Tailwind v4 (new screens only, `tw:` prefix), PWA |
| Scanning | Tesseract.js OCR, html5-qrcode, Open Food Facts |
| Backend | Node + Express 5, JWT, bcrypt, Zod |
| AI | Google Gemini (server-side key only) |
| Storage | In-memory on the server (demo); localStorage on device |
| Hosting | Vercel (frontend), Render (API) |

## Architecture

```
Phone (React PWA)
 ├─ scan → OCR / barcode → ingredient text
 ├─ local engine (src/utils/ingredientAnalysis.js) → general score
 └─ logged in? ──POST /scan (JWT)──▶ Express API (server/)
                                      ├─ Zod validation
                                      ├─ Gemini → {personal_score, verdict, reason}
                                      ├─ hard allergen rule (code, after Gemini)
                                      ├─ fallback from general score if Gemini fails/>8s
                                      └─ save in memory → return verdict
```

AI helpers (`/ai/clean-ingredients`, `/ai/home-message`) are served by Express + Gemini. The
original Vercel Groq functions in `api/` stay as an automatic fallback.

## Run locally

### API (`server/`)

```bash
cd server
cp .env.example .env   # then fill in GEMINI_API_KEY and JWT_SECRET
npm install
npm start              # http://localhost:3001
```

Demo accounts are created on every start (password `demo1234`):

- `diabetic@nova.app` — goals: Less sugar, Less processed food · allergy: gluten
- `athlete@nova.app` — goals: High protein, Clean ingredients

Endpoints: `GET /health`, `POST /auth/signup`, `POST /auth/login`, `GET|PUT /profile`,
`POST /scan`, `GET /history`, `POST /ai/clean-ingredients`, `POST /ai/home-message`.

### Frontend (repo root)

```bash
npm install
echo VITE_API_URL=http://localhost:3001 > .env.local
npm run dev            # http://localhost:5173
```

## Environment variables

| Where | Variable | Notes |
|---|---|---|
| `server/.env` + Render | `GEMINI_API_KEY` | Google AI Studio key. Never put it in the frontend. |
| `server/.env` + Render | `JWT_SECRET` | Long random string. |
| `server/.env` + Render | `FRONTEND_URL` | `https://labelwise-henna.vercel.app` (CORS). |
| `server/.env` (optional) | `PORT`, `GEMINI_MODEL` | Defaults `3001`, `gemini-3.8-flash`. |
| `.env.local` + Vercel | `VITE_API_URL` | The API's URL (Render URL in production). |
| Vercel | `GROQ_API_KEY` | Only for the fallback `api/` functions. |

## Known limits

- The API stores users and scans in memory, so they reset when the server restarts (demo users are re-created).
- Allergen detection is keyword-based and best-effort; always check the pack.
- Scores are guidance, not medical advice.
