# Generate App Icons from Source Image
# This script generates all required app icon sizes

Write-Host "🎨 App Icon Generator" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$magickInstalled = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickInstalled) {
    Write-Host "❌ ImageMagick is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install ImageMagick to generate icons automatically:" -ForegroundColor Yellow
    Write-Host "  Option 1: choco install imagemagick" -ForegroundColor White
    Write-Host "  Option 2: winget install ImageMagick.ImageMagick" -ForegroundColor White
    Write-Host "  Option 3: Download from https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use an online tool:" -ForegroundColor Yellow
    Write-Host "  https://realfavicongenerator.net/" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ ImageMagick found!" -ForegroundColor Green
Write-Host ""

# Set paths
$publicPath = Join-Path $PSScriptRoot "..\public"
$sourceImage = Join-Path $publicPath "nebulamedia.png"

# Check if source image exists
if (-not (Test-Path $sourceImage)) {
    Write-Host "❌ Source image not found: $sourceImage" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure nebulamedia.png exists in the public folder" -ForegroundColor Yellow
    exit 1
}

Write-Host "📸 Source image: nebulamedia.png" -ForegroundColor Cyan
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Generate all app icon sizes from nebulamedia.png? [y/n]"
if ($confirm -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# Icon sizes to generate
$sizes = @(72, 96, 128, 144, 152, 180, 192, 384, 512)

$generated = 0
$failed = 0

foreach ($size in $sizes) {
    $outputFile = Join-Path $publicPath "logo${size}.png"
    
    Write-Host "Generating ${size}x${size}..." -ForegroundColor Cyan
    
    $result = & magick $sourceImage -resize ${size}x${size} -gravity center -background transparent -extent ${size}x${size} $outputFile 2>&1
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $outputFile)) {
        $fileSize = (Get-Item $outputFile).Length / 1KB
        Write-Host "  ✅ logo${size}.png ($([math]::Round($fileSize, 1)) KB)" -ForegroundColor Green
        $generated++
    } else {
        Write-Host "  ❌ Failed to generate logo${size}.png" -ForegroundColor Red
        $failed++
    }
}

# Generate favicon
Write-Host "Generating favicon.ico..." -ForegroundColor Cyan
$faviconPath = Join-Path $publicPath "favicon.ico"
$result = & magick $sourceImage -resize 32x32 $faviconPath 2>&1

if ($LASTEXITCODE -eq 0 -and (Test-Path $faviconPath)) {
    Write-Host "  ✅ favicon.ico" -ForegroundColor Green
    $generated++
} else {
    Write-Host "  ❌ Failed to generate favicon.ico" -ForegroundColor Red
    $failed++
}

# Generate Apple touch icon
Write-Host "Generating apple-touch-icon.png..." -ForegroundColor Cyan
$applePath = Join-Path $publicPath "apple-touch-icon.png"
$result = & magick $sourceImage -resize 180x180 -gravity center -background transparent -extent 180x180 $applePath 2>&1

if ($LASTEXITCODE -eq 0 -and (Test-Path $applePath)) {
    Write-Host "  ✅ apple-touch-icon.png" -ForegroundColor Green
    $generated++
} else {
    Write-Host "  ❌ Failed to generate apple-touch-icon.png" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "====================" -ForegroundColor Cyan
Write-Host "📊 GENERATION RESULTS" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

Write-Host "✅ Successfully generated: $generated icons" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "❌ Failed: $failed icons" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ Icon generation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the app locally: npm start" -ForegroundColor White
Write-Host "2. Check icons in browser and mobile devices" -ForegroundColor White
Write-Host "3. If satisfied, commit and deploy:" -ForegroundColor White
Write-Host "   git add public/logo*.png public/favicon.ico public/apple-touch-icon.png" -ForegroundColor Cyan
Write-Host "   git commit -m 'Update app icons with Nebula branding'" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor Cyan
