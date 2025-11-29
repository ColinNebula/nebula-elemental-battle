/**
 * Asset Optimization Script
 * Compresses images to WebP and resizes large images
 * Run: node scripts/optimize-assets.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'optimized');

// Image optimization settings
const CONFIG = {
  // Max dimensions for different image types
  avatars: { width: 256, height: 256 },
  cards: { width: 400, height: 600 },
  backgrounds: { width: 1920, height: 1080 },
  logos: { width: 512, height: 512 },
  
  // Quality settings
  webpQuality: 80,
  pngQuality: 80,
  jpegQuality: 85
};

// Categorize images by their likely purpose
function categorizeImage(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('avatar') || lower.includes('character')) return 'avatars';
  if (lower.includes('card') || lower.includes('element')) return 'cards';
  if (lower.includes('bg') || lower.includes('background') || lower.includes('arena') || lower.includes('level')) return 'backgrounds';
  if (lower.includes('logo')) return 'logos';
  return 'cards'; // Default to card size
}

async function optimizeImage(inputPath, outputPath, category) {
  const config = CONFIG[category] || CONFIG.cards;
  
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;
    
    // Determine if resizing is needed
    const needsResize = metadata.width > config.width || metadata.height > config.height;
    
    let pipeline = sharp(inputPath);
    
    if (needsResize) {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Create WebP version (best compression)
    const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await pipeline.clone().webp({ quality: CONFIG.webpQuality }).toFile(webpPath);
    
    // Create optimized PNG fallback
    const pngPath = outputPath.replace(/\.(jpg|jpeg)$/i, '.png');
    await pipeline.clone().png({ 
      quality: CONFIG.pngQuality,
      compressionLevel: 9,
      palette: true
    }).toFile(pngPath);
    
    const webpSize = fs.statSync(webpPath).size;
    const pngSize = fs.statSync(pngPath).size;
    
    const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const pngSavings = ((originalSize - pngSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)}KB (${webpSavings}% smaller)`);
    console.log(`   PNG: ${(pngSize / 1024).toFixed(1)}KB (${pngSavings}% smaller)`);
    
    return { original: originalSize, webp: webpSize, png: pngSize };
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Asset Optimization Script');
  console.log('============================\n');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Get all PNG and JPG files
  const files = fs.readdirSync(PUBLIC_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .filter(f => !f.includes('favicon') && !f.includes('apple-touch'));
  
  console.log(`Found ${files.length} images to optimize\n`);
  
  let totalOriginal = 0;
  let totalWebp = 0;
  let totalPng = 0;
  let processed = 0;
  
  // Process large images first (over 500KB)
  const largeFiles = files.filter(f => {
    const size = fs.statSync(path.join(PUBLIC_DIR, f)).size;
    return size > 500 * 1024; // 500KB
  });
  
  console.log(`Processing ${largeFiles.length} large images (>500KB)...\n`);
  
  for (const file of largeFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    const category = categorizeImage(file);
    
    const result = await optimizeImage(inputPath, outputPath, category);
    if (result) {
      totalOriginal += result.original;
      totalWebp += result.webp;
      totalPng += result.png;
      processed++;
    }
    console.log('');
  }
  
  console.log('\n============================');
  console.log('📊 SUMMARY');
  console.log('============================');
  console.log(`Images processed: ${processed}`);
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`WebP total: ${(totalWebp / 1024 / 1024).toFixed(2)}MB (${((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1)}% smaller)`);
  console.log(`PNG total: ${(totalPng / 1024 / 1024).toFixed(2)}MB (${((totalOriginal - totalPng) / totalOriginal * 100).toFixed(1)}% smaller)`);
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
  console.log('\n⚠️  To use optimized images:');
  console.log('1. Review the optimized images in public/optimized/');
  console.log('2. Replace original images with optimized versions');
  console.log('3. Update image references to use .webp with .png fallback');
}

main().catch(console.error);
