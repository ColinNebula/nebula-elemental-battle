# Simple Asset Optimization Script
param([switch]$DryRun)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " ASSET OPTIMIZATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalSaved = 0
$filesProcessed = 0

# Check for FFmpeg
$hasFFmpeg = $null -ne (Get-Command ffmpeg -ErrorAction SilentlyContinue)

if (-not $hasFFmpeg) {
    Write-Host "ERROR: FFmpeg not found" -ForegroundColor Red
    Write-Host "Install from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Find MP3 files
$audioFiles = Get-ChildItem -Path "public" -Filter "*.mp3" -File -Recurse

Write-Host "Found $($audioFiles.Count) audio files to optimize" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $audioFiles) {
    $originalSize = $file.Length / 1MB
    $fileName = $file.Name
    
    Write-Host "Processing: $fileName" -NoNewline
    Write-Host " ($([math]::Round($originalSize, 2)) MB)" -ForegroundColor Gray -NoNewline
    
    if ($DryRun) {
        Write-Host " [DRY RUN]" -ForegroundColor Cyan
        continue
    }
    
    # Create backup
    $backupPath = "$($file.FullName).original"
    if (-not (Test-Path $backupPath)) {
        Copy-Item $file.FullName $backupPath -Force
    }
    
    # Optimize to 128kbps
    $tempOutput = "$($file.FullName).temp.mp3"
    
    try {
        $null = & ffmpeg -i $file.FullName -b:a 128k -y $tempOutput 2>&1
        
        if (Test-Path $tempOutput) {
            $newSize = (Get-Item $tempOutput).Length / 1MB
            $saved = $originalSize - $newSize
            
            if ($saved -gt 0.1) {
                Move-Item $tempOutput $file.FullName -Force
                $savedPercent = [math]::Round(($saved / $originalSize) * 100, 1)
                Write-Host " -> $([math]::Round($newSize, 2)) MB" -ForegroundColor Green -NoNewline
                Write-Host " (saved $savedPercent%)" -ForegroundColor Green
                $totalSaved += $saved
                $filesProcessed++
            } else {
                Remove-Item $tempOutput -Force -ErrorAction SilentlyContinue
                Write-Host " -> Already optimized" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        if (Test-Path $tempOutput) {
            Remove-Item $tempOutput -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN - No files modified" -ForegroundColor Cyan
} else {
    Write-Host "Files optimized: $filesProcessed" -ForegroundColor Green
    Write-Host "Space saved: $([math]::Round($totalSaved, 2)) MB" -ForegroundColor Green
    Write-Host ""
    if ($filesProcessed -gt 0) {
        Write-Host "Backups saved with .original extension" -ForegroundColor Gray
    }
}

Write-Host ""
