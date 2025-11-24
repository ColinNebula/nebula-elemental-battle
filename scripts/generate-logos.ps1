# ============================================
# Logo Generator for PWA and Browser Icons
# ============================================
# Generates all required icon sizes from source logo

param(
    [string]$SourceLogo = "public/nebula-elemental-battle-logo.png",
    [switch]$DryRun
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " LOGO GENERATOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$hasImageMagick = $null -ne (Get-Command magick -ErrorAction SilentlyContinue)

if (-not $hasImageMagick) {
    Write-Host "ERROR: ImageMagick not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "ImageMagick is required to generate logos." -ForegroundColor Yellow
    Write-Host "Download from: https://imagemagick.org/script/download.php" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation:" -ForegroundColor Yellow
    Write-Host "  1. Restart PowerShell/Terminal" -ForegroundColor Gray
    Write-Host "  2. Run this script again" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Check if source logo exists
if (-not (Test-Path $SourceLogo)) {
    Write-Host "ERROR: Source logo not found at: $SourceLogo" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Source logo: $SourceLogo" -ForegroundColor Green
Write-Host ""

# Define required logo sizes
$logoSizes = @(
    @{Size=16; Name="favicon-16x16.png"; Desc="Browser favicon (small)"},
    @{Size=32; Name="favicon-32x32.png"; Desc="Browser favicon (large)"},
    @{Size=72; Name="logo72.png"; Desc="iOS app icon (non-retina)"},
    @{Size=96; Name="logo96.png"; Desc="Android Chrome"},
    @{Size=128; Name="logo128.png"; Desc="Android Chrome"},
    @{Size=144; Name="logo144.png"; Desc="Windows tile"},
    @{Size=152; Name="logo152.png"; Desc="iOS app icon (retina)"},
    @{Size=180; Name="logo180.png"; Desc="iOS app icon (retina HD)"},
    @{Size=192; Name="logo192.png"; Desc="Android Chrome (standard)"},
    @{Size=384; Name="logo384.png"; Desc="Android Chrome (high-res)"},
    @{Size=512; Name="logo512.png"; Desc="PWA splash screen"}
)

# Also create apple-touch-icon
$specialIcons = @(
    @{Size=180; Name="apple-touch-icon.png"; Desc="Apple touch icon (standard)"}
)

$allIcons = $logoSizes + $specialIcons

Write-Host "Generating $($allIcons.Count) icon sizes..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($icon in $allIcons) {
    $size = $icon.Size
    $name = $icon.Name
    $desc = $icon.Desc
    $output = "public/$name"
    
    Write-Host "[$size x $size] $name" -NoNewline
    Write-Host " - $desc" -ForegroundColor Gray -NoNewline
    
    if ($DryRun) {
        Write-Host " [DRY RUN]" -ForegroundColor Cyan
        continue
    }
    
    try {
        # Generate icon with ImageMagick
        # -resize: Resize to target size
        # -background: Set background color (transparent)
        # -gravity center: Center the image
        # -extent: Ensure exact dimensions
        $null = & magick $SourceLogo `
            -resize "${size}x${size}" `
            -background transparent `
            -gravity center `
            -extent "${size}x${size}" `
            $output 2>&1
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $output)) {
            Write-Host " ✓" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " ✗" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host " ✗ ERROR" -ForegroundColor Red
        $failCount++
    }
}

# Generate favicon.ico (multi-resolution)
Write-Host ""
Write-Host "Generating favicon.ico (multi-resolution)..." -NoNewline

if (-not $DryRun) {
    try {
        $null = & magick $SourceLogo `
            -define icon:auto-resize=16,32,48 `
            public/favicon.ico 2>&1
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path "public/favicon.ico")) {
            Write-Host " ✓" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " ✗" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host " ✗ ERROR" -ForegroundColor Red
        $failCount++
    }
} else {
    Write-Host " [DRY RUN]" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN - No files created" -ForegroundColor Cyan
    Write-Host "Would generate: $($allIcons.Count + 1) icons" -ForegroundColor Gray
} else {
    Write-Host "Successfully generated: $successCount icons" -ForegroundColor Green
    if ($failCount -gt 0) {
        Write-Host "Failed: $failCount icons" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Icons saved to: public/" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify icons in public/ folder" -ForegroundColor White
Write-Host "  2. Test PWA installation" -ForegroundColor White
Write-Host "  3. Check manifest.json references" -ForegroundColor White
Write-Host ""
