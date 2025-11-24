# 🚀 GitHub Deployment Guide

Complete guide for deploying Nebula Elemental Battle to GitHub and GitHub Pages.

## 📋 Pre-Deployment Checklist

### 1. Security & Privacy ✅

- [x] No API keys or secrets in code
- [x] `.env` files in `.gitignore`
- [x] Sensitive data excluded
- [x] `.gitignore` properly configured
- [x] No credentials in commit history

### 2. Asset Optimization 🎨

Run optimization before deploying to reduce repository size:

```powershell
# Check current sizes
npm run github:prepare

# Optimize images and audio
npm run github:optimize

# Or manually optimize specific types
.\scripts\optimize-for-github.ps1 -Images
.\scripts\optimize-for-github.ps1 -Audio
```

**Current Status:**
- Public folder: ~149 MB
- Recommended: < 100 MB
- Run optimization to reduce size by 30-50%

### 3. Code Quality ✅

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Run tests
npm test -- --watchAll=false

# Check security
npm run security:audit
```

### 4. Build Verification ✅

```bash
# Test production build
npm run build:production

# Analyze bundle size
npm run build:analyze
```

---

## 🔧 Initial Setup

### 1. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Nebula Elemental Battle v2.0.0"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository: `nebula-elemental-battle`
3. **Do NOT** initialize with README (we already have one)
4. Leave it empty

### 3. Connect Local to GitHub

```bash
# Add GitHub as remote
git remote add origin https://github.com/YourUsername/nebula-elemental-battle.git

# Or with SSH
git remote add origin git@github.com:YourUsername/nebula-elemental-battle.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 GitHub Pages Deployment

### Option 1: Automated Deployment (Recommended)

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Build production version
2. Create/update `gh-pages` branch
3. Deploy to GitHub Pages
4. Available at: `https://yourusername.github.io/nebula-elemental-battle`

### Option 2: Manual Deployment

```bash
# Build production version
npm run build:production

# Deploy to gh-pages branch
npx gh-pages -d build
```

### Option 3: GitHub Actions (Automated on Push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build:production
      env:
        CI: false
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        cname: your-custom-domain.com  # Optional
```

---

## ⚙️ GitHub Pages Configuration

### 1. Enable GitHub Pages

1. Go to repository **Settings**
2. Navigate to **Pages** section
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

### 2. Custom Domain (Optional)

If you have a custom domain:

1. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: game (or @)
   Value: yourusername.github.io
   ```

2. In repository settings → Pages:
   - Enter custom domain
   - Enable **Enforce HTTPS**

### 3. Update package.json

Ensure correct homepage in `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/nebula-elemental-battle"
}
```

---

## 📦 Repository Size Optimization

### Current Sizes
- **Source code**: ~5 MB
- **Public assets**: ~149 MB
- **node_modules**: Ignored
- **Build output**: ~134 MB (not committed)

### Recommendations

1. **Optimize Images** (Save ~40-60 MB)
   ```bash
   npm run github:optimize
   ```

2. **Compress Audio** (Save ~20-30 MB)
   - MP3 files are large (4-5 MB each)
   - Consider 128kbps instead of 320kbps
   - Use streaming for music instead of bundling

3. **Use Git LFS** for large files
   ```bash
   git lfs install
   git lfs track "*.mp3"
   git lfs track "*.png"
   git add .gitattributes
   ```

4. **Use CDN** for assets
   - Upload images to image CDN (Cloudinary, imgix)
   - Upload audio to audio CDN
   - Reference URLs instead of bundling

---

## 🔒 Security Best Practices

### Files to NEVER Commit

✅ **Already in .gitignore:**
- `.env`, `.env.local`, `.env.*.local`
- `node_modules/`
- API keys and secrets
- Private keys and certificates
- Database files

### Before Each Commit

```bash
# Check for sensitive data
npm run security:check

# Review what will be committed
git diff --staged

# Check for accidentally staged files
git status
```

### Verify No Secrets in History

```bash
# Search for patterns in history
git log --all --full-history --source -- "*password*"
git log --all --full-history --source -- "*secret*"
git log --all --full-history --source -- "*.env"
```

---

## 🚦 Deployment Workflow

### Standard Workflow

```bash
# 1. Check status
git status

# 2. Run preparation script
npm run github:prepare

# 3. Add changes
git add .

# 4. Commit with meaningful message
git commit -m "feat: Add fusion animation enhancements"

# 5. Push to GitHub
git push origin main

# 6. Deploy to GitHub Pages
npm run deploy
```

### Full Deployment (with optimization)

```bash
# 1. Optimize assets
npm run github:optimize

# 2. Run all checks
npm run github:check

# 3. Build production
npm run build:production

# 4. Commit changes
git add .
git commit -m "chore: Optimize assets for deployment"
git push origin main

# 5. Deploy
npm run deploy
```

---

## 📊 Build Size Analysis

### Check Bundle Size

```bash
# Build and analyze
npm run build:analyze
```

### Current Bundle Stats
- **Main bundle**: 486 KB (137 KB gzipped)
- **Code splitting**: 23 lazy-loaded chunks
- **Initial load**: ~137 KB
- **Total build**: ~134 MB (includes all assets)

### Optimization Targets
- ✅ JS bundle < 500 KB (achieved: 486 KB)
- ⚠️  Total assets < 100 MB (current: 149 MB)
- ✅ Lazy loading implemented
- ✅ Code splitting enabled

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Deployment 404 Error

1. Check `homepage` in `package.json` matches repo name
2. Ensure `gh-pages` branch exists
3. Check GitHub Pages settings

### Assets Not Loading

1. Verify `PUBLIC_URL` environment variable
2. Check paths use `process.env.PUBLIC_URL`
3. Ensure assets are in `public/` folder

### Git Push Rejected (Too Large)

```bash
# Check repository size
git count-objects -vH

# If too large, use Git LFS
git lfs install
git lfs track "*.mp3" "*.png"
git add .gitattributes
git commit -m "Add Git LFS"
git push
```

---

## 📈 Post-Deployment

### 1. Verify Deployment

- Visit: `https://yourusername.github.io/nebula-elemental-battle`
- Test all features work
- Check console for errors
- Test on mobile devices

### 2. Set Up Monitoring

- Enable GitHub repository insights
- Add Google Analytics (optional)
- Monitor bundle size over time

### 3. Add Badges to README

```markdown
![Build Status](https://github.com/yourusername/nebula-elemental-battle/workflows/Deploy/badge.svg)
![License](https://img.shields.io/github/license/yourusername/nebula-elemental-battle)
![Size](https://img.shields.io/github/repo-size/yourusername/nebula-elemental-battle)
```

---

## 🎯 Quick Commands Reference

```bash
# Preparation
npm run github:prepare      # Run all checks
npm run github:optimize     # Optimize assets
npm run github:check        # Security & tests

# Development
npm start                   # Local development
npm test                    # Run tests
npm run lint                # Check code quality

# Building
npm run build               # Development build
npm run build:production    # Production build
npm run build:analyze       # Analyze bundle

# Deployment
npm run deploy              # Deploy to GitHub Pages
git push origin main        # Push to GitHub

# Maintenance
npm run clean               # Clear cache
npm audit                   # Check vulnerabilities
npm update                  # Update dependencies
```

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)
- [Git LFS Guide](https://git-lfs.github.com/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)

---

## ✅ Deployment Checklist

- [ ] Run `npm run github:prepare`
- [ ] Optimize assets if needed
- [ ] Verify build succeeds
- [ ] No security vulnerabilities
- [ ] All tests passing
- [ ] README.md updated
- [ ] LICENSE file present
- [ ] `.gitignore` configured
- [ ] No sensitive data committed
- [ ] Repository created on GitHub
- [ ] Remote configured
- [ ] Code pushed to main branch
- [ ] GitHub Pages enabled
- [ ] Deployment successful
- [ ] Site accessible and working
- [ ] Mobile-friendly verified

---

**Ready to deploy!** 🚀

Run `npm run github:prepare` to start the deployment process.
