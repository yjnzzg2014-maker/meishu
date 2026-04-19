/**
 * 生成使用 OSS CDN 的 HTML 文件
 *
 * 用法:
 *   node scripts/update-html-cdn.js
 *
 * 生成的 CDN 版本会放在 public/dist/ 目录
 */

const path = require('path');
const fs = require('fs');
const config = require('./oss-config');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'dist');

function getCdnUrl(localPath) {
  // localPath: public/images/xxx.webp -> meishu/images/xxx.webp
  const key = config.prefix + localPath.replace('public/', '');
  return config.getPublicUrl(key);
}

function processHtml(content, filePath) {
  // 替换图片引用
  content = content.replace(/src=["'](\.\/)?images\/([^"']+)["']/gi, (match, p1, filename) => {
    const localPath = `public/images/${filename}`;
    return `src="${getCdnUrl(localPath)}"`;
  });

  // 替换 JS 引用
  content = content.replace(/src=["'](\.\/)?js\/([^"']+)["']/gi, (match, p1, filename) => {
    const localPath = `public/js/${filename}`;
    return `src="${getCdnUrl(localPath)}"`;
  });

  // 替换 CSS 引用
  content = content.replace(/href=["'](\.\/)?css\/([^"']+)["']/gi, (match, p1, filename) => {
    const localPath = `public/css/${filename}`;
    return `href="${getCdnUrl(localPath)}"`;
  });

  return content;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return processHtml(content, filePath);
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const htmlFiles = ['student.html', 'teacher.html'];
  const cdnUrl = config.cdnDomain || `${config.bucket}.${config.region}.aliyuncs.com`;

  console.log(`\n🌐 生成 CDN 版本 HTML (CDN: ${cdnUrl})\n`);

  for (const htmlFile of htmlFiles) {
    const srcPath = path.join(PUBLIC_DIR, htmlFile);
    if (!fs.existsSync(srcPath)) continue;

    const outputPath = path.join(OUTPUT_DIR, htmlFile);
    const content = processFile(srcPath);
    fs.writeFileSync(outputPath, content);

    console.log(`✓ ${htmlFile} -> public/dist/${htmlFile}`);
  }

  console.log(`\n📝 部署 public/dist/ 目录到 OSS 即可\n`);
}

main();
