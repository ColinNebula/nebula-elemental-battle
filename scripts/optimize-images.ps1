# Optimize images by converting to WebP format
# Requires cwebp tool from WebP library

param(
    [string]$InputDir = "public",
    [string]$OutputDir = "public/optimized",
    [int]$Quality = 85,
    [switch]$KeepOriginal = $false
)

Write-Host "Image Optimization Tool" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Check if cwebp is available
$cwebpPath = Get-Command cwebp -ErrorAction SilentlyContinue

if (-not $cwebpPath) {
    Write-Host "ERROR: cwebp not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install WebP tools:" -ForegroundColor Yellow
    Write-Host "  Windows: Download from https://developers.google.com/speed/webp/download"
    Write-Host "  Or use Chocolatey: choco install webp"
    Write-Host ""
    Write-Host "Alternatively, use online tools or Squoosh.app" -ForegroundColor Yellow
    exit 1
}

# Create output directory
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# Find all PNG and JPG files
$images = Get-ChildItem -Path $InputDir -Include *.png,*.jpg,*.jpeg -Recurse -File

$totalOriginalSize = 0
$totalOptimizedSize = 0
$convertedCount = 0

Write-Host "Found $($images.Count) images to optimize" -ForegroundColor Yellow
Write-Host ""

foreach ($image in $images) {
    $relativePath = $image.FullName.Substring($InputDir.Length + 1)
    $outputPath = Join-Path $OutputDir ($relativePath -replace '\.(png|jpg|jpeg)$', '.webp')
    $outputFolder = Split-Path $outputPath -Parent
    
    # Create subdirectories if needed
    if (-not (Test-Path $outputFolder)) {
        New-Item -ItemType Directory -Force -Path $outputFolder | Out-Null
    }
    
    Write-Host "Converting: $($image.Name)" -ForegroundColor Gray
    
    # Convert to WebP
    $result = & cwebp -q $Quality "$($image.FullName)" -o "$outputPath" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $originalSize = $image.Length
        $optimizedSize = (Get-Item $outputPath).Length
        $savings = [math]::Round((($originalSize - $optimizedSize) / $originalSize) * 100, 1)
        
        $totalOriginalSize += $originalSize
        $totalOptimizedSize += $optimizedSize
        $convertedCount++
        
        Write-Host "  ✓ Saved $savings% ($([math]::Round($originalSize/1KB, 1)) KB → $([math]::Round($optimizedSize/1KB, 1)) KB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to convert" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Optimization Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files converted: $convertedCount / $($images.Count)" -ForegroundColor Cyan
Write-Host "Original size:   $([math]::Round($totalOriginalSize/1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "Optimized size:  $([math]::Round($totalOptimizedSize/1MB, 2)) MB" -ForegroundColor Green
Write-Host "Total saved:     $([math]::Round(($totalOriginalSize - $totalOptimizedSize)/1MB, 2)) MB ($([math]::Round((($totalOriginalSize - $totalOptimizedSize) / $totalOriginalSize) * 100, 1))%)" -ForegroundColor Green
Write-Host ""

if (-not $KeepOriginal) {
    Write-Host "Tip: Add -KeepOriginal flag to keep original files" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review optimized images in: $OutputDir"
Write-Host "  2. Update image references in your code to use .webp"
Write-Host "  3. Add fallback support for older browsers"
Write-Host ""
