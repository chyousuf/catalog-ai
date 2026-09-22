# CatalogAI 🛍️✨

> **Intelligent Product Cataloging for Small Online Businesses**  
> Generate compelling titles, descriptions, SEO metadata, search tags, and social media captions with strict anti-hallucination guardrails.

CatalogAI helps small e-commerce merchants and independent makers transform raw product photos and basic notes into high-converting product listings in seconds.

---

## ✨ Features

- **📸 Image Upload & Instant Preview**: Upload product photography via drag-and-drop or select from built-in sample presets with responsive previews.
- **🛡️ Anti-Hallucination Guardrails**: Strictly forbids fabricating unverified specifications (Material, Dimensions, Certifications, Brand). Missing details are flagged for user confirmation.
- **✍️ Editable AI Content Suite**:
  - **Compelling Titles** with character count tracking
  - **Short Descriptions** optimized for catalog listing cards
  - **Detailed Descriptions** with narrative storytelling and formatted feature bullets
  - **Suggested Categories** mapped to retail departments
  - **Search Tags** with interactive pill removal and custom tag creation
  - **SEO Meta Description** with a live Google SERP snippet preview and 160-char gauge
  - **Instagram Caption** with simulated post preview, emojis, hashtags, and one-click copy
- **🎨 Polished Downloadable Marketing Cards**: Export high-resolution (2x retina) product graphics in Square (1:1) or Portrait (4:5) format as PNG or JPEG.
- **📊 Searchable Catalog Grid**: Filter by category, price, and search query across titles, descriptions, and tags.
- **📁 CSV Export**: 1-click RFC-4180 compliant CSV export compatible with Shopify, WooCommerce, and spreadsheet tools.
- **🔒 Server-Side AI Security**: API keys (`GEMINI_API_KEY`) stay strictly on the server; includes an offline fallback engine for zero-setup local demonstration.
- **📦 Pre-Loaded Demo Data**: Includes 4 artisanal demo products clearly labeled with "Demo Data" badges.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/chyousuf/catalog-ai.git
cd catalog-ai
npm install
```

### 2. Configure Environment (Optional)

CatalogAI works out-of-the-box using its built-in context-aware engine. To enable live Google Gemini AI generation:

```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with purple & slate aesthetic
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Generation**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 📄 License

MIT © [chyousuf](https://github.com/chyousuf)
