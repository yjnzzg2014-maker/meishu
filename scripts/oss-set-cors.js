/**
 * 配置 OSS Bucket CORS，允许跨域访问图片（canvas getImageData 需要）
 * 用法: node scripts/oss-set-cors.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
});

async function setCors() {
  const bucket = process.env.OSS_BUCKET;
  console.log(`\n配置 Bucket "${bucket}" CORS 规则...\n`);

  const rules = [
    {
      allowedOrigin: ['*'],
      allowedMethod: ['GET', 'HEAD'],
      allowedHeader: ['*'],
      exposeHeader: ['ETag', 'Content-Length'],
      maxAgeSeconds: '86400',
    },
  ];

  try {
    await client.putBucketCORS(bucket, rules);
    console.log('✓ CORS 规则已设置（允许所有域名 GET/HEAD）');
    console.log('\n现在图片可以在 canvas 中跨域读取，白色透明化功能正常工作。\n');
  } catch (err) {
    console.error('✗ 设置失败:', err.message);
    console.log('\n请手动在控制台设置:');
    console.log(`https://oss.console.aliyun.com/bucket/${bucket}/cors`);
    console.log('\n规则: 来源 = *, 允许方法 = GET HEAD, 允许头部 = *\n');
  }
}

setCors();
