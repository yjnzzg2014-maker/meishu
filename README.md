# 小学美术项目式学习 - 天空单元

这是一个小学一年级美术项目式学习（PBL）的Web绘画工具项目。

## 项目结构

```
meishu/
├── public/              # 前端文件
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript脚本
│   ├── images/         # 图片资源
│   ├── assets/         # 静态资源
│   ├── index.html      # 学生端入口
│   ├── student.html    # 学生绘画页面
│   └── teacher.html    # 教师管理页面
│
├── docs/               # 项目文档
├── server.js           # 服务端
└── package.json        # 依赖配置
```

## 功能

- 学生端绘画工具：支持基础图形绘制
- 教师端管理工具：课程资源管理
- 太阳装饰器设计工具

## 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **后端**: Node.js
- **数据库**: JSON文件存储

## 安装运行

```bash
# 安装依赖
npm install

# 启动服务
node server.js
```

## 开源协议

MIT License
