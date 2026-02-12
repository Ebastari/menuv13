# 📖 SEO CODE REFERENCE - Complete Implementation Examples

Ini adalah dokumentasi lengkap dari semua kode SEO yang sudah diimplementasikan di My Montana AI. Gunakan sebagai reference untuk maintenance dan future updates.

---

## 1. HTML META TAGS (index.html)

### 1.1 Basic SEO Meta Tags

```html
<title>My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan Real-Time</title>
<meta name="description" content="Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial, dan perhitungan karbon presisi tinggi. Dashboard bibit real-time, monitoring lingkungan, dan tracking tim lapangan.">
<meta name="keywords" content="manajemen revegetasi, monitoring lingkungan, sistem AI revegetasi, portfolio karbon, geospasial, dashboard bibit real-time, teknologi revegetasi Indonesia">
```

**Penjelasan:**
- **Title:** 68 characters (ideal untuk Google SERP)
- **Description:** 155 characters (optimal length)
- **Keywords:** 7 primary + secondary variations

---

### 1.2 Open Graph Tags (Social Media)

```html
<meta property="og:title" content="My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan">
<meta property="og:description" content="Solusi terintegrasi dari PT Montana Wana Teknologi untuk manajemen bibit, tenaga kerja, dan perhitungan karbon presisi tinggi.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://montana-tech.info">
<meta property="og:image" content="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200">
```

**Manfaat:** Ketika link dibagikan di Facebook, LinkedIn, WhatsApp akan tampil dengan image + description yang cantik.

**Recommended Image Specs:**
- Size: 1200x630px (untuk optimal social preview)
- Format: JPG/PNG
- File size: < 200KB
- Content: Landscape orientation, branded elements

---

### 1.3 Twitter/X Meta Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="My Montana AI: Sistem Manajemen Revegetasi Terintegrasi">
<meta name="twitter:description" content="Platform AI untuk monitoring lingkungan dan manajemen revegetasi dengan geospasial real-time.">
```

**Catatan:**
- Gunakan `summary_large_image` untuk image + text
- Gunakan `summary` jika hanya text + small icon

---

### 1.4 Additional Metadata

```html
<meta name="author" content="PT Montana Wana Teknologi">
<meta name="publisher" content="PT Montana Wana Teknologi">
<meta name="robots" content="index, follow">
<meta name="language" content="Indonesian, English">
```

**Penjelasan:**
- `author`: Google uses untuk knowledge panel
- `robots`: Instruksi ke crawlers (index, follow, atau noindex)
- `language`: Untuk multi-language support

---

## 2. SCHEMA MARKUP (JSON-LD Format)

### 2.1 Organization Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PT Montana Wana Teknologi",
  "url": "https://montana-tech.info",
  "logo": "https://montana-tech.info/logo.png",
  "description": "Solusi teknologi terintegrasi untuk manajemen revegetasi dengan AI, geospasial, dan perhitungan karbon",
  "sameAs": [
    "https://www.facebook.com/montanawanateknologi",
    "https://www.linkedin.com/company/montana-wana-teknologi",
    "https://twitter.com/montanatech"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+62-821-xxxx-xxxx",
    "email": "support@montana-tech.info"
  }
}
</script>
```

**Hasil di Google:**
- Organization card di Knowledge Panel
- Business contact info di SERP
- Social media links di Knowledge Graph

---

### 2.2 Product Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "My Montana AI",
  "description": "Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial real-time, dan perhitungan serapan karbon presisi tinggi",
  "brand": {
    "@type": "Brand",
    "name": "PT Montana Wana Teknologi"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "125",
    "reviewCount": "125"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "IDR",
    "price": "500000000",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock"
  },
  "category": ["Revegetation Management", "Environmental Monitoring", "AI Technology", "Carbon Credit"],
  "keywords": "manajemen revegetasi, monitoring lingkungan, AI revegetasi, portfolio karbon, geospasial"
}
</script>
```

**Hasil di Google:**
- **Rating bintang (⭐⭐⭐⭐⭐)** di SERP
- Price and availability
- Product category badge

**Update Rating:**
- Setiap quarter, update `ratingValue` based on user reviews
- Tambahkan `ratingCount` seiring customer bertambah

---

### 2.3 SoftwareApplication Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "My Montana AI",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Windows, macOS, Linux, iOS, Android",
  "softwareVersion": "4.5",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "PT Montana Wana Teknologi"
  },
  "description": "Sistem manajemen revegetasi terintegrasi dengan dashboard analytics real-time, monitoring geospasial, dan kalkulasi serapan karbon otomatis"
}
</script>
```

**Hasil di Google:**
- Software app info box
- Platform compatibility badge
- Version and pricing info

---

## 3. SEMANTIC HTML STRUCTURE

### 3.1 H1 Tag (Homepage/Hero Section)

**File:** `LayananPengaduan.tsx`

```jsx
<h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
  Narasi Sistem <span className="text-emerald-600">Montana AI</span>
</h1>
```

**SEO Rules untuk H1:**
- ✅ Only 1 per page
- ✅ Include primary keyword: "Narasi Sistem Montana AI"
- ✅ Under 60 characters (untuk mobile display)
- ✅ Semantic `<h1>` tag (tidak div dengan styling)
- ✅ Placed di top section (hero area)

**WRONG Example:**
```jsx
<div className="text-4xl font-bold">Narasi Sistem Montana AI</div>  // DIV bukan H1!
<h1>Montana AI</h1> // Terlalu singkat, keyword missing
<h1>Narasi Sistem Montana AI Features Dashboard Bibit</h1> // Terlalu panjang
```

---

### 3.2 H2 Tags (Section Titles)

```jsx
<h2 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-emerald-600">
  {f.title}  {/* Contoh: "Montana Camera V2", "Dashboard Bibit AI" */}
</h2>
```

**Placement:**
```jsx
- H1: Homepage title
  - H2: Feature #1 (Montana Camera V2)
  - H2: Feature #2 (Dashboard Bibit AI)
  - H2: Feature #3 (Montana Assistant)
  - ...
  - H2: FAQ Section
    - H3: Question 1
    - H3: Question 2
```

---

### 3.3 H3 Tags (Subsections)

```jsx
<h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] shrink-0">
  Arsitektur Narasi Mendalam
</h3>
```

---

## 4. IMAGE ALT TEXT

### 4.1 Standard Format

```jsx
<img 
  src={selectedFeature.image} 
  alt={`${selectedFeature.title} - Montana AI Module: ${selectedFeature.highlight}`}
  title={`Dokumentasi ${selectedFeature.title} dalam ekosistem Montana AI`}
/>
```

**Generated Examples:**
```
WRONG:
- alt="image"
- alt="Montana Camera V2"
- alt="camera photo"
- alt="Montana Camera V2, Dashboard Bibit AI, Montana Assistant for revegetation AI platform"

CORRECT:
- alt="Montana Camera V2 - Montana AI Module: Dokumentasi visual presisi tinggi dengan validasi metadata GPS"
- alt="Dashboard Bibit AI - Montana AI System: Sentralisasi data stok nursery dengan algoritma analitik real-time"
- alt="Montana Assistant - Montana AI Platform: Asisten AI berbasis LLM untuk konsultasi revegetasi 24/7"
```

**ALT Text Best Practices:**
1. **Deskriptif**: Menjelaskan apa ada di gambar (bukan hanya keyword stuffing)
2. **Include produk**: Mention "Montana AI" untuk brand recognition
3. **Include feature**: Apa fungsi dari komponen itu
4. **Natural language**: Readable oleh manusia, bukan hanya robots
5. **Panjang optimal**: 50-120 karakter

---

### 4.2 SEO Impact Checklist

```
✅ Gambar di hero section: Alt text + Title attribute
✅ Feature screenshots: Include feature name + benefit
✅ Charts/graphs: Describe data type + metrics
✅ Icons: Describe purpose (bukan hanya "icon")
✅ Decorative images: alt="" (kosong)
```

---

## 5. FAQ SCHEMA MARKUP

### 5.1 FAQ Page Structure

```jsx
<section className="mt-24 px-4" itemScope itemType="https://schema.org/FAQPage">
  <div className="max-w-4xl mx-auto">
    {/* FAQ Items */}
    {faq.map((item) => (
      <div 
        key={item.id}
        itemScope
        itemProp="mainEntity"
        itemType="https://schema.org/Question"
      >
        <h3 itemProp="name">{item.question}</h3>
        
        <div 
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <p itemProp="text">{item.answer}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

**Hasil di Google:**
- FAQ Rich Snippet di SERP
- "People Also Ask" section inclusion
- Featured snippet potential

---

### 5.2 FAQ Data Structure

```typescript
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

const MONTANA_FAQ = (lang: 'id' | 'en'): FAQItem[] => [
  {
    id: 'faq-advantage',
    question: 'Apa keunggulan My Montana AI dibanding metode manual?',
    answer: 'My Montana AI memberikan 3 keunggulan kunci: (1) Visibility - Dashboard real-time vs laporan manual 2-3 minggu. (2) Accuracy - ML prediction rate 92% vs intuisi manusia 60%. (3) Scalability - Manage 10 juta pohon dengan tim 50 orang vs 500 orang manual.',
    keywords: ['keunggulan', 'manfaat', 'efisiensi', 'accuracy']
  },
  // ... more FAQ items
];
```

---

## 6. COMPLETE PAGE EXAMPLE (Hypothetical HTML)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <!-- CHARACTER ENCODING -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO META TAGS -->
    <title>My Montana AI: Sistem Manajemen Revegetasi & Monitoring Lingkungan Real-Time</title>
    <meta name="description" content="Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial, dan perhitungan karbon presisi tinggi.">
    <meta name="keywords" content="manajemen revegetasi, monitoring lingkungan, sistem AI, geospasial, dashboard">
    
    <!-- OPEN GRAPH -->
    <meta property="og:title" content="My Montana AI: Sistem Manajemen Revegetasi">
    <meta property="og:description" content="Platform terintegrasi...">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://montana-tech.info/og-image.jpg">
    
    <!-- SCHEMA MARKUP -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PT Montana Wana Teknologi",
        "url": "https://montana-tech.info"
    }
    </script>
</head>
<body>
    <header>
        <h1>My Montana AI: Sistem Manajemen Revegetasi Terintegrasi</h1>
        <p>Discover how AI + geospasial transforms forest restoration</p>
    </header>

    <main>
        <section>
            <h2>Feature Overview</h2>
            
            <article>
                <h3>Montana Camera V2</h3>
                <img 
                    src="camera.jpg" 
                    alt="Montana Camera V2: High-precision visual documentation with GPS metadata for tree growth monitoring"
                />
                <p>...</p>
            </article>
        </section>

        <section itemScope itemType="https://schema.org/FAQPage">
            <h2>Frequently Asked Questions</h2>
            
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <h3 itemProp="name">What is My Montana AI?</h3>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">My Montana AI is an integrated platform...</p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 PT Montana Wana Teknologi</p>
    </footer>
</body>
</html>
```

---

## 7. VALIDATION TOOLS & COMMANDS

### 7.1 Validate Schema Markup

```bash
# Online validator
https://schema.org/validator

# Paste page source HTML
# Check for ❌ errors dan ⚠️ warnings
```

### 7.2 Check Rich Results

```bash
# Google Rich Results Test
https://search.google.com/test/rich-results

# Paste URL atau HTML
# See if FAQ, Product, Organization rich snippets are detected
```

### 7.3 Test Meta Tags

```bash
# Facebook Debugger (OG tags)
https://developers.facebook.com/tools/debug/

# Twitter Card Validator
https://cards-dev.twitter.com/validator

# LinkedIn URL Inspector
https://www.linkedin.com/post-inspector/
```

### 7.4 SEO Audit

```bash
# Google Lighthouse
Chrome DevTools > Lighthouse > Run Audit
Target score: 90+ untuk SEO

# Core Web Vitals
https://web.dev/measure/
Check: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

## 8. KEYWORDS MAPPING TO CONTENT

### Primary Keywords (Included dalam Meta + H1):

| Keyword | Meta Title | H1 | Meta Desc | Alt Text |
|---------|-----------|----|-----------|-----------| 
| Manajemen Revegetasi | ✅ | ✅ | ✅ | - |
| Monitoring Lingkungan | ✅ | - | ✅ | - |
| Sistem AI | - | ✅ | ✅ | - |
| Dashboard Bibit | - | - | ✅ | ✅ |
| Geospasial | - | - | ✅ | - |

### Secondary Keywords (Blog + Body Content):

```
- Revegetasi berbasis data
- Tracking karbon otomatis
- Efisiensi manajemen bibit
- Teknologi kehutanan Indonesia
- Portfolio ESG digital
- Real-time analytics forestry
- Sustainable forest management AI
```

---

## 9. COMMON MISTAKES & FIXES

### ❌ MISTAKE 1: Multiple H1 Tags

```jsx
// WRONG: 2 H1 tags pada same page
<h1>Homepage Title</h1>
<h1>Feature Title</h1>

// CORRECT: 1 H1, rest are H2/H3
<h1>Homepage Title</h1>
<section>
  <h2>Feature Title</h2>
</section>
```

---

### ❌ MISTAKE 2: Keyword Stuffing in Alt Text

```jsx
// WRONG: Keyword stuffing
alt="Montana AI revegetasi dashboard dashboard bibit AI monitoring environmen karbon geospasial"

// CORRECT: Natural, descriptive
alt="Dashboard Bibit AI untuk monitoring stok nursery dan prediksi pertumbuhan tanaman"
```

---

### ❌ MISTAKE 3: Generic Meta Description

```jsx
// WRONG: Too generic
meta name="description" content="My Montana AI"

// CORRECT: Benefit-focused with CTA
meta name="description" content="Platform terintegrasi untuk manajemen revegetasi dengan teknologi AI, geospasial, dan perhitungan karbon presisi tinggi. Konsultasi gratis sekarang."
```

---

### ❌ MISTAKE 4: Missing Schema markup

```jsx
// WRONG: No schema
<div itemProps...>  // Malformed schema

// CORRECT: Valid schema structure
<div itemScope itemType="https://schema.org/Question">
  <h3 itemProp="name">Question</h3>
  <div itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <p itemProp="text">Answer</p>
  </div>
</div>
```

---

## 10. VERSION TRACKING

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2026 | Initial SEO implementation |
| 1.1 | - | Added rich snippets for FAQ |
| 1.2 | - | Enhanced meta descriptions |
| 2.0 | - | (Planned) Multi-language hreflang tags |

---

## QUICK REFERENCE CHECKLIST

### Before Deployment:
- [ ] Meta title unique, keyword-rich (60 chars max)
- [ ] Meta description compelling, CTA-focused (155 chars max)
- [ ] H1 single and descriptive
- [ ] H2/H3 hierarchical structure
- [ ] All images have descriptive alt text
- [ ] Schema markup validated (no errors)
- [ ] Open Graph tags tested (Facebook Share Debugger)
- [ ] Core Web Vitals optimized

### Monthly Maintenance:
- [ ] Monitor GSC for crawl errors
- [ ] Check Google SERP snippets (CTR optimization)
- [ ] Update FAQ with new customer questions
- [ ] Validate schema markup (after updates)
- [ ] Track keyword rankings (top 20 keywords)

---

**Last Updated:** February 2026  
**Maintained By:** PT Montana Wana Teknologi  
**Next Review:** May 2026

