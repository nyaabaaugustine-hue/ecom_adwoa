# Adwoa's Beauty — Go-Live Checklist

## 1. Fill in `.env.local` (one-time, before anything else)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [console.neon.tech](https://console.neon.tech) → your project → Connection Details |
| `PAYSTACK_SECRET_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developers) → Secret key (live) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Same page → Public key (live) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [cloudinary.com](https://cloudinary.com) → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary → Settings → API Keys |
| `JWT_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` (different value) |
| `NEXT_PUBLIC_APP_URL` | Your real domain e.g. `https://adwoas.com` |

---

## 2. Install dependencies

```bash
cd "C:\Users\TGNE\Pictures\metic"
npm install
```

This will add the missing `@neondatabase/serverless` package.

---

## 3. Create the database tables (run ONCE after deploy)

```
GET https://yourdomain.com/api/setup?secret=<your JWT_SECRET value>
```

You should get: `{ "success": true, "message": "All tables created" }`

After running, **disable or delete** `src/app/api/setup/route.ts` — it's a security risk in production.

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
