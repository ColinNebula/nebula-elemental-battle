# 🔒 GitHub Security & Deployment Checklist

## ✅ Pre-Commit Security Checks

### 1. Environment Variables & Secrets
- [x] `.env` file is in `.gitignore`
- [x] `.env.example` template provided (no real secrets)
- [x] No API keys, tokens, or passwords in code
- [x] No hardcoded credentials in source files
- [x] Sensitive config uses environment variables

**Action Required:** 
```bash
# Verify no .env in git
git ls-files | grep -E "^\.env$"
# Should return nothing

# Check for potential secrets
git grep -i "password\|secret\|api_key\|token" -- '*.js' '*.json' | grep -v "REACT_APP"
```

### 2. Large Files Check
**Current Status:** 
- ⚠️ **WARNING:** 103MB of MP3 audio files in `/public` folder
- GitHub has a 100MB single file size limit
- Repository size limit: 5GB recommended

**Large Files Detected:**
- `Burnt_Out_Space_Hulk.mp3` - 13.40 MB
- `Battle_of_the_Pixelated_Cyborgs.mp3` - 11.48 MB  
- `When_You_Risk_it_All.mp3` - 10.19 MB
- `Sunrise_in_Megalopolis.mp3` - 9.00 MB

**Recommended Solutions:**

#### Option A: Keep Files (Simplest)
✅ All files are under 100MB individual limit
✅ Total repo size acceptable for GitHub
- No action needed for initial push

#### Option B: Use Git LFS (Better for collaboration)
```bash
# Install Git LFS
git lfs install

# Track large MP3 files
git lfs track "*.mp3"
git lfs track "public/*.mp3"

# Migrate existing files to LFS
git lfs migrate import --include="*.mp3" --everything

# Commit LFS configuration
git add .gitattributes
git commit -m "Configure Git LFS for audio files"
```

#### Option C: Use CDN (Production best practice)
- Upload MP3s to CDN (Cloudflare, AWS S3, etc.)
- Update paths in code to reference CDN URLs
- Remove MP3 files from repository
- Add to `.gitignore`: `public/*.mp3`

### 3. Sensitive File Patterns

**Protected in `.gitignore`:**
```
✅ .env and variants
✅ *.key, *.pem, *.crt (certificates)
✅ id_rsa*, private*.key (SSH keys)
✅ *-credentials.json
✅ *.db, *.sqlite (databases)
✅ node_modules/
✅ /build directory
```

### 4. Code Security Scan

**Check for:**
```bash
# API keys or tokens in code
grep -r "sk-\|pk-\|AIza\|ghp_\|gho_" --include="*.js" --include="*.json" .

# Hardcoded passwords
grep -ri "password.*=.*['\"]" --include="*.js" .

# Database connection strings
grep -ri "mongodb://\|mysql://\|postgres://" --include="*.js" .

# IP addresses (may indicate hardcoded servers)
grep -r "[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}" --include="*.js" .
```

### 5. GitHub Security Features

**Enable on GitHub Repository:**
- [ ] Dependabot alerts (automated security updates)
- [ ] Secret scanning
- [ ] Code scanning (GitHub Advanced Security)
- [ ] Branch protection rules
- [ ] Require signed commits (optional)

**Setup Instructions:**
1. Go to repository Settings → Security & analysis
2. Enable "Dependency graph"
3. Enable "Dependabot alerts"
4. Enable "Dependabot security updates"
5. Enable "Secret scanning"

## 📋 Pre-Push Checklist

```bash
# 1. Check git status
git status

# 2. Verify no sensitive files staged
git status | grep -E "\.env$|\.key$|\.pem$|credentials"

# 3. Check for large files
git ls-files | xargs -I {} ls -lh {} | awk '$5 ~ /M$/ && $5+0 > 50'

# 4. Review all changes
git diff --cached

# 5. Check commit history for secrets (before first push)
git log --all --full-history -- .env

# 6. Verify .gitignore is working
git check-ignore -v .env
# Should output: .gitignore:1:.env    .env
```

## 🚀 Safe First Push

```bash
# 1. Add all files
git add .

# 2. Verify what will be committed
git status

# 3. Commit with descriptive message
git commit -m "Initial commit: Elemental Battle Card Game"

# 4. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/nebula-elemental-battle.git

# 5. Push to GitHub
git push -u origin main

# OR if using master branch
git push -u origin master
```

## 🛡️ Post-Push Security

### Immediately After First Push:

1. **Verify No Secrets Exposed:**
   - Visit: `https://github.com/YOUR_USERNAME/nebula-elemental-battle`
   - Search for: `.env`, `password`, `secret`, `api_key`
   - Should find no actual credentials

2. **Enable Branch Protection:**
   - Settings → Branches → Add rule
   - Branch name pattern: `main` or `master`
   - Check: "Require pull request reviews"
   - Check: "Require status checks to pass"

3. **Add Security Policy:**
   - Create `SECURITY.md` file
   - Document security vulnerability reporting

4. **Review Security Alerts:**
   - Check Security tab for any alerts
   - Address Dependabot alerts immediately

## 🔍 Ongoing Security Maintenance

### Weekly:
- [ ] Check Dependabot alerts
- [ ] Review security advisories
- [ ] Update dependencies: `npm audit fix`

### Monthly:
- [ ] Full dependency audit: `npm audit`
- [ ] Review access logs (Settings → Security)
- [ ] Rotate any exposed credentials

### Before Each Release:
- [ ] Run security scan: `npm audit --production`
- [ ] Test with `REACT_APP_DEBUG_MODE=false`
- [ ] Verify `.env` not in build output
- [ ] Check bundle size: `npm run build`

## 🚨 Emergency: Secret Exposed

If you accidentally commit a secret:

```bash
# 1. IMMEDIATELY rotate/revoke the exposed credential

# 2. Remove from git history (CAREFUL!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (WARNING: destructive)
git push origin --force --all

# 4. Notify GitHub support
# 5. Enable secret scanning alerts
```

**Better approach:** Use BFG Repo-Cleaner:
```bash
# Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

## 📚 Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Git LFS Documentation](https://git-lfs.github.com/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## ✅ Final Verification

Before making repository public:

```bash
# Run this comprehensive check
echo "=== Git Status ===" && git status
echo "\n=== Checking for .env files ===" && git ls-files | grep "\.env"
echo "\n=== Checking for large files ===" && git ls-files | xargs ls -lh | awk '$5 ~ /M/ {print $5, $9}' | sort -h
echo "\n=== Checking for secrets ===" && git log --all --full-history -- **/*secret* **/*key* **/*password* 2>/dev/null | head -5
echo "\n✅ If no issues above, safe to push!"
```

---

**Last Updated:** 2025-11-22  
**Repository:** Nebula Elemental Battle  
**Security Contact:** [Add your email or security policy link]
