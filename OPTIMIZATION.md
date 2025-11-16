# Build Optimization Guide

This guide helps reduce bundle size and improve performance.

## Current Build Stats

After optimization, typical build sizes:
- **Main JS**: ~200-300 KB (gzipped)
- **CSS**: ~20-40 KB (gzipped)
- **Total Assets**: ~500 KB - 1 MB

## Optimization Checklist

### 1. Code Splitting

Already implemented:
- ✅ React.lazy for route-based splitting
- ✅ Dynamic imports for heavy components
- ✅ Separate vendor chunks

### 2. Dependency Optimization

```bash
# Analyze bundle
npm run build:analyze

# Check for duplicate dependencies
npm ls --depth=0

# Remove unused dependencies
npm prune

# Update to latest versions
npm update
```

### 3. Remove Unused Code

```bash
# Check for unused exports (manually)
# Look for unused components in components/
# Remove commented code
# Remove debug console.logs
```

### 4. Asset Optimization

#### Images
```bash
# Use WebP format
# Compress PNG/JPG files
# Use SVG for icons (already done)
# Lazy load images
```

#### Fonts
- Use system fonts when possible
- Subset fonts to include only needed characters
- Use woff2 format

### 5. Build Configuration

Create `.env.production`:
```env
# Disable source maps in production
GENERATE_SOURCEMAP=false

# Minimize bundle
INLINE_RUNTIME_CHUNK=true

# Reduce image inline size limit
IMAGE_INLINE_SIZE_LIMIT=8192
```

### 6. Tree Shaking

Ensure proper tree shaking:
```javascript
// ✅ Good - Named imports
import { useState } from 'react';

// ❌ Bad - Default imports
import React from 'react';
const { useState } = React;
```

### 7. Code Minification

Already configured in react-scripts:
- ✅ Terser for JS minification
- ✅ cssnano for CSS minification
- ✅ HTML minification

## Performance Optimization

### 1. React Optimization

```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 2. Virtual Scrolling

For large lists:
```javascript
// Consider react-window or react-virtualized
// Already minimized in current implementation
```

### 3. Debounce/Throttle

```javascript
// Debounce search inputs
// Throttle scroll handlers
// Already implemented where needed
```

## Bundle Analysis

### Run Analysis

```bash
npm run build:analyze
```

This opens a visual representation of bundle size.

### Key Metrics to Watch

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Lazy Loading

### Current Implementation

```javascript
// Routes are lazy loaded
const MainMenu = React.lazy(() => import('./components/MainMenu'));
const GameBoard = React.lazy(() => import('./components/GameBoard'));

// Heavy utilities
const animations = () => import('./utils/animations');
```

### Additional Opportunities

```javascript
// Lazy load heavy libraries
const Chart = React.lazy(() => import('./components/Chart'));

// Conditionally load features
if (user.isAdmin) {
  const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
}
```

## Caching Strategy

### Service Worker (PWA)

Already configured for:
- Cache static assets
- Offline support
- Background sync

### HTTP Headers

Configure in deployment:
```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location ~* \.(html)$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Network Optimization

### 1. Compression

Enable gzip/brotli:
```javascript
// In nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. HTTP/2

- Use HTTP/2 for multiplexing
- Reduces need for bundling
- Better performance

### 3. CDN

```javascript
// Use CDN for static assets
REACT_APP_CDN_URL=https://cdn.yourdomain.com
```

## Monitoring

### Lighthouse

```bash
# Run Lighthouse audit
npx lighthouse https://your-site.com --view
```

### Web Vitals

Already integrated in app:
```javascript
// src/reportWebVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
```

### Bundle Size Tracking

```bash
# Track bundle size over time
npm run build > build-size.txt
du -sh build/static/js/* >> build-size.txt
```

## Continuous Optimization

### 1. Regular Audits

```bash
# Monthly audits
npm run build:analyze
npm audit
npm outdated
```

### 2. Performance Budget

Set budgets in `package.json`:
```json
{
  "budgets": [
    {
      "type": "bundle",
      "maximumSize": "500kb"
    }
  ]
}
```

### 3. Automated Checks

- GitHub Actions for bundle size
- Fail CI if size increases >10%
- Performance monitoring

## Tips for Contributors

1. **Import carefully:**
   ```javascript
   // ✅ Import only what you need
   import { Button } from './Button';
   
   // ❌ Don't import everything
   import * as Components from './components';
   ```

2. **Avoid large dependencies:**
   - Check bundlephobia.com before adding
   - Consider alternatives
   - Use lighter libraries

3. **Code split heavy features:**
   ```javascript
   // Heavy admin features
   const AdminPanel = React.lazy(() => import('./AdminPanel'));
   ```

4. **Optimize images:**
   - Use appropriate formats
   - Compress before committing
   - Consider lazy loading

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Bundlephobia](https://bundlephobia.com/)

---

**Target Bundle Size:** < 500 KB (gzipped)
**Current Status:** ✅ Optimized
