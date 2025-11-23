#!/usr/bin/env pwsh
# Quick GitHub SSH Push Script
# Usage: .\scripts\github-push.ps1 [YOUR_GITHUB_USERNAME]

param(
    [Parameter(Mandatory=$false)]
    [string]$Username = "",
    [string]$RepoName = "nebula-elemental-battle"
)

Write-Host "`n🚀 GitHub SSH Push - Elemental Battle" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan

# Get username if not provided
if ([string]::IsNullOrWhiteSpace($Username)) {
    $Username = Read-Host "`nEnter your GitHub username"
}

# Confirm
Write-Host "`nRepository: git@github.com:$Username/$RepoName.git" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "`n📊 Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    $fileCount = ($status | Measure-Object).Count
    Write-Host "   $fileCount file(s) to commit" -ForegroundColor Cyan
} else {
    Write-Host "   Working directory clean" -ForegroundColor Green
    Write-Host "`n⚠️  No changes to commit. Exiting." -ForegroundColor Yellow
    exit 0
}

# Stage all files
Write-Host "`n📦 Staging files..." -ForegroundColor Yellow
git add .
Write-Host "   ✅ Files staged" -ForegroundColor Green

# Commit
Write-Host "`n💾 Committing..." -ForegroundColor Yellow
$commitMsg = @"
Initial commit: Elemental Battle Card Game

Features:
- Single player with AI opponents
- Multiple difficulty levels and personalities
- Story mode campaign with 12 stages
- Tutorial mode for new players
- Card fusion system
- Status effects and power-ups
- PWA support for offline play
- Comprehensive game statistics
- Enhanced player profile system
"@

git commit -m $commitMsg
Write-Host "   ✅ Committed" -ForegroundColor Green

# Check if remote exists
Write-Host "`n🔗 Checking remote..." -ForegroundColor Yellow
$remoteExists = git remote | Select-String -Pattern "^origin$"

if ($remoteExists) {
    Write-Host "   Remote 'origin' already exists" -ForegroundColor Cyan
    $currentRemote = git remote get-url origin
    Write-Host "   Current: $currentRemote" -ForegroundColor Cyan
    
    $updateRemote = Read-Host "Update to SSH? (y/n)"
    if ($updateRemote -eq 'y') {
        git remote set-url origin "git@github.com:$Username/$RepoName.git"
        Write-Host "   ✅ Remote updated to SSH" -ForegroundColor Green
    }
} else {
    Write-Host "   Adding remote..." -ForegroundColor Cyan
    git remote add origin "git@github.com:$Username/$RepoName.git"
    Write-Host "   ✅ Remote added" -ForegroundColor Green
}

# Verify remote
Write-Host "`n🔍 Verifying remote..." -ForegroundColor Yellow
git remote -v
Write-Host ""

# Test SSH connection
Write-Host "🔐 Testing SSH connection..." -ForegroundColor Yellow
$sshTest = ssh -T git@github.com 2>&1
if ($sshTest -match "successfully authenticated") {
    Write-Host "   ✅ SSH authentication successful" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  SSH test result: $sshTest" -ForegroundColor Yellow
    Write-Host "   If you see 'Permission denied', add your SSH key to GitHub:" -ForegroundColor Yellow
    Write-Host "   https://github.com/settings/keys" -ForegroundColor Cyan
    
    $continuePush = Read-Host "`nContinue with push anyway? (y/n)"
    if ($continuePush -ne 'y') {
        Write-Host "Push cancelled." -ForegroundColor Red
        exit 1
    }
}

# Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes due to audio files (103MB)..." -ForegroundColor Cyan

try {
    git push -u origin main 2>&1 | Tee-Object -Variable pushOutput
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Push successful!" -ForegroundColor Green
        Write-Host "`n🎉 Repository available at:" -ForegroundColor Cyan
        Write-Host "   https://github.com/$Username/$RepoName" -ForegroundColor Green
        
        Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Enable GitHub Pages (Settings → Pages)" -ForegroundColor Yellow
        Write-Host "   2. Enable Dependabot (Settings → Security)" -ForegroundColor Yellow
        Write-Host "   3. Add repository topics for discoverability" -ForegroundColor Yellow
        Write-Host "   4. Create first release (v1.0.0)" -ForegroundColor Yellow
        
        # Open repository in browser
        $openBrowser = Read-Host "`nOpen repository in browser? (y/n)"
        if ($openBrowser -eq 'y') {
            Start-Process "https://github.com/$Username/$RepoName"
        }
    } else {
        Write-Host "`n❌ Push failed!" -ForegroundColor Red
        Write-Host $pushOutput -ForegroundColor Red
        
        if ($pushOutput -match "repository not found") {
            Write-Host "`n💡 The repository doesn't exist yet. Create it first:" -ForegroundColor Yellow
            Write-Host "   https://github.com/new" -ForegroundColor Cyan
            Start-Process "https://github.com/new"
        }
        exit 1
    }
} catch {
    Write-Host "`n❌ Error during push: $_" -ForegroundColor Red
    exit 1
}
