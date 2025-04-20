
# Bilingo‑Admin Panel Setup & Run

Frontend: **Next.js**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**

---

## 1. Clone & Install

```bash
git clone https://github.com/kobtair/bilingo-admin.git
cd bilingo-admin
npm install   # or yarn install
```

---

## 2. Environment Variables

Create a file named `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=<app-name>
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://<supabase-url>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

---

## 3. Run in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Build & Start for Production

```bash
npm run build
npm run start
```

The admin panel will run on port `3000` by default.
