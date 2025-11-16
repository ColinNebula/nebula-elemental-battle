# Deployment Guide

This guide covers deploying Nebula Elemental Battle to various platforms.

## Pre-Deployment Checklist

### 1. Security Audit
```bash
# Run security checks
npm run security:audit
npm run security:fix

# Verify no secrets in code
git log --all --full-history --source -- **/*.env
```

### 2. Environment Configuration
```bash
# Copy and configure production environment
cp .env.example .env.production

# Set production variables
NODE_ENV=production
REACT_APP_DEBUG_MODE=false
GENERATE_SOURCEMAP=false
```

### 3. Build Optimization
```bash
# Clean build
npm run clean

# Production build
npm run build:production

# Analyze bundle size
npm run build:analyze
```

### 4. Test Production Build
```bash
# Install serve globally
npm install -g serve

# Test production build locally
serve -s build -l 3000
```

---

## GitHub Pages Deployment

### Automatic Deployment

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/nebula-elemental-battle"
   }
   ```

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push origin main
   ```

### Manual Deployment
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

---

## Netlify Deployment

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment

1. **Build the app:**
   ```bash
   npm run build:production
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod --dir=build
   ```

3. **Configure Environment Variables:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add production environment variables
   - Enable HTTPS
   - Configure custom domain (optional)

### netlify.toml Configuration
```toml
[build]
  command = "npm run build:production"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### vercel.json Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:production

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Security headers
RUN echo 'add_header X-Frame-Options "DENY" always;' >> /etc/nginx/conf.d/security-headers.conf && \
    echo 'add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/conf.d/security-headers.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    include /etc/nginx/conf.d/security-headers.conf;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Deploy with Docker
```bash
# Build image
docker build -t nebula-elemental-battle .

# Run container
docker run -d -p 8080:80 --name nebula-game nebula-elemental-battle

# Or use Docker Compose
docker-compose up -d
```

---

## AWS S3 + CloudFront

### S3 Static Hosting

```bash
# Build
npm run build:production

# Sync to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Configure bucket for website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

### CloudFront Distribution

1. Create CloudFront distribution pointing to S3 bucket
2. Configure HTTPS certificate
3. Set custom error pages (404 → /index.html for SPA)
4. Enable compression
5. Configure cache behaviors

---

## Performance Optimization

### Build Size Optimization

```bash
# Analyze bundle
npm run build:analyze

# Remove unused dependencies
npm prune

# Update dependencies
npm update
```

### Code Splitting
- Routes already split by default with React.lazy
- Consider splitting large components
- Use dynamic imports for heavy libraries

### Asset Optimization
- Compress images (use tools like imagemin)
- Use WebP format with fallbacks
- Lazy load images
- Optimize SVGs

### Caching Strategy
```javascript
// service-worker.js already configured for PWA
// Cache static assets aggressively
// Network-first for API calls
```

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Test all game features
- [ ] Check responsive design
- [ ] Test PWA installation
- [ ] Verify analytics (if configured)
- [ ] Test on multiple browsers

### 2. Monitor Performance
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Track Core Web Vitals
- [ ] Monitor bundle size

### 3. Security
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Set up CORS properly
- [ ] Enable rate limiting (if using API)

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or redeploy previous version
git checkout <previous-commit>
npm run deploy
```

---

## Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test locally with production build
4. Review platform-specific documentation
5. Open an issue on GitHub

---

## Environment Variables Reference

See `.env.example` for full list of available configuration options.

**Required:**
- `NODE_ENV=production`
- `REACT_APP_MOCK_BACKEND=true` (or configure backend URL)

**Recommended:**
- `GENERATE_SOURCEMAP=false` (security)
- `REACT_APP_DEBUG_MODE=false` (performance)
- `REACT_APP_ENABLE_SECURITY_HEADERS=true`
