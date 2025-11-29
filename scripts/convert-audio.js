const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get ffmpeg path from ffmpeg-static
const ffmpegPath = require('ffmpeg-static');

const publicDir = path.join(__dirname, '..', 'public');

// Find all WAV files
const wavFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.wav'));

console.log(`Found ${wavFiles.length} WAV files to convert\n`);

let totalOriginal = 0;
let totalConverted = 0;

for (const wavFile of wavFiles) {
  const wavPath = path.join(publicDir, wavFile);
  const mp3File = wavFile.replace('.wav', '.mp3');
  const mp3Path = path.join(publicDir, mp3File);
  
  const originalSize = fs.statSync(wavPath).size;
  totalOriginal += originalSize;
  
  console.log(`Converting: ${wavFile}`);
  
  try {
    // Convert WAV to MP3 with good compression (128kbps is good for game audio)
    execSync(`"${ffmpegPath}" -i "${wavPath}" -b:a 128k -y "${mp3Path}"`, {
      stdio: 'pipe'
    });
    
    const newSize = fs.statSync(mp3Path).size;
    totalConverted += newSize;
    
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`  ${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)\n`);
    
    // Delete original WAV file
    fs.unlinkSync(wavPath);
    console.log(`  Deleted original: ${wavFile}\n`);
    
  } catch (err) {
    console.error(`  Error converting ${wavFile}:`, err.message);
  }
}

console.log('\n========================================');
console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
console.log(`Total converted: ${(totalConverted / 1024 / 1024).toFixed(2)}MB`);
console.log(`Savings: ${((1 - totalConverted / totalOriginal) * 100).toFixed(1)}%`);
console.log('========================================\n');
