/**
 * 设置 OSS Bucket ACL 为公共读
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET
});

async function setPublicRead() {
  const bucket = process.env.OSS_BUCKET;
  console.log(`设置 Bucket "${bucket}" 为公共读...`);

  try {
    // 使用 signatureUrlV4 方式设置 ACL
    const request = {
      method: 'PUT',
      bucket: bucket,
      object: '/',
      headers: {
        'x-oss-acl': 'public-read'
      }
    };

    // 直接用 axios 调用
    const axios = require('axios');
    const crypto = require('crypto');

    // 生成签名
    const date = new Date().toUTCString();
    const auth = crypto.createHmac('sha1', process.env.OSS_ACCESS_KEY_SECRET)
      .update(`PUT\n\n${date}\n/${bucket}/`)
      .digest('base64');

    const url = `https://${bucket}.${process.env.OSS_REGION}.aliyuncs.com/`;

    await axios.put(url, null, {
      headers: {
        'Date': date,
        'Authorization': `OSS ${process.env.OSS_ACCESS_KEY_ID}:${auth}`,
        'x-oss-acl': 'public-read'
      }
    });

    console.log('✓ 已设置为公共读');

  } catch (err) {
    console.error('设置失败:', err.message);
    console.log('\n请手动在控制台设置:');
    console.log(`https://oss.console.aliyun.com/bucket/${bucket}/settings`);
    console.log('\n步骤: 访问控制 → ACL → 公共读 → 确定');
  }
}

setPublicRead();
