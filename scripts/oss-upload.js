/**
 * 阿里云 OSS 文件上传脚本
 *
 * 用法:
 *   node scripts/oss-upload.js                  # 上传所有文件
 *   node scripts/oss-upload.js --images          # 仅上传图片
 *   node scripts/oss-upload.js --js              # 仅上传 JS
 *   node scripts/oss-upload.js --list            # 列出 OSS 上的文件
 *   node scripts/oss-upload.js --delete          # 删除 OSS 上的文件
 */

const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');
const config = require('./oss-config');

const UPLOAD_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
const JS_EXTENSIONS = ['.js', '.css'];

// 初始化 OSS 客户端
const client = new OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket
});

// 收集要上传的文件
function collectFiles(extFilter) {
  const files = [];

  function walk(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath, prefix + item + '/');
      } else {
        const ext = path.extname(item).toLowerCase();
        if (extFilter && !extFilter.includes(ext)) continue;

        const key = config.prefix + prefix + item;
        files.push({ localPath: fullPath, ossKey: key });
      }
    }
  }

  walk(UPLOAD_DIR);
  return files;
}

// 上传单个文件
async function uploadFile(file) {
  try {
    await client.put(file.ossKey, file.localPath);
    console.log(`✓ ${file.ossKey}`);
    return true;
  } catch (err) {
    console.error(`✗ ${file.ossKey}: ${err.message}`);
    return false;
  }
}

// 列出 OSS 上的文件
async function listFiles() {
  console.log('\n📁 OSS 文件列表:\n');
  let continuationToken = null;

  do {
    const options = { 'max-keys': 100 };
    if (continuationToken) options.continuationToken = continuationToken;

    const result = await client.list(options);
    for (const obj of result.objects || []) {
      const size = (obj.size / 1024).toFixed(1) + ' KB';
      console.log(`  ${size.padStart(10)} ${obj.name}`);
    }
    continuationToken = result.nextContinuationToken;
  } while (continuationToken);
}

// 删除文件
async function deleteFiles() {
  const files = collectFiles([...IMAGE_EXTENSIONS, ...JS_EXTENSIONS]);
  console.log(`\n🗑️  删除 ${files.length} 个文件...\n`);

  for (const file of files) {
    try {
      await client.delete(file.ossKey);
      console.log(`✓ ${file.ossKey}`);
    } catch (err) {
      console.error(`✗ ${file.ossKey}: ${err.message}`);
    }
  }
}

// 上传所有文件
async function uploadAll() {
  const allExt = [...IMAGE_EXTENSIONS, ...JS_EXTENSIONS];
  const files = collectFiles(allExt);

  console.log(`\n📤 开始上传 ${files.length} 个文件到 OSS...\n`);

  let success = 0, failed = 0;
  for (const file of files) {
    const ok = await uploadFile(file);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n✅ 完成: ${success} 成功, ${failed} 失败`);

  // 输出 CDN URL 示例
  if (files.length > 0) {
    console.log(`\n🔗 CDN 访问示例: ${config.getPublicUrl(files[0].ossKey)}`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  // 检查配置
  if (!config.accessKeyId || !config.accessKeySecret) {
    console.error('❌ 请配置 OSS 访问凭证');
    console.error('   设置环境变量:');
    console.error('   export OSS_ACCESS_KEY_ID=你的AccessKeyId');
    console.error('   export OSS_ACCESS_KEY_SECRET=你的AccessKeySecret');
    console.error('   export OSS_REGION=oss-cn-hangzhou');
    console.error('   export OSS_BUCKET=你的Bucket名称');
    process.exit(1);
  }

  switch (mode) {
    case '--list':
      await listFiles();
      break;
    case '--delete':
      await deleteFiles();
      break;
    case '--images':
      const imgFiles = collectFiles(IMAGE_EXTENSIONS);
      console.log(`📤 上传 ${imgFiles.length} 张图片...`);
      for (const f of imgFiles) await uploadFile(f);
      break;
    case '--js':
      const jsFiles = collectFiles(JS_EXTENSIONS);
      console.log(`📤 上传 ${jsFiles.length} 个 JS/CSS 文件...`);
      for (const f of jsFiles) await uploadFile(f);
      break;
    default:
      await uploadAll();
  }

  process.exit(0);
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
