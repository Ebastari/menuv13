# 📱 META TAGS & SEO IMPLEMENTATION INSTRUCTIONS

## File Upload & Integration Points

Ini adalah panduan step-by-step untuk mengintegrasikan Meta Tags dan SEO optimization ke website Anda. Pilih metode sesuai platform yang Anda gunakan.

---

## METODE 1: React/Vite (Sudah Diimplementasikan ✅)

### 1.1 Meta Tags di HTML Header
**File:** `index.html`

Semua meta tags sudah ditambahkan di `<head>` section:
- ✅ Meta Title
- ✅ Meta Description
- ✅ Meta Keywords
- ✅ Open Graph Tags
- ✅ Twitter Tags
- ✅ Author & Publisher tags

**Verifikasi:**
```bash
# Open di browser dan lihat Page Source (Ctrl+U)
# Cari: <title>My Montana AI: Sistem Manajemen Revegetasi...
```

### 1.2 Schema Markup (JSON-LD)
**File:** `index.html` (sebelum closing </head>

Tiga schema sudah ditambahkan:
1. Organization Schema
2. Product Schema
3. SoftwareApplication Schema

**Test Schema:**
```bash
# Buka: https://schema.org/validator
# Paste full page source
# Check untuk errors (Berwarna hijau = OK)
```

### 1.3 Component-Level SEO
**File:** `components/LayananPengaduan.tsx`

Sudah diimplementasikan:
- ✅ H1 semantic tag (single per page)
- ✅ H2 tags untuk feature titles
- ✅ H3 tags untuk subsections
- ✅ Image alt text descriptive
- ✅ FAQ schema markup dengan itemProp

---

## METODE 2: WordPress + Yoast SEO Plugin

### 2.1 Setup Plugin

**Step 1:** Install & Activate
```
Dashboard → Plugins → Add New
Search: "Yoast SEO"
Install → Activate
```

**Step 2:** Setup Wizard
```
Yoast SEO → General → Setup Wizard
- Choose language: Indonesian
- Website Type: Business
- Business Type: Technology/Software
```

### 2.2 Register Homepage

**File Conversion (dari React ke WordPress):**

Homepage URL:
```
WordPress: https://montana-tech.info/
```

**Di Yoast SEO:**
```
Dashboard → Yoast SEO → Settings → Site Settings

General:
- Separator: "-" atau "|"
- Company Name: "PT Montana Wana Teknologi"
- Company Logo: https://montana-tech.info/logo.png

Knowledge Graph:
- Type: "Organization"
- Name: "PT Montana Wana Teknologi"

Add Social Profiles:
- Facebook: https://facebook.com/montanawanateknologi
- LinkedIn: https://linkedin.com/company/montana-wana-teknologi
- Twitter: https://twitter.com/montanatech
```

### 2.3 Optimize Individual Posts/Pages

**Untuk setiap halaman (Homepage, Product Page, Blog Posts):**

**Homepage (Analog ke App.tsx):**
```
SEO Title: "My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan"
Meta Description: "Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial, dan perhitungan karbon presisi tinggi."
Focus Keyword: "Manajemen Revegetasi AI"
```

**Product Page (Narasi Sistem):**
```
SEO Title: "Narasi Sistem Montana AI - 10 Modul Terintegrasi"
Meta Description: "Jelajahi arsitektur 10 modul Montana AI yang membangun ekosistem digital revegetasi terpadu."
Focus Keyword: "Sistem Revegetasi Terintegrasi"
```

**Blog Article Template:**
```
SEO Title: "[Judul] | My Montana AI"  (Max 60 chars)
Meta Desc: "Pelajari tentang [topic]. Panduan lengkap dari PT Montana Wana Teknologi. [CTA]"  (Max 155 chars)
Focus Keyword: "[Main topic keywords]"
Readability: Target 70+ score
```

### 2.4 Add FAQ Schema (WordPress)

**Di Yoast SEO:**
```
Post/Page → Yoast SEO → Schema → Add Schema Type
Select: "FAQPage"

For each question add:
- Question: [Copy dari FAQ items]
- Answer: [Copy dari FAQ answers]
```

---

## METODE 3: WordPress + Rank Math Plugin

### 3.1 Setup Alternative

**Install:**
```
Dashboard → Plugins → Add New
Search: "Rank Math SEO"
Install → Activate
```

**Initial Setup:**
```
Rank Math → Dashboard → Setup Wizard

Choose:
- Business Type: "B2B - Technology/Software"
- Country: "Indonesia"
```

### 3.2 Metadata Configuration

**General Settings:**
```
Rank Math → Titles & Meta → Global Settings

Homepage:
- Title: "My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan Real-Time"
- Description: Auto-generate from content
- Image: Logo atau hero image
```

### 3.3 Advanced Features

**LSI Keywords:**
```
Rank Math → Content AI

Keywords untuk tracking:
- Manajemen revegetasi
- Monitoring lingkungan
- Geospasial AI
- Dashboard bibit
- Portfolio karbon
```

**Bulk Alt Text Generator:**
```
Rank Math → Bulk Operations → Images
Upload images dari:
- /public/images/features/
Auto-generate dari filename
```

---

## METODE 4: Static HTML/Manual Implementation

Jika tidak menggunakan WordPress atau React, gunakan HTML langsung:

### 4.1 Basic Template

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <!-- META TAGS -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO -->
    <title>My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan</title>
    <meta name="description" content="Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial, dan perhitungan karbon presisi tinggi.">
    <meta name="keywords" content="manajemen revegetasi, monitoring lingkungan, AI, geospasial, dashboard">
    
    <!-- OPEN GRAPH -->
    <meta property="og:title" content="My Montana AI: Sistem Manajemen Revegetasi">
    <meta property="og:description" content="Platform terintegrasi...">
    <meta property="og:image" content="https://montana-tech.info/og-image.jpg">
    <meta property="og:url" content="https://montana-tech.info">
    
    <!-- SCHEMA MARKUP -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PT Montana Wana Teknologi",
        "url": "https://montana-tech.info",
        "logo": "https://montana-tech.info/logo.png"
    }
    </script>
</head>
<body>
    <!-- PAGE CONTENT -->
    <h1>My Montana AI: Sistem Manajemen Revegetasi Terintegrasi</h1>
    
    <h2>Feature 1: Montana Camera V2</h2>
    <img src="camera.jpg" alt="Montana Camera V2 - Dokumentasi Visual Presisi Tinggi untuk Monitoring Bibit">
    
    <h2>Feature 2: Dashboard Bibit AI</h2>
    <img src="dashboard.jpg" alt="Dashboard Bibit AI - Analitik Stok Nursery Real-Time Montana AI">
    
    <!-- FAQ SECTION -->
    <section itemScope itemType="https://schema.org/FAQPage">
        <h2>Frequently Asked Questions</h2>
        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Apa keunggulan My Montana AI?</h3>
            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <p itemProp="text">My Montana AI memberikan 3 keunggulan utama...</p>
            </div>
        </div>
    </section>
</body>
</html>
```

---

## METODE 5: Shopify (Jika untuk E-commerce)

### 5.1 Theme Liquid Setup

**File:** `sections/hero.liquid`

```liquid
<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description }}">
<meta property="og:image" content="{{ featured_image.src | image_url: width: 1200 }}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title }}",
  "description": "{{ product.description }}",
  "image": "{{ product.featured_image.src | image_url: width: 600 }}",
  "offers": {
    "@type": "Offer",
    "price": "{{ product.price | money_without_currency }}",
    "priceCurrency": "IDR"
  }
}
</script>
```

### 5.2 SEO Settings

**Settings → Online Store → Preferences:**
```
SEO Title: [Product Name] - My Montana AI
Meta Description: [Benefit-focused description]
Image URL: [Product image 1200x630px]
```

---

## TESTING & VALIDATION

### ✅ Step-by-Step Testing:

**1. Meta Tags Validation:**
```bash
# Tools: https://www.screaming-frog.co.uk/seo-spider/
# Crawl website
# Check tab: "Response Codes" → 200 OK?
# Check tab: "Titles" dan "Meta" untuk optimization suggestions
```

**2. Rich Results Test:**
```bash
# Tools: https://search.google.com/test/rich-results
# Paste URL atau HTML code
# Check untuk errors/warnings
```

**3. Mobile Friendly:**
```bash
# Tools: https://search.google.com/test/mobile-friendly
# Test responsiveness
```

**4. Core Web Vitals:**
```bash
# Tools: https://web.dev/measure/
# Check LCP, FID, CLS scores
```

**5. Lighthouse Audit:**
```bash
# Chrome DevTools → Lighthouse
# Run Audit → Check SEO score (Target: 90+)
```

---

## CHECKLIST: BEFORE GOING LIVE

Pastikan semua item terchecklist sebelum publish:

### Technical SEO:
- [ ] HTTPS enabled (SSL certificate valid)
- [ ] Sitemap.xml created & submitted to GSC
- [ ] Robots.txt configured properly
- [ ] Meta tags unique di setiap halaman
- [ ] H1 only 1 per page, descriptive
- [ ] All images have descriptive alt text
- [ ] Schema markup validated (no errors)
- [ ] Internal links using descriptive anchor text

### Content SEO:
- [ ] Focus keyword included in: H1, Meta Title, Meta Description
- [ ] Content length: Min 300 words (blog), Min 200 words (product page)
- [ ] Keyword density: 1-2% (natural language)
- [ ] LSI keywords included (synonyms/related terms)
- [ ] Headings hierarchy: H1 → H2 → H3 (logical order)
- [ ] FAQ implemented dengan schema

### Performance:
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive (test di DevTools)
- [ ] No 404 broken links
- [ ] Images optimized (< 100KB per image)
- [ ] CSS minified
- [ ] JavaScript deferred

### Social & Analytics:
- [ ] Google Analytics 4 installed & tracking
- [ ] Google Search Console connected
- [ ] Open Graph tags correct (test di Facebook Share Debugger)
- [ ] Conversion tracking setup (demo request form)
- [ ] Landing pages linked to Analytics

---

## POST-LAUNCH MONITORING

### Week 1-2 After Launch:
```
Monitor GSC daily for:
- Crawl errors (fix immediately)
- Coverage issues
- Mobile usability problems
- Core Web Vitals warnings

Monitor GA4 daily for:
- Organic traffic sources
- Bounce rate (target < 60%)
- Conversion rate (target > 2%)
```

### Monthly Review:
```
GSC Performance Report:
- Top queries yang mendrive traffic
- Average CTR (target > 3%)
- Average position (target top 10)

GA4 Report:
- Organic traffic trend
- Conversion funnel analysis
- Device breakdown (mobile vs desktop)
```

### Quarterly Optimizations:
```
Q1 (Jan-Mar):
- Update ESG-related content (demand spike)
- Expand blog content 20% lebih

Q2 (Apr-Jun):
- Optimize pages dengan low CTR
- Build more backlinks

Q3 (Jul-Sep):
- Seasonal content untuk sustainability trends
- Update FAQ dengan new questions

Q4 (Oct-Dec):
- Carbon credit focused content
- Year-end case study roundup
```

---

## COMMON ISSUES & FIXES

### Issue 1: Meta Tags Not Showing in Google SERP

**Diagnosis:**
```bash
# Open Google Cache: cache:montana-tech.info
# Lihat apakah meta tags ada di HTML
# Jika tidak ada: Google belum recrawl
```

**Fix:**
```
Google Search Console → URL Inspection
Enter URL → Request Indexing (atas)
Wait 5-10 minutes untuk recrawl
```

### Issue 2: Rich Snippets Not Showing

**Diagnosis:**
```bash
# Google Rich Results Test → Check untuk errors
# Common: Incomplete schema (missing required fields)
```

**Fix:**
- Add required fields sesuai schema.org documentation
- Validate lagi di Rich Results Test
- Submit URL dengan "Request Indexing"

### Issue 3: Low Keyword Rankings

**Diagnosis:**
```bash
# Check backlinks (Ahrefs/SEMrush)
# Check page authority vs competitors
# Check content quality score
```

**Fix:**
- Improve content quality (add more details, examples)
- Build more quality backlinks
- Optimize title/description untuk higher CTR
- Improve Core Web Vitals

---

## RESOURCES & FURTHER READING

**Official Documentation:**
- Google SEO Starter Guide: https://developers.google.com/search/docs/beginner/get-started
- Schema.org Full Documentation: https://schema.org
- Yoast SEO Knowledgebase: https://yoast.com/help/

**Tools:**
- Google Search Console: https://search.google.com/search-console
- Google Keyword Planner: https://ads.google.com/keyword-planner
- SEMrush: https://semrush.com
- Ahrefs: https://ahrefs.com

**Learning:**
- https://moz.com/beginners-guide-to-seo
- https://backlinko.com/on-page-seo

---

**Last Updated:** February 2026
**Next Review:** May 2026

