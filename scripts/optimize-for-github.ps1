# ============================================
# Asset Optimization for GitHub
# ============================================
# Optimizes images and audio files to reduce repository size
# Safe to run multiple times - creates backups before optimization

param(
    [switch]$Images,
    [switch]$Audio,
    [switch]$All,
    [switch]$DryRun,
    [switch]$Force
)

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ASSET OPTIMIZATION SCRIPT                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$TotalSaved = 0
$FilesProcessed = 0

# ============================================
# CHECK FOR REQUIRED TOOLS
# ============================================
function Test-Tool {
    param($ToolName, $TestCommand)
    
    Write-Host "  ➤ Checking for $ToolName..." -NoNewline
    try {
        $null = & $TestCommand 2>&1
        Write-Host " ✓ Found" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " ⚠️  Not installed" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "🔧 CHECKING OPTIMIZATION TOOLS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray

$hasImageMagick = Test-Tool "ImageMagick" { magick -version }
$hasFFmpeg = Test-Tool "FFmpeg" { ffmpeg -version }

if (-not $hasImageMagick -and ($Images -or $All)) {
    Write-Host "`n⚠️  ImageMagick not found. Install from: https://imagemagick.org/`n" -ForegroundColor Yellow
}

if (-not $hasFFmpeg -and ($Audio -or $All)) {
    Write-Host "`n⚠️  FFmpeg not found. Install from: https://ffmpeg.org/`n" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# IMAGE OPTIMIZATION
# ============================================
if (($Images -or $All) -and $hasImageMagick) {
    Write-Host "🎨 IMAGE OPTIMIZATION" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    $imageFiles = Get-ChildItem -Path "public" -Include "*.png","*.jpg","*.jpeg" -File -Recurse
    
    Write-Host "  Found $($imageFiles.Count) images to process`n" -ForegroundColor Cyan
    
    foreach ($file in $imageFiles) {
        $originalSize = $file.Length / 1MB
        $fileName = $file.Name
        
        Write-Host "  Processing: $fileName" -NoNewline
        Write-Host " ($([math]::Round($originalSize, 2)) MB)" -ForegroundColor Gray -NoNewline
        
        if ($DryRun) {
            Write-Host " [DRY RUN]" -ForegroundColor Cyan
            continue
        }
        
        # Create backup
        $backupPath = "$($file.FullName).original"
        if (-not (Test-Path $backupPath) -or $Force) {
            Copy-Item $file.FullName $backupPath -Force
        }
        
        # Optimize image (reduce quality to 85%, strip metadata)
        $tempOutput = "$($file.FullName).temp"
        
        try {
            & magick $file.FullName -quality 85 -strip $tempOutput 2>&1 | Out-Null
            
            if (Test-Path $tempOutput) {
                $newSize = (Get-Item $tempOutput).Length / 1MB
                $saved = $originalSize - $newSize
                $savedPercent = [math]::Round(($saved / $originalSize) * 100, 1)
                
                if ($saved -gt 0) {
                    Move-Item $tempOutput $file.FullName -Force
                    Write-Host " → $([math]::Round($newSize, 2)) MB" -ForegroundColor Green -NoNewline
                    Write-Host " (saved $savedPercent%)" -ForegroundColor Green
                    $TotalSaved += $saved
                    $FilesProcessed++
                } else {
                    Remove-Item $tempOutput -Force
                    Write-Host " → Already optimized" -ForegroundColor Gray
                }
            }
        } catch {
            Write-Host " ❌ Failed" -ForegroundColor Red
            if (Test-Path $tempOutput) { Remove-Item $tempOutput -Force }
        }
    }
    
    Write-Host ""
}

# ============================================
# AUDIO OPTIMIZATION
# ============================================
if (($Audio -or $All) -and $hasFFmpeg) {
    Write-Host "🎵 AUDIO OPTIMIZATION" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray
    
    $audioFiles = Get-ChildItem -Path "public" -Include "*.mp3" -File -Recurse
    
    Write-Host "  Found $($audioFiles.Count) audio files to process`n" -ForegroundColor Cyan
    
    foreach ($file in $audioFiles) {
        $originalSize = $file.Length / 1MB
        $fileName = $file.Name
        
        Write-Host "  Processing: $fileName" -NoNewline
        Write-Host " ($([math]::Round($originalSize, 2)) MB)" -ForegroundColor Gray -NoNewline
        
        if ($DryRun) {
            Write-Host " [DRY RUN]" -ForegroundColor Cyan
            continue
        }
        
        # Create backup
        $backupPath = "$($file.FullName).original"
        if (-not (Test-Path $backupPath) -or $Force) {
            Copy-Item $file.FullName $backupPath -Force
        }
        
        # Optimize audio (convert to 128kbps MP3)
        $tempOutput = "$($file.FullName).temp.mp3"
        
        try {
            & ffmpeg -i $file.FullName -b:a 128k -y $tempOutput 2>&1 | Out-Null
            
            if (Test-Path $tempOutput) {
                $newSize = (Get-Item $tempOutput).Length / 1MB
                $saved = $originalSize - $newSize
                $savedPercent = [math]::Round(($saved / $originalSize) * 100, 1)
                
                if ($saved -gt 0.1) {
                    Move-Item $tempOutput $file.FullName -Force
                    Write-Host " → $([math]::Round($newSize, 2)) MB" -ForegroundColor Green -NoNewline
                    Write-Host " (saved $savedPercent%)" -ForegroundColor Green
                    $TotalSaved += $saved
                    $FilesProcessed++
                } else {
                    Remove-Item $tempOutput -Force
                    Write-Host " → Already optimized" -ForegroundColor Gray
                }
            }
        } catch {
            Write-Host " ❌ Failed" -ForegroundColor Red
            if (Test-Path $tempOutput) { Remove-Item $tempOutput -Force }
        }
    }
    
    Write-Host ""
}

# ============================================
# SUMMARY
# ============================================
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   OPTIMIZATION COMPLETE                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No files were modified`n" -ForegroundColor Cyan
} else {
    Write-Host "📊 RESULTS:" -ForegroundColor Yellow
    Write-Host "   Files processed: $FilesProcessed" -ForegroundColor Cyan
    Write-Host "   Total space saved: $([math]::Round($TotalSaved, 2)) MB`n" -ForegroundColor Green
    
    if ($FilesProcessed -gt 0) {
        Write-Host "💾 Backups created with .original extension" -ForegroundColor Gray
        Write-Host "   To restore: Remove .original extension`n" -ForegroundColor Gray
    }
}

if (-not $Images -and -not $Audio -and -not $All) {
    Write-Host "ℹ️  USAGE:" -ForegroundColor Yellow
    Write-Host "   .\optimize-for-github.ps1 -All          # Optimize everything" -ForegroundColor Gray
    Write-Host "   .\optimize-for-github.ps1 -Images       # Optimize images only" -ForegroundColor Gray
    Write-Host "   .\optimize-for-github.ps1 -Audio        # Optimize audio only" -ForegroundColor Gray
    Write-Host "   .\optimize-for-github.ps1 -All -DryRun  # Test without changes`n" -ForegroundColor Gray
}
