# Performance Optimization Script
# This script optimizes assets for web deployment

Write-Host "🎯 Starting Asset Optimization..." -ForegroundColor Cyan

# Create optimized directory
$optimizedDir = "public\optimized"
if (-not (Test-Path $optimizedDir)) {
    New-Item -ItemType Directory -Path $optimizedDir -Force | Out-Null
}

Write-Host "`n📊 Current Asset Sizes:" -ForegroundColor Yellow
Get-ChildItem -Path "public" -File | Where-Object {$_.Extension -in ".mp3",".png"} | Sort-Object Length -Descending | Select-Object Name, @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Length / 1MB)}} | Format-Table -AutoSize

# Calculate total size
$totalSize = (Get-ChildItem -Path "public" -File | Where-Object {$_.Extension -in ".mp3",".png"} | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "`n📦 Total Audio + Image Size: $($totalSize.ToString('N2')) MB" -ForegroundColor Cyan

Write-Host "`n💡 Optimization Recommendations:" -ForegroundColor Green
Write-Host "1. Music files: ~100MB - Consider removing or converting to streaming links"
Write-Host "2. Large PNG images can be compressed or converted to WebP"
Write-Host "3. Implement lazy loading for audio files"
Write-Host "4. Use CDN for large assets"

Write-Host "`n🎵 Music Files (Largest):" -ForegroundColor Yellow
Get-ChildItem -Path "public" -Filter "*.mp3" | Sort-Object Length -Descending | Select-Object Name, @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Length / 1MB)}} -First 5 | Format-Table -AutoSize

Write-Host "`n🖼️  Large Image Files:" -ForegroundColor Yellow
Get-ChildItem -Path "public" -Filter "*.png" | Where-Object {$_.Length -gt 1MB} | Sort-Object Length -Descending | Select-Object Name, @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Length / 1MB)}} | Format-Table -AutoSize

Write-Host "`n✅ Optimization Complete!" -ForegroundColor Green
Write-Host "`nTo reduce bundle size significantly:" -ForegroundColor Cyan
Write-Host "  • Move music files to external hosting (saves ~100MB)"
Write-Host "  • Compress PNG images (saves ~10-20MB)"
Write-Host "  • Enable lazy loading for audio (improves initial load)"
Write-Host "  • Use WebP format for images (saves ~30-40%)"
