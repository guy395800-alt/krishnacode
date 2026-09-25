# NexgenCode — Student Coding Practice & Examination Platform

NexgenCode is an online programming practice, algorithmic problem-solving, and examination platform designed for students and educational institutions.

---

## 🌟 Key Features

- 💻 **Interactive Code Sandbox:** Multi-language execution (Python 3.11, C++, C, Java, JavaScript, SQL) with instant compiler testing.
- 🎯 **Curated Problem Catalog:** 500+ categorized algorithmic challenges across Easy, Medium, and Hard difficulty levels.
- 🛡️ **Timed Examination Engine:** Server-monitored examination mode featuring anti-cheating protections (clipboard restriction & focus-loss logging).
- 🏆 **Live Campus Leaderboard:** Real-time competitive rankings based on total score, accuracy, and daily streaks.
- 📊 **Analytics Dashboard:** Performance tracking with topic mastery metrics, submission ratio charts, and CSV/Excel data exports.
- 🔐 **Role-Based Access Control:** Dedicated workspaces for Students and Administrators.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Lucide Icons, Recharts, Monaco Editor (`@monaco-editor/react`)
- **Backend API:** FastAPI / Python (Hosted on Render)
- **Database:** Supabase PostgreSQL

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=https://krishnacodebackend.onrender.com/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://penucrigozfkhpvtbwwb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m35xJ9BQwNImr1zSkr6S5A_YPaTr__w
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
This generates the optimized static bundle in the `out/` folder.

---

## 📦 Deployment

- **Vercel / Netlify / Render:** Connect this repository directly; build command `npm run build`, publish directory `out`.
- **Apache / Shared Hosting / ProFreeHost:** Upload contents of `out/` into `htdocs` or `public_html` (includes `.htaccess` for SPA routing).
- **Docker:** Build with `docker build -t nexgencode-frontend .`
