# 🔐 GitHub SSH Setup & Push Guide

## Step 1: Verify SSH Key (✅ Already Done)

Your SSH key already exists:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDNz+f3sF8tujzzz4SA7y3Dra41bjl6ALO2Cg77Ywwy+7DtbinRh/d44hKcJjZRF5lf1v8tpM/iUOwUOWhpiTkKe+GBNyd+Ewh0jft+KS9BMI8yZl0qRP/Y12kdC16HRrpZcq55ATsJDwVWrnYQ2mT6OHDlUU32TO+IMDn1Yd7nuVC5uw4eIV1Y3Os1Rs/gFZp2zYo3HQtjaK5fxDeLReQXLo6Ufvz5LosohQYHk9SL4Q/dfggQtd7oyGE6GNJ1kCvkprRL+LxSKzggmeAKGstnhSEFjRAdFuNTk+NSUfTyWRHAteGRuMUnXkfm5NNpdmaEgp+gC6/i+r9v3iU5lCVR0ymol+3PWgRKm71o50nPMOPiaBMmu7vg64fUGOX/l/thjPhyjPIyWliPAR1JoJs1kDD5cVesp0hYKCa8sJ9Nb8ZJm2NxaKI8ONn+C+NJaNZSvq8JdrU7/XtQlJWsys2ugmA5vsTZ0FQImk7cndhpad1x9GT1JGNP+5ijZPgNb1mvj0MHlUr2tIyFWhOVYMm+XEJ/bhdfbpB8+HXVRtYnM8nBKsA/FqFbBnwxQCGDviWMvyI0wGxbIb6D5568dT/yMUUDV0GtpSa78ikF0xeAEqvdAOMSSMepHHoDZ9LwZcLj4muhX3uOKlMykD7LB5wsXvS+AhpOVwNPcgIPtBz4Hw== colinnebula@hotmail.com
```

Location: `C:\Users\[YOUR_USER]\.ssh\id_rsa.pub`

## Step 2: Add SSH Key to GitHub

### Option A: Copy Key Manually
```powershell
# Copy your SSH key to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub" | Set-Clipboard
Write-Host "SSH key copied to clipboard!" -ForegroundColor Green
```

Then:
1. Go to https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `Windows PC - Elemental Battle`
4. Key type: **Authentication Key**
5. Paste your key (Ctrl+V)
6. Click **"Add SSH key"**

### Option B: Quick Command
```powershell
# Copy key to clipboard
Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub" | Set-Clipboard

# Open GitHub SSH settings
Start-Process "https://github.com/settings/keys"
```

## Step 3: Test SSH Connection

```powershell
# Test GitHub SSH connection
ssh -T git@github.com
```

**Expected output:**
```
Hi YOUR_USERNAME! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see this, SSH is working! ✅

**Troubleshooting:**
- If you get "Permission denied": SSH key not added to GitHub
- If you get "Host key verification": Type `yes` to continue
- If connection times out: Check firewall/network settings

## Step 4: Initialize Git Repository (If Needed)

```powershell
# Check if git is initialized
if (Test-Path ".git") {
    Write-Host "Git already initialized" -ForegroundColor Green
} else {
    Write-Host "Initializing git..." -ForegroundColor Yellow
    git init
    git branch -M main
}
```

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `nebula-elemental-battle`
3. Description: `⚔️ Elemental Battle - Strategic Card Game with AI Opponents`
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we have these)
6. Click **"Create repository"**

## Step 6: Push to GitHub via SSH

### Full Push Sequence:

```powershell
# 1. Check current status
git status

# 2. Stage all files
git add .

# 3. Commit with message
git commit -m "Initial commit: Elemental Battle Card Game

Features:
- Single player with AI opponents
- Multiple difficulty levels and personalities
- Story mode campaign
- Tutorial mode
- Card fusion system
- Status effects and power-ups
- PWA support for offline play
- Comprehensive game statistics"

# 4. Add remote repository via SSH (REPLACE YOUR_USERNAME)
git remote add origin git@github.com:YOUR_USERNAME/nebula-elemental-battle.git

# 5. Verify remote
git remote -v

# 6. Push to GitHub
git push -u origin main
```

### If You Get "Branch Already Exists" Error:

```powershell
# Force push (first time only)
git push -u origin main --force
```

## Step 7: Verify Push Successful

1. Visit: `https://github.com/YOUR_USERNAME/nebula-elemental-battle`
2. Check files are visible
3. Verify README displays correctly
4. Check repository size (~103MB due to audio)

## Quick Reference Commands

### One-Line Push Setup:
```powershell
git add . ; git commit -m "Initial commit: Elemental Battle Card Game" ; git remote add origin git@github.com:YOUR_USERNAME/nebula-elemental-battle.git ; git push -u origin main
```

### Update Remote to SSH (if already using HTTPS):
```powershell
# Check current remote
git remote -v

# Change from HTTPS to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/nebula-elemental-battle.git

# Verify
git remote -v
```

### Future Pushes:
```powershell
git add .
git commit -m "Your commit message"
git push
```

## Common Issues & Solutions

### Issue: "Could not resolve hostname github.com"
**Solution:** Check internet connection or DNS settings

### Issue: "Permission denied (publickey)"
**Solution:** SSH key not added to GitHub or wrong key
```powershell
# Re-copy key
Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub" | Set-Clipboard
# Add to GitHub: https://github.com/settings/keys
```

### Issue: "Repository not found"
**Solution:** 
- Repository name might be wrong
- Repository might not exist yet
- You might not have access

### Issue: "Failed to push some refs"
**Solution:** Pull first or force push (if first push)
```powershell
git pull origin main --rebase
# OR for first push
git push -u origin main --force
```

### Issue: "ssh: connect to host github.com port 22: Connection timed out"
**Solution:** Try SSH over HTTPS port
```powershell
# Edit ~/.ssh/config
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
@"
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
"@ | Out-File -FilePath "$env:USERPROFILE\.ssh\config" -Encoding ASCII
```

## Security Checklist Before Push

✅ No `.env` files tracked  
✅ No API keys in code  
✅ `.gitignore` configured  
✅ `node_modules/` not tracked  
✅ SSH key protected (never share private key)  

## After First Push

### Enable GitHub Features:
1. **Settings → Pages**
   - Enable GitHub Pages from `main` branch `/` (root)
   - Your game will be live at: `https://YOUR_USERNAME.github.io/nebula-elemental-battle`

2. **Settings → Security**
   - Enable Dependabot alerts
   - Enable Secret scanning
   - Enable Dependency graph

3. **About → Topics**
   - Add topics: `card-game`, `react`, `game`, `pwa`, `javascript`, `elemental`, `ai-game`

### Create Release:
```powershell
# Tag first release
git tag -a v1.0.0 -m "Initial release: Elemental Battle v1.0.0"
git push origin v1.0.0
```

## Quick Start Script

Run this after creating your GitHub repository:

```powershell
# Replace YOUR_USERNAME with your GitHub username
$username = "YOUR_USERNAME"
$repo = "nebula-elemental-battle"

Write-Host "🚀 Pushing to GitHub via SSH..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: Elemental Battle Card Game"
git remote add origin "git@github.com:$username/$repo.git"
git push -u origin main

Write-Host "`n✅ Push complete! View at: https://github.com/$username/$repo" -ForegroundColor Green
```

---

**Need Help?**
- GitHub SSH Docs: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Test SSH: `ssh -T git@github.com`
- Generate new key: `ssh-keygen -t ed25519 -C "your_email@example.com"`

**Your SSH Key Email:** colinnebula@hotmail.com
