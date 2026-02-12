# Vercel Deployment Guide

## Problem
When deploying to Vercel, you might encounter a 404: NOT_FOUND error. This is likely due to incorrect project configuration or build settings.

## Solution Steps

### 1. Check Project Structure
Ensure your repository structure is correct. The main files should be at the root level:
```
your-repo/
├── package.json
├── vite.config.ts
├── index.html
├── App.tsx
├── index.tsx
├── index.css
└── ...
```

### 2. Verify Vercel Build Configuration
By default, Vercel should automatically detect your Vite project. However, if you need to customize the settings:

#### Build Command (Optional)
```bash
npm run build
```

#### Output Directory
```
dist
```

#### Install Command (Optional)
```bash
npm install
```

### 3. Environment Variables
If your project requires environment variables (like GEMINI_API_KEY), add them to Vercel:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `GEMINI_API_KEY`: Your API key value

### 4. Check Build Output
After deployment, verify the build output in Vercel:
1. Go to "Deployments" tab
2. Check the "Build" and "Output" sections
3. Ensure the `dist/` folder is correctly generated and contains all necessary files

### 5. Test Locally First
Always test your build locally before deploying:

```bash
# Clean previous build
rm -rf dist

# Build for production
npm run build

# Preview the build
npm run preview
```

### 6. Verify Package.json Scripts
Ensure your package.json has the correct scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 7. Check Vite Configuration
Your vite.config.ts should include:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  }
});
```

## Troubleshooting

### Clear Vercel Cache
If you still have issues:
1. Go to your Vercel dashboard
2. Click "Redeploy"
3. Check "Use existing build cache" to disable cache
4. Click "Redeploy"

### Check Root File Name
Ensure your entry file is named `index.html` and not `index.htm` or other variations.

### Verify DNS Configuration
If you're using a custom domain, ensure your DNS records are correctly pointing to Vercel.

## Successful Deployment Checklist

- [ ] Project builds locally without errors
- [ ] `dist/` folder contains all necessary files
- [ ] Environment variables are correctly set
- [ ] Vercel build logs show no errors
- [ ] Deployed site responds with 200 OK

## Expected Build Output Structure

```
dist/
├── index.html          # Main entry point
├── assets/
│   ├── index-*.css    # Styles
│   └── index-*.js     # JavaScript bundle
├── lite.html          # Lite mode version
└── privacy-policy.html # Privacy policy
```

If you follow these steps, your Vercel deployment should work correctly and the 404 error should be resolved.
