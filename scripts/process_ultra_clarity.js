const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, '../node_modules/sharp'));

const heropageDir = path.join(__dirname, '../public/images/heropage');

async function processUltraClarity() {
  console.log('Upgrading all 44 frames to Ultra-Clarity 1080p without watermark...');

  const x0 = 1140;
  const x1 = 1230;
  const y0 = 580;
  const y1 = 670;

  for (let i = 1; i <= 44; i++) {
    const numStr = String(i).padStart(4, '0');
    const fileName = `${numStr}.webp`;
    const filePath = path.join(heropageDir, fileName);

    const fileBuffer = fs.readFileSync(filePath);
    const img = sharp(fileBuffer);
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Clean watermark with seamless background inpainting
    for (let y = y0; y <= y1; y++) {
      const v = (y - y0) / (y1 - y0);
      for (let x = x0; x <= x1; x++) {
        const u = (x - x0) / (x1 - x0);

        const leftIdx = (y * width + (x0 - 5)) * channels;
        const rightIdx = (y * width + Math.min(width - 1, x1 + 5)) * channels;
        const topIdx = ((y0 - 5) * width + x) * channels;
        const bottomIdx = (Math.min(height - 1, y1 + 5) * width + x) * channels;

        const destIdx = (y * width + x) * channels;

        for (let c = 0; c < 3; c++) {
          const hVal = (1 - u) * data[leftIdx + c] + u * data[rightIdx + c];
          const vVal = (1 - v) * data[topIdx + c] + v * data[bottomIdx + c];
          const noise = (Math.random() - 0.5) * 1.5;
          data[destIdx + c] = Math.max(0, Math.min(255, Math.round((hVal + vVal) / 2 + noise)));
        }
      }
    }

    // Process with normalization, crisp unsharp mask, and maximum quality WebP
    const enhancedBuffer = await sharp(data, {
      raw: { width, height, channels }
    })
      .resize({ width: 1920, height: 1080, kernel: sharp.kernel.lanczos3 })
      .normalize()
      .sharpen({
        sigma: 1.5,
        m1: 1.4,
        m2: 3.0,
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.06,
      })
      .webp({ quality: 98, effort: 6 })
      .toBuffer();

    fs.writeFileSync(filePath, enhancedBuffer);
    console.log(`[${numStr}/0044] Ultra-Clarity Frame Rendered: ${enhancedBuffer.length} bytes`);
  }

  // Cleanup test files
  const testCrisp = path.join(heropageDir, 'test_ultra_crisp.webp');
  if (fs.existsSync(testCrisp)) fs.unlinkSync(testCrisp);

  console.log('\nAll 44 frames upgraded to Ultra-Clarity 1080p successfully!');
}

processUltraClarity().catch(console.error);
