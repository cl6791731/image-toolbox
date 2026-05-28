# Image Toolbox — Astro Multi-Page Version

## SEO Fixes Included

- ✅ Multi-page static architecture (each tool & article has its own URL)
- ✅ Schema.org structured data (WebApplication, TechArticle, BreadcrumbList)
- ✅ Open Graph + Twitter Card meta tags
- ✅ Canonical URLs + Hreflang for i18n (zh/en)
- ✅ Semantic HTML (article, section, nav, main, figure, figcaption)
- ✅ Alt attributes + lazy loading on images
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Robots.txt + Sitemap integration via @astrojs/sitemap
- ✅ noscript fallback content
- ✅ Breadcrumb navigation with Schema markup
- ✅ AdSense component with error handling
- ✅ Performance: preconnect + dns-prefetch for ad domain

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Seo.astro          # All SEO meta tags + JSON-LD
│   │   ├── Breadcrumb.astro   # Breadcrumb navigation + Schema
│   │   └── AdSense.astro      # Google AdSense wrapper
│   ├── layouts/
│   │   └── Layout.astro       # Base layout with nav/footer
│   ├── pages/
│   │   ├── index.astro        # Format converter (EN)
│   │   ├── compress.astro     # Compress tool (EN)
│   │   ├── crop.astro         # Crop tool (EN)
│   │   ├── watermark.astro    # Watermark tool (EN)
│   │   ├── resize.astro       # Resize tool (EN)
│   │   ├── articles/
│   │   │   ├── index.astro    # Article list (EN)
│   │   │   └── [slug].astro   # Article detail (EN)
│   │   └── zh/                # Chinese versions (mirror structure)
│   └── content/
│       └── config.ts          # Content collection schema
├── public/
│   └── robots.txt
├── astro.config.mjs
└── package.json
```

## Setup

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build for production
```

## Deploy

Recommended: Cloudflare Pages (free, global CDN, no ICP needed for overseas traffic)

```bash
npm run build
# Upload dist/ folder to Cloudflare Pages
```

## AdSense Setup

1. Replace `ca-pub-4519467063111183` in `src/components/AdSense.astro` with your actual publisher ID
2. Replace all `slot` values with your actual ad slot IDs
3. Apply for AdSense after you have 20+ pages of content

## Next Steps

1. Fill in real article content in `[slug].astro` pages
2. Add OG image (`/og-image.png`) to public folder (1200×630px)
3. Add favicon (`/favicon.ico`) to public folder
4. Replace `https://yourdomain.com` in `astro.config.mjs` with your real domain
5. Add Google Analytics 4 script to Layout.astro if needed
