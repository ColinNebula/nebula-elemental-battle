# ============================================
# GitHub Preparation Script
# ============================================
# Prepares the repository for GitHub deployment
# Checks security, optimizes assets, and validates configuration

param(
    [switch]$SkipOptimization,
    [switch]$SkipSecurity,
    [switch]$Verbose
)

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   GITHUB PREPARATION SCRIPT                   " -ForegroundColor Cyan
Write-Host "   Nebula Elemental Battle                     " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0
$StartTime = Get-Date

# ============================================
# 1. SECURITY CHECKS
# ============================================
if (-not $SkipSecurity) {
    Write-Host "SECURITY CHECKS" -ForegroundColor Yellow
    Write-Host "---------------------------------------------" -ForegroundColor Gray
    
    # Check for .env files
    Write-Host "  > Checking for .env files..." -NoNewline
    $envFiles = Get-ChildItem -Path . -Filter ".env*" -File -Recurse -ErrorAction SilentlyContinue | 
                Where-Object { $_.Name -ne ".env.example" }
    
    if ($envFiles) {
        Write-Host " WARNING" -ForegroundColor Yellow
        $envFiles | ForEach-Object {
            Write-Host "    Found: $($_.FullName)" -ForegroundColor Yellow
            $WarningCount++
        }
        Write-Host "    These files should be in .gitignore!" -ForegroundColor Yellow
    } else {
        Write-Host " Clean" -ForegroundColor Green
    }
    
    # Check for sensitive patterns in code
    Write-Host "  > Scanning for sensitive data..." -NoNewline
    $sensitivePatterns = @(
        "(?i)(api[_-]?key|apikey)\s*[:=]\s*['\`"][^'\`"]{8,}['\`"]",
        "(?i)(secret[_-]?key|secretkey)\s*[:=]\s*['\`"][^'\`"]{8,}['\`"]",
        "(?i)(password|passwd)\s*[:=]\s*['\`"][^'\`"]{4,}['\`"]",
        "(?i)(token|auth[_-]?token)\s*[:=]\s*['\`"][^'\`"]{8,}['\`"]",
        "(?i)(private[_-]?key|privatekey)\s*[:=]\s*['\`"]-----BEGIN",
        "(?i)mongodb\+srv://[^'\`"\s]+",
        "(?i)postgres://[^'\`"\s]+",
        "(?i)(aws[_-]?access[_-]?key[_-]?id|aws[_-]?secret)",
        "(?i)sk_live_[a-zA-Z0-9]{24,}"
    )
    
    $sensitiveFound = $false
    $filesToCheck = Get-ChildItem -Path "src","server","public" -Filter "*.js" -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $filesToCheck) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        foreach ($pattern in $sensitivePatterns) {
            if ($content -match $pattern) {
                if (-not $sensitiveFound) {
                    Write-Host " WARNING" -ForegroundColor Yellow
                    $sensitiveFound = $true
                }
                Write-Host "    Potential sensitive data in: $($file.Name)" -ForegroundColor Yellow
                $WarningCount++
                break
            }
        }
    }
    
    if (-not $sensitiveFound) {
        Write-Host " Clean" -ForegroundColor Green
    }
    
    # Check .gitignore exists
    Write-Host "  > Validating .gitignore..." -NoNewline
    if (-not (Test-Path ".gitignore")) {
        Write-Host " MISSING" -ForegroundColor Red
        $ErrorCount++
    } else {
        $gitignoreContent = Get-Content ".gitignore" -Raw
        $requiredPatterns = @(".env", "node_modules", "build", "*.log", ".DS_Store")
        $missingPatterns = @()
        
        foreach ($pattern in $requiredPatterns) {
            if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
                $missingPatterns += $pattern
            }
        }
        
        if ($missingPatterns.Count -gt 0) {
            Write-Host " INCOMPLETE" -ForegroundColor Yellow
            Write-Host "    Missing patterns: $($missingPatterns -join ', ')" -ForegroundColor Yellow
            $WarningCount++
        } else {
            Write-Host " Valid" -ForegroundColor Green
        }
    }
    
    Write-Host ""
}

# ============================================
# 2. FILE SIZE ANALYSIS
# ============================================
Write-Host "FILE SIZE ANALYSIS" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

# Check public folder size
Write-Host "  > Analyzing public folder..." -NoNewline
if (Test-Path "public") {
    $publicSize = (Get-ChildItem -Path "public" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
    $publicSizeRounded = [math]::Round($publicSize, 2)
    
    if ($publicSize -gt 100) {
        Write-Host " LARGE ($publicSizeRounded MB)" -ForegroundColor Yellow
        $WarningCount++
    } else {
        Write-Host " $publicSizeRounded MB" -ForegroundColor Green
    }
    
    # List largest files
    if ($Verbose) {
        Write-Host "    Top 10 largest files:" -ForegroundColor Gray
        Get-ChildItem -Path "public" -File -Recurse | 
            Select-Object Name, @{Name="SizeMB";Expression={[math]::Round($_.Length/1MB, 2)}} |
            Sort-Object SizeMB -Descending |
            Select-Object -First 10 |
            ForEach-Object {
                Write-Host "      $($_.Name): $($_.SizeMB) MB" -ForegroundColor Gray
            }
    }
} else {
    Write-Host " NOT FOUND" -ForegroundColor Yellow
    $WarningCount++
}

# Check build folder size
Write-Host "  > Analyzing build folder..." -NoNewline
if (Test-Path "build") {
    $buildSize = (Get-ChildItem -Path "build" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
    $buildSizeRounded = [math]::Round($buildSize, 2)
    Write-Host " $buildSizeRounded MB" -ForegroundColor Cyan
} else {
    Write-Host " Not built yet" -ForegroundColor Gray
}

# Check for oversized files
Write-Host "  > Checking for oversized files (>5MB)..." -NoNewline
$largeFiles = Get-ChildItem -Path "public" -File -Recurse -ErrorAction SilentlyContinue | 
              Where-Object { $_.Length -gt 5MB }

if ($largeFiles) {
    Write-Host " FOUND $($largeFiles.Count)" -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length/1MB, 2)
        Write-Host "    $($_.Name): $sizeMB MB" -ForegroundColor Yellow
        $WarningCount++
    }
} else {
    Write-Host " Clean" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 3. PACKAGE.JSON VALIDATION
# ============================================
Write-Host "PACKAGE.JSON VALIDATION" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

Write-Host "  > Checking package.json..." -NoNewline
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    # Check required fields
    $requiredFields = @("name", "version", "description", "repository", "license")
    $missingFields = @()
    
    foreach ($field in $requiredFields) {
        if (-not $packageJson.PSObject.Properties.Name.Contains($field)) {
            $missingFields += $field
        }
    }
    
    if ($missingFields.Count -gt 0) {
        Write-Host " INCOMPLETE" -ForegroundColor Yellow
        Write-Host "    Missing: $($missingFields -join ', ')" -ForegroundColor Yellow
        $WarningCount++
    } else {
        Write-Host " Valid" -ForegroundColor Green
        Write-Host "    Name: $($packageJson.name)" -ForegroundColor Gray
        Write-Host "    Version: $($packageJson.version)" -ForegroundColor Gray
        Write-Host "    License: $($packageJson.license)" -ForegroundColor Gray
    }
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $ErrorCount++
}

Write-Host ""

# ============================================
# 4. ASSET OPTIMIZATION CHECK
# ============================================
if (-not $SkipOptimization) {
    Write-Host "ASSET OPTIMIZATION" -ForegroundColor Yellow
    Write-Host "---------------------------------------------" -ForegroundColor Gray
    
    # Check for unoptimized images
    Write-Host "  > Checking image formats..." -NoNewline
    $unoptimizedImages = Get-ChildItem -Path "public" -File -Recurse -Include "*.bmp","*.tiff","*.tif" -ErrorAction SilentlyContinue
    
    if ($unoptimizedImages) {
        Write-Host " FOUND UNOPTIMIZED" -ForegroundColor Yellow
        $unoptimizedImages | ForEach-Object {
            Write-Host "    $($_.Name) (use PNG or WebP instead)" -ForegroundColor Yellow
            $WarningCount++
        }
    } else {
        Write-Host " Optimized" -ForegroundColor Green
    }
    
    # Check audio format
    Write-Host "  > Checking audio formats..." -NoNewline
    $unoptimizedAudio = Get-ChildItem -Path "public" -File -Recurse -Include "*.wav","*.aiff","*.flac" -ErrorAction SilentlyContinue
    
    if ($unoptimizedAudio) {
        Write-Host " FOUND UNCOMPRESSED" -ForegroundColor Yellow
        $unoptimizedAudio | ForEach-Object {
            Write-Host "    $($_.Name) (use MP3 or OGG instead)" -ForegroundColor Yellow
            $WarningCount++
        }
    } else {
        Write-Host " Compressed" -ForegroundColor Green
    }
    
    Write-Host ""
}

# ============================================
# 5. GIT REPOSITORY CHECK
# ============================================
Write-Host "GIT REPOSITORY" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

Write-Host "  > Checking git initialization..." -NoNewline
if (Test-Path ".git") {
    Write-Host " Initialized" -ForegroundColor Green
    
    # Check for uncommitted changes
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "  > Git status..." -NoNewline
        $changedFiles = ($gitStatus | Measure-Object).Count
        Write-Host " $changedFiles uncommitted changes" -ForegroundColor Yellow
    } else {
        Write-Host "  > Git status..." -NoNewline
        Write-Host " Clean working tree" -ForegroundColor Green
    }
    
    # Check remote
    $gitRemote = git remote get-url origin 2>$null
    if ($gitRemote) {
        Write-Host "  > Remote configured..." -NoNewline
        Write-Host " $gitRemote" -ForegroundColor Green
    } else {
        Write-Host "  > Remote configured..." -NoNewline
        Write-Host " No remote configured" -ForegroundColor Yellow
        $WarningCount++
    }
} else {
    Write-Host " NOT INITIALIZED" -ForegroundColor Yellow
    Write-Host "    Run: git init" -ForegroundColor Yellow
    $WarningCount++
}

Write-Host ""

# ============================================
# 6. README & LICENSE CHECK
# ============================================
Write-Host "DOCUMENTATION" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

Write-Host "  > Checking README.md..." -NoNewline
if (Test-Path "README.md") {
    $readmeSize = (Get-Item "README.md").Length
    if ($readmeSize -lt 500) {
        Write-Host " TOO SHORT" -ForegroundColor Yellow
        $WarningCount++
    } else {
        Write-Host " Exists" -ForegroundColor Green
    }
} else {
    Write-Host " MISSING" -ForegroundColor Yellow
    $WarningCount++
}

Write-Host "  > Checking LICENSE..." -NoNewline
if (Test-Path "LICENSE") {
    Write-Host " Exists" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Yellow
    $WarningCount++
}

Write-Host ""

# ============================================
# 7. BUILD TEST
# ============================================
Write-Host "BUILD VERIFICATION" -ForegroundColor Yellow
Write-Host "---------------------------------------------" -ForegroundColor Gray

Write-Host "  > Testing production build..." -NoNewline
$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host " Success" -ForegroundColor Green
} else {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    Build errors detected. Fix before deploying!" -ForegroundColor Red
    $ErrorCount++
}

Write-Host ""

# ============================================
# FINAL REPORT
# ============================================
$Duration = (Get-Date) - $StartTime
$DurationSeconds = [math]::Round($Duration.TotalSeconds, 1)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   PREPARATION COMPLETE                        " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Duration: $DurationSeconds seconds" -ForegroundColor Gray
Write-Host ""

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "READY FOR GITHUB!" -ForegroundColor Green
    Write-Host "   No errors or warnings detected." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor Gray
    Write-Host "  2. git commit -m 'Prepare for deployment'" -ForegroundColor Gray
    Write-Host "  3. git push origin main" -ForegroundColor Gray
    Write-Host "  4. npm run deploy (for GitHub Pages)" -ForegroundColor Gray
    Write-Host ""
    
    exit 0
} elseif ($ErrorCount -eq 0) {
    Write-Host "READY WITH WARNINGS" -ForegroundColor Yellow
    Write-Host "   $WarningCount warnings found. Review before deploying." -ForegroundColor Yellow
    Write-Host ""
    exit 0
} else {
    Write-Host "NOT READY" -ForegroundColor Red
    Write-Host "   $ErrorCount errors and $WarningCount warnings found." -ForegroundColor Red
    Write-Host ""
    Write-Host "   Fix errors before deploying to GitHub!" -ForegroundColor Red
    Write-Host ""
    exit 1
}
