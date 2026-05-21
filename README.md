# Order Tracker

Upload order PDFs and auto-extract details (order ID, customer, total, status, tracking, etc.) using the **free** [OCR.space API](https://ocr.space). No database required — orders are stored in your browser's localStorage.

## Features

- 📄 Upload PDF order confirmations, invoices, or purchase orders
- 🔍 Auto-extracts: order ID, customer, date, total, tracking #, carrier, delivery date, address, items
- 🏷️ Status detection + manual status updates
- 📊 Stats dashboard
- 🆓 100% free OCR via OCR.space (500 requests/day)
- 💾 Persists in localStorage — no database needed

---

## Getting Started

### 1. Get a free OCR.space API key

Go to [ocr.space/ocrapi/freekey](https://ocr.space/ocrapi/freekey), enter your email, and you'll receive a free key instantly.

### 2. Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste your API key, and upload a PDF.

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite. Done.

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub:

```bash
git init
git add .
git commit -m "initial commit"
gh repo create order-tracker --public --push
# or manually push to your GitHub repo
```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.
3. Vercel auto-detects Vite settings. Click **Deploy**.

No environment variables needed — the OCR API key is entered by the user in the browser.

---

## Project Structure

```
order-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ApiKeyInput.jsx   # API key input with show/hide
│   │   ├── OrderCard.jsx     # Single order display + actions
│   │   ├── StatusBadge.jsx   # Colored status pill
│   │   ├── StatsBar.jsx      # Summary counts
│   │   ├── Toast.jsx         # Notification toast
│   │   └── UploadZone.jsx    # Drag-and-drop PDF uploader
│   ├── hooks/
│   │   ├── useOrders.js      # Orders state + localStorage
│   │   └── useToast.js       # Toast notifications
│   ├── utils/
│   │   ├── ocr.js            # OCR.space API call
│   │   └── parser.js         # Field extraction from raw text
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .gitignore
```

---

## Do I need a database?

**Not for this setup.** Orders are saved in the browser's `localStorage` — they persist across page refreshes and browser restarts on the same device.

**You'd want a database if you need:**
- Access orders from multiple devices / users
- Share a dashboard with your team
- Store more than ~5MB of order data
- Search or filter large volumes of orders

When you're ready to add one, [Supabase](https://supabase.com) has a generous free tier and works great with React.

---

## OCR Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests/day | 500 |
| Max file size | 1 MB |
| Pages/request | Up to 3 (free tier) |
| Credit card | Not required |

For higher volume, upgrade at [ocr.space/pricing](https://ocr.space/pricing).
