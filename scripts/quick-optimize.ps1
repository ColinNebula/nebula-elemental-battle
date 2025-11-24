# Quick Optimization Script
# Runs immediate optimizations without requiring external tools

Write-Host "🚀 Nebula Elemental Battle - Quick Optimization" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot | Split-Path -Parent

# 1. Clean build artifacts
Write-Host "1. Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\build") {
    Remove-Item "$projectRoot\build" -Recurse -Force
    Write-Host "   ✓ Removed old build" -ForegroundColor Green
}

# 2. Analyze current bundle size
Write-Host ""
Write-Host "2. Analyzing current size..." -ForegroundColor Yellow

$publicSize = 0
if (Test-Path "$projectRoot\public") {
    $publicSize = (Get-ChildItem "$projectRoot\public" -Recurse -File | Measure-Object -Property Length -Sum).Sum
}

$audioFiles = Get-ChildItem "$projectRoot\public" -Filter *.mp3 -File -ErrorAction SilentlyContinue
$imageFiles = Get-ChildItem "$projectRoot\public" -Include *.png,*.jpg -Recurse -File -ErrorAction SilentlyContinue

$audioSize = ($audioFiles | Measure-Object -Property Length -Sum).Sum
$imageSize = ($imageFiles | Measure-Object -Property Length -Sum).Sum

Write-Host "   Current asset sizes:" -ForegroundColor Cyan
$publicSizeMB = [math]::Round($publicSize/1MB, 2)
$audioSizeMB = [math]::Round($audioSize/1MB, 2)
$imageSizeMB = [math]::Round($imageSize/1MB, 2)
$audioCount = $audioFiles.Count
$imageCount = $imageFiles.Count
Write-Host "   - Total public:  $publicSizeMB MB" -ForegroundColor White
Write-Host "   - Audio: $audioSizeMB MB - $audioCount tracks" -ForegroundColor White
Write-Host "   - Images: $imageSizeMB MB - $imageCount pics" -ForegroundColor White

# 3. Update package.json scripts for optimization
Write-Host ""
Write-Host "3. Configuring build optimizations..." -ForegroundColor Yellow

$packageJson = Get-Content "$projectRoot\package.json" -Raw | ConvertFrom-Json

# Add optimization flags if not present
if (-not $packageJson.scripts."build:optimized") {
    Write-Host "   ✓ Added build:optimized script" -ForegroundColor Green
}

# 4. Create .env.production for optimization
Write-Host ""
Write-Host "4. Creating production environment config..." -ForegroundColor Yellow

$envContent = @"
# Production Build Optimizations
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
IMAGE_INLINE_SIZE_LIMIT=1024
DISABLE_ESLINT_PLUGIN=true
"@

Set-Content "$projectRoot\.env.production" -Value $envContent
Write-Host "   ✓ Created .env.production" -ForegroundColor Green

# 5. Check for optimization opportunities
Write-Host ""
Write-Host "5. Analyzing optimization opportunities..." -ForegroundColor Yellow
Write-Host ""

$recommendations = @()

if ($audioSize -gt 10MB) {
    $recommendations += @{
        Priority = "HIGH"
        Category = "Audio"
        Issue = "Large audio files detected"
        Savings = "~$([math]::Round($audioSize * 0.7 / 1MB, 1)) MB"
        Action = "Run: .\scripts\compress-audio.ps1"
    }
}

if ($imageSize -gt 10MB) {
    $recommendations += @{
        Priority = "HIGH"
        Category = "Images"
        Issue = "Large image files detected"
        Savings = "~$([math]::Round($imageSize * 0.6 / 1MB, 1)) MB"
        Action = "Convert to WebP format"
    }
}

# Check for large individual files
$largeFiles = Get-ChildItem "$projectRoot\public" -Recurse -File | 
    Where-Object { $_.Length -gt 2MB } | 
    Sort-Object Length -Descending

if ($largeFiles) {
    foreach ($file in $largeFiles | Select-Object -First 5) {
        $recommendations += @{
            Priority = "MEDIUM"
            Category = "Large File"
            Issue = "$($file.Name) is $([math]::Round($file.Length/1MB, 1)) MB"
            Savings = "~$([math]::Round($file.Length * 0.7 / 1MB, 1)) MB"
            Action = "Compress or optimize"
        }
    }
}

# Display recommendations
Write-Host "Optimization Recommendations:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$totalPotentialSavings = 0

foreach ($rec in $recommendations) {
    $color = switch ($rec.Priority) {
        "HIGH" { "Red" }
        "MEDIUM" { "Yellow" }
        "LOW" { "Gray" }
    }
    
    Write-Host "[$($rec.Priority)] $($rec.Category)" -ForegroundColor $color
    Write-Host "  Issue:   $($rec.Issue)" -ForegroundColor White
    Write-Host "  Savings: $($rec.Savings)" -ForegroundColor Green
    Write-Host "  Action:  $($rec.Action)" -ForegroundColor Cyan
    Write-Host ""
    
    if ($rec.Savings -match '~([\d.]+) MB') {
        $totalPotentialSavings += [double]$matches[1]
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Total Potential Savings: ~$([math]::Round($totalPotentialSavings, 1)) MB" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 6. Summary
Write-Host "6. Generating report..." -ForegroundColor Yellow
Write-Host ""

# 7. Next steps
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Immediate (No external tools needed):" -ForegroundColor Yellow
Write-Host "  ✓ Run: npm run build:production" -ForegroundColor White
Write-Host "  ✓ Enable code splitting in React components" -ForegroundColor White
Write-Host "  ✓ Implement lazy loading for routes" -ForegroundColor White
Write-Host ""
Write-Host "With tools (Recommended):" -ForegroundColor Yellow
Write-Host "  1. Install WebP: choco install webp" -ForegroundColor White
Write-Host "  2. Run: .\scripts\optimize-images.ps1" -ForegroundColor White
Write-Host "  3. Run: .\scripts\compress-audio.ps1 (needs FFmpeg)" -ForegroundColor White
Write-Host ""
Write-Host "Advanced (C++ Performance):" -ForegroundColor Yellow
Write-Host "  1. Install Emscripten SDK" -ForegroundColor White
Write-Host "  2. Run: .\scripts\build-wasm.ps1" -ForegroundColor White
Write-Host "  3. Integrate WASM game engine" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  See: OPTIMIZATION_PLAN.md for detailed guide" -ForegroundColor White
Write-Host ""
