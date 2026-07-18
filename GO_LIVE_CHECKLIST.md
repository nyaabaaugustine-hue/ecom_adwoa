# Adwoa's Beauty — Go-Live Checklist

_Updated after a full audit of the auth/checkout/upload flow. The items marked
**⚠ REQUIRED** below were broken or insecure and have been fixed in code —
but the two ⚠ items under "Fill in .env" and "Sync the database" still need
you to take action before this can go live._

## 1. Fill in `.env` (one-time, before anything else)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [console.neon.tech](https://console.neon.tech) → your project → Connection Details |
| `PAYSTACK_SECRET_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developers) → Secret key (live) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Same page → Public key (live) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [cloudinary.com](https://cloudinary.com) → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary → Settings → API Keys |
| `JWT_SECRET` | Already set to a real random value — rotate it again with `openssl rand -base64 32` (or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`) if it's ever exposed |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` (different value) — currently a placeholder, not yet used by any route but fill it in anyway |
| `NEXT_PUBLIC_APP_URL` | Your real domain e.g. `https://adwoas.com` |

**⚠ REQUIRED — still placeholders, checkout/images will not work until these are real:**
- `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — get **live** keys from dashboard.paystack.com before going live (test keys are fine for a soft launch, but no real money moves with test keys)
- `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from cloudinary.com → Settings → API Keys

---

## 2. Install dependencies

```bash
cd "C:\Users\TGNE\Documents\ecom"
npm install
```

---

## 3. Sync the database schema (⚠ REQUIRED — do this before testing admin Settings/Shipping/Discounts/Notifications)

The project now uses **Drizzle ORM** (`src/db/schema.ts`) as the source of truth, not the old `/api/setup` route. The existing migration only covers products/customers/orders — the newer `store_settings`, `shipping_zones`, `discounts`, and `notification_settings` tables were added to the schema but never pushed to Neon. Run:

```bash
npm run db:generate   # writes a new migration file for the newer tables
npm run db:migrate    # applies all migrations to DATABASE_URL
```

(`npm run db:push` also works for a quick dev sync without generating migration files.) Until this runs, the admin dashboard's Settings, Shipping, Discounts, and Notifications tabs will fail with a "relation does not exist" error.

`src/app/api/setup/route.ts` (the older raw-SQL table creator) is now redundant — safe to delete once you've confirmed `db:migrate` works, since every additional public route is one less thing to secure.

---

## 3b. Seed / change the admin accounts

Admin, manager, and staff logins are hardcoded server-side in `src/lib/auth.ts` (bcrypt-hashed, never sent to the browser) — currently still the demo passwords `admin123` / `manager123` / `staff123`. **Change these before launch**: edit the plaintext strings passed to `bcrypt.hashSync(...)` in that file to real passwords, and remove the "Demo Credentials" box from `src/components/LoginModal.tsx` so real passwords aren't advertised on the login screen.

---

## 4. Configure Paystack webhook

1. Go to [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/webhooks)
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Save. Paystack will POST here for every successful payment.

---

## 5. Add Cloudinary default image

1. Upload an image named `default.jpg` to the **root** of your Cloudinary media library.
2. This is the fallback image shown when a product has no photo.

---

## 6. Build & test locally

```bash
npm run build
npm run start
```

Fix any TypeScript / build errors before deploying.

---

## 7. Deploy (recommended: Vercel)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod
```

When prompted, paste each env variable from `.env.local` into Vercel's dashboard under:
**Project → Settings → Environment Variables**

Or import them in bulk with:
```bash
vercel env pull   # sync from Vercel to local
```

---

## 8. Post-deploy checks

- [ ] Homepage loads with products
- [ ] Cart adds/removes items
- [ ] Checkout → Paystack page opens
- [ ] Payment succeeds → redirects to `/checkout/success`
- [ ] Admin panel login works
- [ ] Orders appear in admin dashboard
- [ ] Webhook fires (check Paystack dashboard → Logs)
- [ ] SSL certificate is active (padlock in browser)

---

## Security reminders

- `.env.local` is in `.gitignore` — never push it to GitHub
- Use **live** Paystack keys only in production; use **test** keys locally
- Rotate `JWT_SECRET` and `NEXTAUTH_SECRET` if they are ever exposed
- Remove `/api/setup` route after first run
