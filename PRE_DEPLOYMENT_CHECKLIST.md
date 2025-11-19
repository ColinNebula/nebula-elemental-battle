# 🚀 GitHub Deployment Checklist

## ✅ Pre-Commit Security Checklist

### Environment & Secrets
- [x] `.env` is in `.gitignore`
- [x] No API keys or tokens in source code
- [x] No hardcoded credentials
- [x] `.env.example` created with safe defaults
- [x] Personal donation links removed from `.env`

### Code Security
- [x] No `console.log` with sensitive data
- [x] Error messages don't expose internals
- [x] Input validation implemented
- [x] XSS protection via React sanitization
- [x] No `eval()` or dangerous functions

### Dependencies
- [ ] Run `npm audit` and fix vulnerabilities
- [x] Dependabot configured (`.github/dependabot.yml`)
- [ ] All dependencies up to date
- [ ] No deprecated packages

### Build Configuration
- [x] Source maps disabled (`GENERATE_SOURCEMAP=false`)
- [x] Debug mode disabled in production
- [x] Security headers enabled
- [x] PWA configured properly

## 📦 Repository Setup

### Files to Verify
- [x] `.gitignore` - comprehensive and secure
- [x] `.env.example` - clean template without secrets
- [x] `README.md` - up to date
- [x] `LICENSE` - present
- [x] `.github/SECURITY.md` - security policy
- [x] `package.json` - correct homepage URL

### Git Hygiene
- [ ] No large files in history (use `git-filter-repo` if needed)
- [ ] No committed `.env` files in history
- [ ] No sensitive data in commit messages
- [ ] Clean commit history

## 🏗️ Build & Deploy

### Local Testing
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Security audit
npm audit
npm audit fix

# 3. Test build
npm run build

# 4. Test production build locally
npx serve -s build
```

### GitHub Pages Setup
```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Verify package.json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

# 3. Deploy
npm run deploy
```

### Post-Deploy Verification
- [ ] App loads correctly on GitHub Pages
- [ ] No console errors
- [ ] All features working
- [ ] PWA installable
- [ ] Mobile responsive
- [ ] Assets loading from correct paths

## 🔒 Security Final Check

### Before Pushing to GitHub
```bash
# Check for secrets in staged files
git diff --cached | grep -i "password\|secret\|key\|token"

# Verify .env is not staged
git status | grep ".env"

# Check file sizes
git ls-files | xargs ls -lh | sort -k5 -h -r | head -20
```

### Environment Variables Check
- [x] `.env` exists locally
- [x] `.env` is in `.gitignore`
- [x] `.env.example` committed (no secrets)
- [x] All required vars documented

## 📝 Documentation

### Files to Update Before Push
- [ ] `README.md` - Update URLs and instructions
- [ ] `package.json` - Correct repository URL
- [ ] `DEPLOYMENT.md` - Deployment instructions
- [ ] Remove personal info from example configs

## 🎯 Final Commands

```bash
# 1. Stage files (verify each)
git add .

# 2. Check what's being committed
git status
git diff --cached

# 3. Verify no secrets
grep -r "password\|secret\|api_key\|token" --exclude-dir=node_modules --exclude-dir=.git --exclude=*.md

# 4. Commit
git commit -m "Secure app for deployment"

# 5. Push to GitHub
git push origin main

# 6. Deploy to GitHub Pages
npm run deploy
```

## 🚨 Emergency: Remove Sensitive Data

If you accidentally committed secrets:

```bash
# 1. Install git-filter-repo (recommended) or BFG Repo Cleaner
brew install git-filter-repo  # macOS
# or download from: https://github.com/newren/git-filter-repo

# 2. Remove file from history
git filter-repo --path path/to/secret/file --invert-paths

# 3. Force push (THIS REWRITES HISTORY)
git push origin --force --all

# 4. Rotate ALL compromised credentials immediately
```

## ✨ Post-Deployment

### Monitor & Maintain
- [ ] Enable GitHub Dependabot alerts
- [ ] Set up GitHub Actions for CI/CD
- [ ] Monitor analytics (if configured)
- [ ] Regular security audits (`npm audit`)
- [ ] Keep dependencies updated

### Share Your Project
- [ ] Add topics to GitHub repository
- [ ] Create social media preview image
- [ ] Write deployment blog post
- [ ] Share on gaming communities

## 📊 Build Size Optimization

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Size Targets
- Total JS: < 500KB (gzipped)
- Total CSS: < 100KB (gzipped)
- Images: < 200KB each (use WebP)
- Audio: Use compressed MP3 (< 5MB each)

## 🎮 Game-Specific Checks

- [x] All AI personalities working
- [x] Story mode progression saves correctly
- [x] Inventory system persists
- [x] Theme shop functional
- [x] Achievements tracking
- [x] Mobile controls responsive
- [x] Landscape mode supported
- [x] Sound effects load correctly
- [x] Music plays without errors

---

## Quick Reference

### Safe to Commit
✅ Source code (.js, .jsx, .css)
✅ Configuration templates (.env.example)
✅ Documentation (.md files)
✅ Public assets (images, sounds in /public)
✅ Package configuration (package.json)
✅ Git configuration (.gitignore, .gitattributes)

### NEVER Commit
❌ .env files
❌ API keys or tokens
❌ Private keys (.pem, .key)
❌ Credentials or passwords
❌ node_modules/
❌ Build artifacts (unless deploying)
❌ Personal information
❌ Large binary files (> 10MB)

---

**Last Updated**: November 2025
**App Version**: 2.0.0
