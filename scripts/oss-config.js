/**
 * 阿里云 OSS 配置
 *
 * 使用前请设置环境变量:
 * - OSS_ACCESS_KEY_ID
 * - OSS_ACCESS_KEY_SECRET
 *
 * 或直接填写下方配置 (不推荐提交到 Git)
 */

module.exports = {
  // 区域，例如 oss-cn-hangzhou, oss-cn-shanghai
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',

  // Bucket 名称
  bucket: process.env.OSS_BUCKET || 'your-bucket-name',

  // 访问凭证 (建议使用环境变量)
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',

  // CDN 加速域名 (如果配置了 CDN)
  cdnDomain: process.env.OSS_CDN_DOMAIN || '',

  // 上传路径前缀
  prefix: 'meishu/',

  // 公开读写的 CDN 域名
  getPublicUrl: function(key) {
    if (this.cdnDomain) {
      return `https://${this.cdnDomain}/${key}`;
    }
    return `https://${this.bucket}.${this.region}.aliyuncs.com/${key}`;
  }
};
