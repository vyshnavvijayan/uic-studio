const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, '../node_modules/sharp'));

const heropageDir = path.join(__dirname, '../public/images/heropage');
const backupDir = path.join(heropageDir, 'backup_lowres');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function processAllFrames() {
  console.log('Starting batch enhancement and watermark removal for all 44 frames...');

  // Watermark removal bounding box in 1280x720 source coordinates
  const x0 = 1145;
  const x1 = 1225;
  const y0 = 585;
  const y1 = 665;

  for (let i = 1; i <= 44; i++) {
    const numStr = String(i).padStart(4, '0');
    const fileName = `${numStr}.webp`;
    const filePath = path.join(heropageDir, fileName);
    const backupPath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${fileName}`);
      continue;
    }

    // 1. Save original to backup if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // 2. Read raw pixel buffer from backup
    const img = sharp(backupPath);
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // 3. Inpaint watermark seamlessly
    for (let y = y0; y <= y1; y++) {
      const v = (y - y0) / (y1 - y0);
      for (let x = x0; x <= x1; x++) {
        const u = (x - x0) / (x1 - x0);

        const leftIdx = (y * width + (x0 - 4)) * channels;
        const rightIdx = (y * width + Math.min(width - 1, x1 + 4)) * channels;
        const topIdx = ((y0 - 4) * width + x) * channels;
        const bottomIdx = (Math.min(height - 1, y1 + 4) * width + x) * channels;

        const destIdx = (y * width + x) * channels;

        for (let c = 0; c < 3; c++) {
          const hVal = (1 - u) * data[leftIdx + c] + u * data[rightIdx + c];
          const vVal = (1 - v) * data[topIdx + c] + v * data[bottomIdx + c];
          const noise = (Math.random() - 0.5) * 2;
          data[destIdx + c] = Math.max(0, Math.min(255, Math.round((hVal + vVal) / 2 + noise)));
        }
      }
    }

    // 4. Upscale to 1920x1080 Full HD, apply unsharp masking and contrast grading
    const enhancedBuffer = await sharp(data, {
      raw: { width, height, channels }
    })
      .resize({ width: 1920, height: 1080, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 1.1, m1: 1.0, m2: 2.0 })
      .linear(1.05, -2)
      .webp({ quality: 95, effort: 6 })
      .toBuffer();

    // 5. Overwrite the target frame with the high quality clean version
    fs.writeFileSync(filePath, enhancedBuffer);
    console.log(`[${numStr}/0044] Enhanced & Watermark Removed -> ${enhancedBuffer.length} bytes`);
  }

  // Remove test files if present
  const test1 = path.join(heropageDir, 'test_0001_clean.webp');
  const test44 = path.join(heropageDir, 'test_0044_clean.webp');
  if (fs.existsSync(test1)) fs.unlinkSync(test1);
  if (fs.existsSync(test44)) fs.unlinkSync(test44);

  console.log('\nAll 44 frames successfully upgraded to 1080p high quality with watermark removed!');
}

processAllFrames().catch(console.error);
