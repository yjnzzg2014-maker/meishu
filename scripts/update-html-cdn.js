/**
 * 生成使用 OSS CDN 的 HTML 文件
 *
 * 用法:
 *   node scripts/update-html-cdn.js
 *
 * 生成的 CDN 版本会放在 public/dist/ 目录，同时更新 public/ 原文件
 */

const path = require('path');
const fs = require('fs');
const config = require('./oss-config');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'dist');

// bundle 文件名映射
const BUNDLE_MAP = {
  'student.html': 'bundle-student.js',
  'teacher.html': 'bundle-teacher.js',
};

// student/teacher 各自加载的多个 JS 文件，用 bundle 替换掉
const STUDENT_JS = ['constants.js', 'asset-loader.js', 'canvas-utils.js', 'face-mode.js', 'socket-client.js', 'gallery-animation.js', 'student.js'];
const TEACHER_JS = ['constants.js', 'asset-loader.js', 'canvas-utils.js', 'draw-tool.js', 'socket-client.js', 'teacher.js'];
const JS_TO_BUNDLE = {
  'student.html': STUDENT_JS,
  'teacher.html': TEACHER_JS,
};

function getCdnUrl(localPath) {
  const key = config.prefix + localPath.replace('public/', '');
  return config.getPublicUrl(key);
}

function getAssetBaseUrl() {
  const base = config.cdnDomain
    ? `https://${config.cdnDomain}/${config.prefix}`
    : `https://${config.bucket}.${config.region}.aliyuncs.com/${config.prefix}`;
  // ensure trailing slash
  return base.endsWith('/') ? base : base + '/';
}

function processHtml(content, htmlFile) {
  const bundleFile = BUNDLE_MAP[htmlFile];
  const jsFiles = JS_TO_BUNDLE[htmlFile] || [];

  // 1. 替换 CSS 引用
  content = content.replace(/href=["'](\.\/)?css\/([^"']+)["']/gi, (match, p1, filename) => {
    return `href="${getCdnUrl(`public/css/${filename}`)}"`;
  });

  // 2. 替换内联样式中的 url() 图片引用
  content = content.replace(/url\(['"]?(\.\/)?images\/([^"')]+)['"]?\)/gi, (match, p1, filename) => {
    return `url('${getCdnUrl(`public/images/${filename}`)}')`;
  });

  // 3. 替换 src="images/..." 图片引用
  content = content.replace(/src=["'](\.\/)?images\/([^"']+)["']/gi, (match, p1, filename) => {
    return `src="${getCdnUrl(`public/images/${filename}`)}"`;
  });

  // 4. 注入 ASSET_BASE_URL（在第一个 <script> 前），用于 asset-loader 动态加载图片
  const assetBaseUrl = getAssetBaseUrl();
  const assetBaseScript = `<script>window.ASSET_BASE_URL='${assetBaseUrl}';</script>\n  `;
  content = content.replace(/(<script\b)/, assetBaseScript + '$1');

  // 5. 将多个 JS <script> 标签替换为单个 bundle，减少请求数
  if (bundleFile && jsFiles.length > 0) {
    // 构建匹配所有目标 JS 的正则（匹配本地路径和 OSS URL）
    const filePatterns = jsFiles.map(f => f.replace('.', '\\.'));
    // 找到第一个匹配的 script 行位置，替换为 bundle，删除其余
    let firstReplaced = false;
    const bundleUrl = getCdnUrl(`public/js/${bundleFile}`);
    for (const jsFile of jsFiles) {
      const escapedFile = jsFile.replace('.', '\\.');
      const re = new RegExp(`[ \\t]*<script[^>]+(?:js/${escapedFile})[^>]*><\\/script>\\n?`, 'gi');
      if (!firstReplaced) {
        content = content.replace(re, () => {
          firstReplaced = true;
          return `  <script src="${bundleUrl}"></script>\n`;
        });
      } else {
        content = content.replace(re, '');
      }
    }
  }

  return content;
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const cdnUrl = config.cdnDomain || `${config.bucket}.${config.region}.aliyuncs.com`;
  console.log(`\n🌐 生成 CDN 版本 HTML (OSS: ${cdnUrl})\n`);

  for (const htmlFile of ['student.html', 'teacher.html']) {
    const srcPath = path.join(PUBLIC_DIR, htmlFile);
    if (!fs.existsSync(srcPath)) continue;

    const raw = fs.readFileSync(srcPath, 'utf8');
    const processed = processHtml(raw, htmlFile);

    fs.writeFileSync(path.join(OUTPUT_DIR, htmlFile), processed);
    console.log(`✓ ${htmlFile} -> public/dist/${htmlFile}`);

    fs.writeFileSync(srcPath, processed);
    console.log(`✓ ${htmlFile} -> public/${htmlFile} (已更新为CDN引用)`);
  }

  console.log(`\n✅ 完成。记得运行 npm run bundle 后再上传 bundle 到 OSS\n`);
}

main();
