# Audio Compression Script for Nebula Elemental Battle
# Compresses MP3 files to reduce file size while maintaining quality

Write-Host "🎵 Audio Compression Tool" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if ffmpeg is installed
$ffmpegInstalled = Get-Command ffmpeg -ErrorAction SilentlyContinue

if (-not $ffmpegInstalled) {
    Write-Host "❌ ffmpeg is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "OPTION 1: Install via Chocolatey (Recommended)" -ForegroundColor Yellow
    Write-Host "  Run: choco install ffmpeg" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 2: Install via winget" -ForegroundColor Yellow
    Write-Host "  Run: winget install ffmpeg" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 3: Manual Download" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://ffmpeg.org/download.html" -ForegroundColor White
    Write-Host "  2. Extract and add to PATH" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing, run this script again." -ForegroundColor Green
    exit 1
}

Write-Host "✅ ffmpeg found!" -ForegroundColor Green
Write-Host ""

# Set paths
$publicPath = Join-Path $PSScriptRoot "..\public"
$backupPath = Join-Path $publicPath "audio-backup"

# Get all MP3 files
$mp3Files = Get-ChildItem -Path $publicPath -Filter "*.mp3"

if ($mp3Files.Count -eq 0) {
    Write-Host "❌ No MP3 files found in public folder!" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($mp3Files.Count) MP3 files" -ForegroundColor Cyan
Write-Host ""

# Calculate original size
$originalSize = ($mp3Files | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "📊 Original total size: $([math]::Round($originalSize, 2)) MB" -ForegroundColor White
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Create backup and compress files? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Create backup directory
if (-not (Test-Path $backupPath)) {
    New-Item -Path $backupPath -ItemType Directory | Out-Null
    Write-Host "✅ Created backup folder" -ForegroundColor Green
}

# Process each file
$compressed = 0
$failed = 0

foreach ($file in $mp3Files) {
    $fileName = $file.Name
    $inputPath = $file.FullName
    $backupFile = Join-Path $backupPath $fileName
    $tempOutput = Join-Path $publicPath "temp_$fileName"
    
    Write-Host "Processing: $fileName" -ForegroundColor Cyan
    
    # Backup original
    Copy-Item -Path $inputPath -Destination $backupFile -Force
    
    # Compress: 96kbps stereo, quality optimized for music
    # This typically reduces size by 50-70% with minimal quality loss
    $ffmpegArgs = @(
        "-i", $inputPath,
        "-codec:a", "libmp3lame",
        "-b:a", "96k",
        "-ac", "2",
        "-ar", "44100",
        "-q:a", "2",
        "-y",
        $tempOutput
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -NoNewWindow -PassThru
    
    if ($process.ExitCode -eq 0 -and (Test-Path $tempOutput)) {
        $originalFileSize = $file.Length / 1MB
        $newFileSize = (Get-Item $tempOutput).Length / 1MB
        $savings = (($originalFileSize - $newFileSize) / $originalFileSize) * 100
        
        # Replace original with compressed
        Move-Item -Path $tempOutput -Destination $inputPath -Force
        
        Write-Host "  ✅ Compressed: $([math]::Round($originalFileSize, 2)) MB → $([math]::Round($newFileSize, 2)) MB (saved $([math]::Round($savings, 1))%)" -ForegroundColor Green
        $compressed++
    } else {
        Write-Host "  ❌ Failed to compress" -ForegroundColor Red
        $failed++
        if (Test-Path $tempOutput) {
            Remove-Item $tempOutput -Force
        }
    }
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "📊 COMPRESSION RESULTS" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Calculate new size
$newMp3Files = Get-ChildItem -Path $publicPath -Filter "*.mp3"
$newSize = ($newMp3Files | Measure-Object -Property Length -Sum).Sum / 1MB
$totalSavings = $originalSize - $newSize
$savingsPercent = ($totalSavings / $originalSize) * 100

Write-Host "✅ Successfully compressed: $compressed files" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "❌ Failed: $failed files" -ForegroundColor Red
}
Write-Host ""
Write-Host "Original size: $([math]::Round($originalSize, 2)) MB" -ForegroundColor White
Write-Host "New size: $([math]::Round($newSize, 2)) MB" -ForegroundColor Green
Write-Host "Total saved: $([math]::Round($totalSavings, 2)) MB ($([math]::Round($savingsPercent, 1))%)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backups stored in: $backupPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Compression complete! Test your game to verify audio quality." -ForegroundColor Green
Write-Host "   If quality is acceptable, you can delete the backup folder." -ForegroundColor White
