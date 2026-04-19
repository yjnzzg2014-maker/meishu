const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));

async function compress() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const webpPath = filePath.replace('.png', '.webp');
    const before = fs.statSync(filePath).size;

    // Optimize PNG in-place
    const pngBuffer = await sharp(filePath)
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    fs.writeFileSync(filePath, pngBuffer);
    const afterPng = pngBuffer.length;

    // Generate WebP
    const webpBuffer = await sharp(filePath)
      .webp({ quality: 85, lossless: false })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuffer);

    totalBefore += before;
    totalAfter += afterPng;

    const pct = (((before - afterPng) / before) * 100).toFixed(1);
    console.log(
      `${file.padEnd(40)} ${kb(before).padStart(8)} → PNG ${kb(afterPng).padStart(8)} (${pct}%)  WebP ${kb(webpBuffer.length).padStart(8)}`
    );
  }

  console.log('\n' + '─'.repeat(80));
  console.log(`Total PNG: ${kb(totalBefore)} → ${kb(totalAfter)}  (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% saved)`);
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + 'KB';
}

compress().catch(err => { console.error(err); process.exit(1); });
