# MOVA — Modern People Discovery & Portfolio Platform

> A production-ready, ultra-responsive People Discovery Platform engineered with **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features

- 🔍 **People Discovery & Search:** Real-time search, multi-category filters, and responsive sort options.
- 👤 **Rich Profile Showcase:** Comprehensive biography, career timeline chronology, verified achievements, project highlights, and media galleries.
- 🛡️ **Multi-Role Demo System:** 1-Click Role Login Gateway supporting 5 roles:
  - 👑 **Super Admin** — Master system statistics, claims verification station, and user status management.
  - 🛡️ **Platform Admin** — Category management, claim approvals, and platform audits.
  - ⚖️ **Content Moderator** — Content review queue, flagged profile handling, and moderation log.
  - 🎨 **Creator** — Live biography editor, achievements manager with persistent storage.
  - 🧭 **User** — Bookmarked profiles collection, discovery algorithm preferences.
- 🔐 **Role-Based Navigation Guards:** Automatic redirection preventing unauthorized cross-role route access in demo mode.
- 📱 **Universal Responsiveness:** Pixel-perfect from **320px** mobile up to **3840px 4K ultrawide** displays with zero horizontal overflow.
- ⚡ **Data Persistence:** Client-side local storage engine for session management, creator bio editing, achievements, and bookmarks.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18.18.0
- **npm** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/Azizov-09/mova-demo-.git
cd mova-demo-
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

### Vitest Unit Tests
```bash
npm run test
```
- **18/18 PASS** across utility suites and repository mock storage.

### Playwright Automated E2E Suite
```bash
npx playwright test --reporter=list
```
- **8/8 PASS** verifying Public Pages, Login Gateway, Role Guards, Super Admin, Creator, User, Switch Account, and Multi-Viewport Zero-Overflow.

### Production Build
```bash
npm run build
```
- Fully compiled with **Next.js 16 Turbopack**, Cache Components, and Partial Prefetching.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Vanilla CSS design tokens + Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Validation:** Zod
- **Testing:** Playwright, Vitest, Testing Library

---

## 📄 License
MIT License. Created for the MOVA platform demonstration.
