# Demon Slayer Breathing Techniques HUD

> **Vibe Focus:** Dark Fantasy / Immersive Breathing HUD (3D)  
> **Tech Stack:** Next.js 16 + React 19 + React Three Fiber + Three.js + GSAP

Welcome to the **Demon Slayer Breathing Techniques HUD** web portal. This is a high-performance, immersive manga reader site designed specifically for fans of the series. The project leverages modern web optimization techniques to deliver a fast, localized, and beautiful experience.

---

## 🌟 Key Features

- Interactive WebGL 3D elements showing Nichirin sword effects (React Three Fiber).
- Custom audio-visual breathing patterns synchronized with scroll positions.
- Next PWA configuration with service worker offline caching.
- Dynamic Next.js 16 metadata structures for Google Rich Snippets.

---

## 🛠️ Getting Started

### 📋 Prerequisites
- **For Web Server:** Python 3.10+ (to serve static files or run generators) or Node.js 18+ (if package dependencies are needed).
- **GitHub CLI (`gh`)**: Recommended for pushing updates.

### 🔑 API Key Configuration
This project includes automated content generation and SEO optimization scripts that use the **Zhipu AI / BigModel API**. 

To utilize these scripts:
1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your API key:
   ```env
   BIGMODEL_API_KEY=your_actual_api_key_here
   ```
   *Note: If you have multiple keys, you can specify them as a comma-separated list.*

---

## 🚀 Local Development

Install modules and launch the Next.js dev server:
```bash
npm install
npm run dev
```

Then open your browser and navigate to the local server URL (usually `http://localhost:8000` or `http://localhost:5173`).

---

## 🤖 Content Generation & Automation
The project is equipped with local AI-powered generation scripts to build and update the site content dynamically.

No specific standalone generation scripts required. Custom layouts are pre-baked.

---

## 📦 Production Deployment

Generate production-ready build:
```bash
npm run build
```
Deploys easily to Vercel, Netlify, or AWS.

- **Ignored Assets:** Large `manga/` chapter image directories and local archives are excluded from this repository (configured in `.gitignore`) for performance and size constraints. Ensure image files are uploaded directly to your hosting server's path structure.
- **SEO Ready:** Sitemap (`sitemap.xml`) and `.htaccess` file rules are fully configured to rewrite paths and provide Google-friendly crawler access.
