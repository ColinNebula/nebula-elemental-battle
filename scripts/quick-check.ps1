# Quick GitHub Readiness Check
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " GITHUB READINESS CHECK" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$warnings = 0
$errors = 0

# Check for .env files
Write-Host "[1/8] Checking for .env files..." -NoNewline
$envFiles = Get-ChildItem -Filter ".env*" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne ".env.example" }
if ($envFiles) {
    Write-Host " WARNING" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host " OK" -ForegroundColor Green
}

# Check .gitignore
Write-Host "[2/8] Checking .gitignore..." -NoNewline
if (Test-Path ".gitignore") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
    $errors++
}

# Check file sizes
Write-Host "[3/8] Checking public folder size..." -NoNewline
if (Test-Path "public") {
    $size = (Get-ChildItem -Path "public" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
    $sizeRounded = [math]::Round($size, 2)
    if ($size -gt 100) {
        Write-Host " $sizeRounded MB (Consider optimizing)" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host " $sizeRounded MB" -ForegroundColor Green
    }
}

# Check package.json
Write-Host "[4/8] Checking package.json..." -NoNewline
if (Test-Path "package.json") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
    $errors++
}

# Check README
Write-Host "[5/8] Checking README.md..." -NoNewline
if (Test-Path "README.md") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Yellow
    $warnings++
}

# Check LICENSE
Write-Host "[6/8] Checking LICENSE..." -NoNewline
if (Test-Path "LICENSE") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Yellow
    $warnings++
}

# Check git
Write-Host "[7/8] Checking git repository..." -NoNewline
if (Test-Path ".git") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT INITIALIZED" -ForegroundColor Yellow
    $warnings++
}

# Test build
Write-Host "[8/8] Testing build..." -NoNewline
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " FAILED" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " RESULTS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "Status: READY FOR GITHUB" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor Gray
    Write-Host "  2. git commit -m 'Prepare for deployment'" -ForegroundColor Gray
    Write-Host "  3. git push origin main" -ForegroundColor Gray
    Write-Host "  4. npm run deploy" -ForegroundColor Gray
} elseif ($errors -eq 0) {
    Write-Host "Status: READY WITH $warnings WARNING(S)" -ForegroundColor Yellow
    Write-Host "Review warnings before deploying" -ForegroundColor Yellow
} else {
    Write-Host "Status: NOT READY - $errors ERROR(S)" -ForegroundColor Red
    Write-Host "Fix errors before deploying" -ForegroundColor Red
}

Write-Host ""
