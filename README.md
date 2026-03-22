# Pluma Joinery Studio — Next.js Estimator

Customer-facing project estimator rebuilt in Next.js. Replaces the Streamlit version at `www.plumajoinery.com` for instant, mobile-optimised interactions.

**The Streamlit admin dashboard is unchanged — this repo is customer-facing only.**

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Hosting | Railway |
| Database | Supabase PostgreSQL (pooler) |
| Email | Resend API |
| Styling | CSS-in-JS (inline styles + CSS variables) |
| Fonts | DM Sans + DM Serif Display (Google Fonts) |

---

## Project structure

```
pluma-estimator/
├── app/
│   ├── api/
│   │   ├── submit-lead/route.ts   # POST: validate → price → DB → email
│   │   └── estimate/route.ts      # POST: live estimate preview (no DB)
│   ├── globals.css                # CSS variables, animations
│   ├── layout.tsx                 # Root layout, fonts, metadata
│   └── page.tsx                   # Entry point
├── components/
│   ├── Estimator.tsx              # Main orchestrator (7 steps + thank you)
│   ├── ThankYou.tsx               # Post-submit screen
│   ├── ProgressBar.tsx
│   ├── NavButtons.tsx
│   ├── StepHeader.tsx
│   ├── ReviewCards.tsx            # 4 real hipages reviews
│   └── steps/
│       ├── Step1ProjectType.tsx   # 6 project cards
│       ├── Step2Dimensions.tsx    # Dimensions or refresh counts
│       ├── Step3Finish.tsx        # 5 finish options
│       ├── Step4Drawers.tsx       # None / 1-2 / 3-4 / 5+
│       ├── Step5Install.tsx       # Yes / No
│       ├── Step6Timeline.tsx      # Timeline + consultation
│       └── Step7Contact.tsx       # Name, phone, email, suburb
├── lib/
│   ├── pricing.ts                 # Exact port of pricing_engine.py
│   ├── db.ts                      # Supabase pool + insertLead()
│   ├── email.ts                   # Resend email templates
│   └── types.ts                   # Zod schema + suburb list
├── migrations/
│   └── 001_create_leads.sql       # Run in Supabase SQL editor if needed
├── .env.local.example             # Copy to .env.local and fill in
├── railway.json                   # Railway deployment config
└── next.config.js
```

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/plumakitchenscarpentry-ctrl/pluma-estimator
cd pluma-estimator
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_ADDRESS=plumakitchenscarpentry@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **DATABASE_URL**: Get this from Supabase Dashboard → Settings → Database → Connection Pooling → "Transaction" mode connection string. Use port `6543`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Railway

### Option A — Connect GitHub repo (recommended)

1. Push this repo to GitHub
2. In Railway: **New Project → Deploy from GitHub repo**
3. Select the repo
4. Add environment variables (see below)
5. Railway auto-detects Next.js via Nixpacks and deploys

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway link          # link to existing project, or
railway init          # create new project
railway up
```

### Environment variables in Railway

Go to your service → **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase pooler connection string (Transaction mode, port 6543) |
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_ADDRESS` | `plumakitchenscarpentry@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.plumajoinery.com` |

Railway automatically sets `PORT` — Next.js reads this via the `start` script.

### Custom domain

In Railway: service → **Settings → Domains** → add `www.plumajoinery.com`.

Your existing Squarespace DNS setup (CNAME pointing to Railway) will continue to work — no DNS changes needed.

---

## Database

The `leads` table schema is **identical** to the Streamlit version. The only difference is the `source` field:

- Streamlit leads: `source = 'estimator'`
- Next.js leads: `source = 'nextjs-estimator'`

Your Streamlit admin dashboard requires **zero changes**.

If you need to create the table fresh (new Supabase project), run `migrations/001_create_leads.sql` in the Supabase SQL editor.

---

## Pricing logic

`lib/pricing.ts` is a direct TypeScript port of `pricing_engine.py`. Key constants:

```
SHEET_AREA = 2.88 sqm/sheet   SHEET_COST = $60
DOOR WIDTH = 400mm             DRAWER = $220
LARGE_PANEL = $470             KICK_RAIL = $150
INSTALL = $1,400/day           TRANSPORT = $300
ADMIN = 10%
Low = total × 1.10 × 0.90     High = total × 1.10 × 1.15
```

If you change pricing in the Python version, update the same constants here.

---

## Lead scoring (matches Streamlit exactly)

| Signal | Score |
|--------|-------|
| Ready to start | +3 |
| 1–3 months | +2 |
| 3–6 months | +1 |
| Wants consultation: Yes | +3 |
| Wants consultation: Maybe | +1 |
| Budget $10k+ | +2 |
| Budget $5k–$10k | +1 |

- **Hot** = 7+ — call same day
- **Warm** = 4–6 — follow up within 48h
- **Cold** = 0–3 — nurture

---

## Email setup (Resend)

Two emails sent on submission:
1. **Lead notification** → `EMAIL_ADDRESS` — includes lead temp, score, all details
2. **Customer confirmation** → customer's email — includes estimate range

Both use `onboarding@resend.dev` as sender (Resend's shared domain) unless you verify `plumajoinery.com` in Resend and update the `from` field in `lib/email.ts`.

To use your own domain:
1. Resend Dashboard → Domains → Add domain → verify DNS
2. In `lib/email.ts`, change both `from` fields to e.g. `Pluma Joinery Studio <hello@plumajoinery.com>`

---

## Performance vs Streamlit

| Metric | Streamlit | Next.js |
|--------|-----------|---------|
| Interaction response | 3–4 seconds | ~0ms (client-side state) |
| Initial page load | Cold start ~3s | <1s (static shell) |
| Mobile experience | Poor | Native-quality |
| Step transitions | Full page reload | Instant |
| Form validation | Server-side | Instant client-side |

---

## Development notes

- All pricing runs **client-side** for instant live previews (header shows running estimate from step 3 onwards)
- On submit, pricing also runs **server-side** in the API route — the client-side result is for UX only; the DB always stores the server-computed value
- Emails fire **non-blocking** — form submission responds immediately; email failure never blocks the user
- DB insert failure is **non-fatal** — user still sees their estimate even if Supabase is down

---

## Contact

Jeison — Pluma Joinery Studio  
[plumajoinery.com](https://www.plumajoinery.com) · [@plumajoinery](https://instagram.com/plumajoinery)
