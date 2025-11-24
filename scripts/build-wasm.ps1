# Build WebAssembly from C++ game engine
# Requires Emscripten SDK to be installed and activated

Write-Host "Building WebAssembly game engine..." -ForegroundColor Cyan

# Check if emcc is available
if (-not (Get-Command emcc -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Emscripten not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Emscripten:" -ForegroundColor Yellow
    Write-Host "  1. git clone https://github.com/emscripten-core/emsdk.git"
    Write-Host "  2. cd emsdk"
    Write-Host "  3. emsdk install latest"
    Write-Host "  4. emsdk activate latest"
    Write-Host "  5. emsdk_env.bat (to set environment variables)"
    exit 1
}

$sourceDir = "server"
$outputDir = "public/wasm"
$outputName = "game-engine"

# Create output directory
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "Compiling $sourceDir/card_game.cpp..." -ForegroundColor Yellow

# Compile C++ to WebAssembly
emcc "$sourceDir/card_game.cpp" `
    -o "$outputDir/$outputName.js" `
    -s WASM=1 `
    -s EXPORTED_FUNCTIONS="['_malloc', '_free']" `
    -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap', 'UTF8ToString', 'stringToUTF8']" `
    -s MODULARIZE=1 `
    -s EXPORT_NAME="GameEngine" `
    -s ALLOW_MEMORY_GROWTH=1 `
    -s NO_EXIT_RUNTIME=1 `
    -s ASSERTIONS=0 `
    -O3 `
    --closure 1 `
    -std=c++17

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ WebAssembly built successfully!" -ForegroundColor Green
    
    # Show file sizes
    $jsSize = [math]::Round((Get-Item "$outputDir/$outputName.js").Length / 1KB, 2)
    $wasmSize = [math]::Round((Get-Item "$outputDir/$outputName.wasm").Length / 1KB, 2)
    
    Write-Host ""
    Write-Host "Output files:" -ForegroundColor Cyan
    Write-Host "  $outputDir/$outputName.js   ($jsSize KB)"
    Write-Host "  $outputDir/$outputName.wasm ($wasmSize KB)"
    Write-Host ""
    Write-Host "Total WASM bundle: $([math]::Round($jsSize + $wasmSize, 2)) KB" -ForegroundColor Green
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
