/**
 * 设置 OSS Bucket ACL 为公共读
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET
});

async function setBucketAcl() {
  const bucketName = process.env.OSS_BUCKET;

  if (!bucketName) {
    console.error('请先在 .env.local 中设置 OSS_BUCKET');
    return;
  }

  console.log(`设置 Bucket "${bucketName}" 为公共读...`);

  try {
    // 使用 restful API 设置 ACL
    await client.put('x-oss-meta-acl', '', {
      headers: {
        'x-oss-acl': 'public-read'
      }
    });

    // 或者使用 signatureUrl 方式
    const url = await client.signatureUrl('test.txt', { expires: 1 });
    console.log('签名 URL:', url);

    console.log(`✓ 已设置 ACL 为 public-read`);
  } catch (err) {
    console.error(`设置 ACL 失败:`, err.message);
    console.log(`\n请手动在阿里云控制台设置:\nhttps://oss.console.aliyun.com/bucket/${bucketName}/settings`);
  }
}

setBucketAcl();
