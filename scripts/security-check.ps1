#!/usr/bin/env pwsh
# GitHub Security Pre-Push Verification Script
# Run this before pushing to GitHub

Write-Host "`n🔒 GitHub Security Check - Nebula Elemental Battle`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Check 1: .env files
Write-Host "📋 Checking for exposed .env files..." -ForegroundColor Yellow
$envFiles = git ls-files | Select-String -Pattern "^\.env$"
if ($envFiles) {
    Write-Host "   ❌ ERROR: .env file is tracked by git!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   ✅ No .env files tracked" -ForegroundColor Green
}

# Check 2: .env.example exists
if (Test-Path ".env.example") {
    Write-Host "   ✅ .env.example template exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  WARNING: .env.example not found" -ForegroundColor Yellow
    $warnings++
}

# Check 3: Large files (>50MB)
Write-Host "`n📦 Checking for large files (>50MB)..." -ForegroundColor Yellow
$largeFiles = Get-ChildItem -Path "." -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object { $_.Length -gt 50MB -and $_.FullName -notmatch "node_modules|\.git|build" } |
    Select-Object @{Name="Size";Expression={"{0:N2} MB" -f ($_.Length / 1MB)}}, Name

if ($largeFiles) {
    Write-Host "   ⚠️  WARNING: Large files detected:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object { Write-Host "      - $($_.Name): $($_.Size)" -ForegroundColor Yellow }
    $warnings++
} else {
    Write-Host "   ✅ No files over 50MB" -ForegroundColor Green
}

# Check 4: MP3 file sizes
Write-Host "`n🎵 Checking audio file sizes..." -ForegroundColor Yellow
$totalMp3Size = (Get-ChildItem -Path "public" -Filter "*.mp3" -ErrorAction SilentlyContinue | 
    Measure-Object -Property Length -Sum).Sum / 1MB

if ($totalMp3Size) {
    Write-Host "   ℹ️  Total MP3 size: $($totalMp3Size.ToString('N2')) MB" -ForegroundColor Cyan
    if ($totalMp3Size -gt 100) {
        Write-Host "   ⚠️  WARNING: Consider using Git LFS for audio files" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "   ✅ Total size acceptable" -ForegroundColor Green
    }
}

# Check 5: Potential secrets in code  
Write-Host "`n🔑 Scanning for potential secrets..." -ForegroundColor Yellow
$secretPatterns = @(
    'sk-\w{20,}',
    'pk-\w{20,}',
    'ghp_\w{20,}',
    'gho_\w{20,}',
    'AIza\w{35}'
)

$foundSecrets = $false
foreach ($pattern in $secretPatterns) {
    $matches = Get-ChildItem -Path "src" -Filter "*.js" -Recurse -ErrorAction SilentlyContinue |
        Select-String -Pattern $pattern
    
    if ($matches) {
        if (-not $foundSecrets) {
            Write-Host "   ❌ ERROR: Potential secrets found in code!" -ForegroundColor Red
            $foundSecrets = $true
        }
        $matches | ForEach-Object { 
            Write-Host "      - $($_.Filename):$($_.LineNumber)" -ForegroundColor Red 
        }
        $errors++
    }
}

if (-not $foundSecrets) {
    Write-Host "   ✅ No obvious secrets detected" -ForegroundColor Green
}

# Check 6: Git status
Write-Host "`n📊 Git status check..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    $fileCount = ($gitStatus | Measure-Object).Count
    Write-Host "   ℹ️  $fileCount file(s) with changes" -ForegroundColor Cyan
} else {
    Write-Host "   ✅ Working directory clean" -ForegroundColor Green
}

# Check 7: .gitignore exists
Write-Host "`n🚫 Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $ignoreCount = (Get-Content ".gitignore" | Where-Object { $_ -and $_ -notmatch "^#" }).Count
    Write-Host "   ✅ .gitignore exists with $ignoreCount rules" -ForegroundColor Green
} else {
    Write-Host "   ❌ ERROR: .gitignore not found!" -ForegroundColor Red
    $errors++
}

# Check 8: node_modules not tracked
Write-Host "`n📦 Checking node_modules..." -ForegroundColor Yellow
$nodeModulesTracked = git ls-files | Select-String -Pattern "^node_modules/"
if ($nodeModulesTracked) {
    Write-Host "   ❌ ERROR: node_modules is tracked by git!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "   ✅ node_modules not tracked" -ForegroundColor Green
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "📊 SECURITY CHECK SUMMARY" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "`n✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "   Safe to push to GitHub" -ForegroundColor Green
    Write-Host ""
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "`n⚠️  $warnings WARNING(S) - Review recommended" -ForegroundColor Yellow
    Write-Host "   Safe to push, but consider addressing warnings" -ForegroundColor Yellow
    Write-Host ""
    exit 0
} else {
    Write-Host "`n❌ $errors ERROR(S) FOUND - DO NOT PUSH!" -ForegroundColor Red
    if ($warnings -gt 0) {
        Write-Host "   $warnings WARNING(S) also detected" -ForegroundColor Yellow
    }
    Write-Host "   Fix errors before pushing to GitHub" -ForegroundColor Red
    Write-Host ""
    exit 1
}
