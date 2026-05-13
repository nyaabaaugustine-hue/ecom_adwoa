# Adwoa's Beauty & Fashion 🇬🇭

Ghana's premier e-commerce platform for authentic African fashion, cosmetics, and skincare — built with **Next.js 14**, **Tailwind CSS v3**, and **TypeScript**.

## Features

- 🛍️ Dynamic product grid with category filtering (Fashion, Cosmetics, Skincare, Hair Care, Accessories)
- 🛒 Real-time shopping cart with Context API
- 🔐 Role-based authentication (Admin / Manager / Staff)
- 📊 Admin dashboard with analytics, orders, products, and customer management
- 📱 Fully responsive, mobile-first design
- 🏪 50+ Ghanaian products with Cloudinary-hosted images
- 💳 MTN MoMo, Vodafone Cash, AirtelTigo, Visa & Mastercard payment UI
- ⚡ Announcement bar, newsletter subscription, testimonials

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Language:** TypeScript
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Fonts:** Playfair Display (serif) + Inter (sans)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@adwoas.com         | admin123    |
| Manager | manager@adwoas.com       | manager123  |
| Staff   | staff@adwoas.com         | staff123    |

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # All UI components
├── context/       # CartContext
└── utils/         # auth.ts, products.ts
```

## Deploy

```bash
npm run build
npm run start
```

Ready for Vercel: connect your GitHub repo and deploy with zero config.
