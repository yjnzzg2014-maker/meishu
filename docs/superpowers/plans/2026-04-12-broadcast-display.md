# 推送展示（Broadcast Display）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 教师可选择某个学生的作品，推送展示给所有学生，学生屏幕全屏展示作品，无法操作，教师可关闭展示并单独解除锁定。

**Architecture:** 在现有 Socket.IO 事件体系上新增 `broadcast_display` 和 `display_closed` 两个事件。学生端新增展示弹窗 DOM 和等待提示 DOM。教师端新增学生选中状态和两个按钮。服务器负责转发事件到所有学生。

**Tech Stack:** Socket.IO, Vanilla JS, Canvas API, HTML/CSS

---

## 文件变更总览

| 文件 | 职责 |
|---|---|
| `server.js` | 新增 `broadcast_display` 和 `display_closed` 事件处理 |
| `public/js/student.js` | 展示弹窗渲染、等待提示渲染、状态切换 |
| `public/js/teacher.js` | 学生选中状态、推送/关闭展示按钮逻辑 |
| `public/student.html` | 展示弹窗 DOM、等待提示 DOM |
| `public/teacher.html` | 推送展示按钮、关闭展示按钮 |
| `public/css/style.css` | 展示弹窗样式、等待提示样式 |

---

## Task 1: 服务器端事件

**Files:**
- Modify: `server.js`

- [ ] **Step 1: 添加 `broadcast_display` 事件处理**

在 `server.js` 中找到现有的 socket 事件处理区域，在 `toggle_lock` 事件处理之后添加：

```js
socket.on('broadcast_display', (data) => {
  // data: { studentId, studentName, state }
  // 转发给所有学生（包括发送者）
  io.emit('display_broadcast', data);
});
```

- [ ] **Step 2: 添加 `display_closed` 事件处理**

在 `broadcast_display` 处理之后添加：

```js
socket.on('display_closed', () => {
  io.emit('display_closed_by_teacher');
});
```

- [ ] **Step 3: 提交**

```bash
git add server.js
git commit -m "feat: add broadcast_display and display_closed socket events"
```

---

## Task 2: 学生端 - 展示弹窗和等待提示

**Files:**
- Modify: `public/js/student.js`
- Modify: `public/student.html`
- Modify: `public/css/style.css`

- [ ] **Step 1: 在 student.html 添加展示弹窗 DOM**

在 `#lock-overlay` 之后添加：

```html
<!-- 推送展示弹窗 -->
<div id="display-modal" class="display-modal">
  <div class="display-modal-card">
    <canvas id="display-canvas" width="500" height="500"></canvas>
    <p class="display-modal-hint">等待老师关闭</p>
  </div>
</div>

<!-- 展示关闭后的等待提示 -->
<div id="display-waiting" class="display-waiting">
  <p>老师已关闭展示，正在等待解锁...</p>
</div>
```

- [ ] **Step 2: 在 style.css 添加样式**

```css
/* 展示弹窗 */
.display-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.display-modal.visible {
  display: flex;
}

.display-modal-card {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 24px;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

#display-canvas {
  max-width: 80vw;
  max-height: calc(80vh - 60px);
  border-radius: 8px;
}

.display-modal-hint {
  color: #888;
  font-size: 14px;
  margin: 0;
}

/* 等待提示 */
.display-waiting {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.display-waiting.visible {
  display: flex;
}

.display-waiting p {
  color: #fff;
  font-size: 18px;
}
```

- [ ] **Step 3: 在 student.js 添加展示相关状态和 UI 方法**

在 `StudentApp` 构造函数中，在 `this.locked = false` 之后添加：

```js
this.isDisplaying = false;
this.displayStudentName = '';
this.displayState = null;
```

- [ ] **Step 4: 在 student.js 添加展示相关方法**

在 `updateLockUI()` 方法之后添加：

```js
showDisplayModal(studentName, state) {
  this.isDisplaying = true;
  this.displayStudentName = studentName;
  this.displayState = state;

  const modal = document.getElementById('display-modal');
  const canvas = document.getElementById('display-canvas');

  // 渲染被展示学生的作品到 display-canvas
  this.renderDisplayCanvas(canvas, state);

  modal.classList.add('visible');
  document.getElementById('display-waiting').classList.remove('visible');
}

hideDisplayModal() {
  this.isDisplaying = false;
  document.getElementById('display-modal').classList.remove('visible');
  document.getElementById('display-waiting').classList.add('visible');
}

renderDisplayCanvas(canvas, state) {
  const ctx = canvas.getContext('2d');
  const size = 500;
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  if (!state) return;

  // 绘制太阳背景
  const skin = state.sunSkin || 'default';
  const skinData = this.assetLoader.getSkin(skin);
  if (skinData) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(skinData, 0, 0, size, size);
    ctx.restore();
  }

  // 绘制 shapes
  if (state.shapes) {
    state.shapes.forEach(shape => {
      this.drawShapeToContext(ctx, shape, size / 2, size / 2, 1);
    });
  }

  // 绘制 faceParts
  if (state.faceParts) {
    state.faceParts.forEach(part => {
      this.drawFacePartToContext(ctx, part);
    });
  }
}

drawShapeToContext(ctx, shape, cx, cy, scale) { /* ... */ }
drawFacePartToContext(ctx, part) { /* ... */ }
```

> 注意：`drawShapeToContext` 和 `drawFacePartToContext` 需要参考 `canvas-utils.js` 中已有的绘制逻辑，将其复用渲染到任意 canvas context。

- [ ] **Step 5: 在 student.js 接收 Socket.IO 事件**

在 `initSocket()` 方法或 socket 事件绑定区域，添加：

```js
socket.on('display_broadcast', (data) => {
  // data: { studentId, studentName, state }
  this.showDisplayModal(data.studentName, data.state);
});

socket.on('display_closed_by_teacher', () => {
  this.hideDisplayModal();
});
```

- [ ] **Step 6: 提交**

```bash
git add public/student.html public/css/style.css public/js/student.js
git commit -m "feat: add display modal and waiting UI to student side"
```

---

## Task 3: 教师端 - 选中学生 + 推送/关闭展示按钮

**Files:**
- Modify: `public/js/teacher.js`
- Modify: `public/teacher.html`
- Modify: `public/css/style.css`

- [ ] **Step 1: 在 teacher.html 添加按钮**

在底部控制栏 `.controls` 中，`锁定` 按钮之后添加：

```html
<button id="btn-broadcast" class="control-btn" style="display: none;">推送展示</button>
<button id="btn-close-display" class="control-btn" style="display: none;">关闭展示</button>
```

- [ ] **Step 2: 在 TeacherApp 构造函数中添加状态**

在 `TeacherApp` 构造函数中添加：

```js
this.selectedStudentId = null;
this.isDisplayActive = false;
```

- [ ] **Step 3: 修改学生卡片点击逻辑实现选中**

找到 `renderStudentCard` 或学生卡片点击事件处理，修改为：

```js
card.addEventListener('click', () => {
  if (this.selectedStudentId === student.id) {
    // 取消选中
    this.selectedStudentId = null;
    card.classList.remove('selected');
    this.updateBroadcastButton();
  } else {
    // 选中
    if (this.selectedStudentId) {
      // 取消上一个选中
      const prev = document.querySelector('.student-card.selected');
      if (prev) prev.classList.remove('selected');
    }
    this.selectedStudentId = student.id;
    card.classList.add('selected');
    this.updateBroadcastButton();
  }
});
```

- [ ] **Step 4: 添加 `updateBroadcastButton` 方法**

```js
updateBroadcastButton() {
  const btnBroadcast = document.getElementById('btn-broadcast');
  const btnClose = document.getElementById('btn-close-display');

  if (this.selectedStudentId) {
    btnBroadcast.style.display = 'inline-block';
    btnClose.style.display = 'none';
  } else {
    btnBroadcast.style.display = 'none';
    btnClose.style.display = 'none';
  }
}
```

- [ ] **Step 5: 添加 `startBroadcast` 方法**

```js
startBroadcast() {
  const studentId = this.selectedStudentId;
  if (!studentId) return;

  // 获取被展示学生的数据
  this.socket.emit('get_student_state', { studentId }, (response) => {
    // response: { id, name, state }
    if (response && response.state) {
      // 自动开启锁定（如果未开启）
      if (!this.locked) {
        this.toggleLock(true);
      }
      // 广播给所有学生
      this.socket.emit('broadcast_display', {
        studentId: response.id,
        studentName: response.name,
        state: response.state
      });
      this.isDisplayActive = true;
      this.updateBroadcastButton();
    }
  });
}
```

- [ ] **Step 6: 添加 `closeDisplay` 方法**

```js
closeDisplay() {
  this.socket.emit('display_closed');
  this.isDisplayActive = false;
  this.updateBroadcastButton();
}
```

- [ ] **Step 7: 绑定按钮事件**

在构造函数中添加：

```js
document.getElementById('btn-broadcast').addEventListener('click', () => this.startBroadcast());
document.getElementById('btn-close-display').addEventListener('click', () => this.closeDisplay());
```

- [ ] **Step 8: 修改 `toggleLock` 以更新按钮状态**

`toggleLock` 方法末尾添加：

```js
// 更新推送展示按钮可见性
if (this.locked && this.selectedStudentId) {
  document.getElementById('btn-broadcast').style.display = 'inline-block';
} else if (!this.isDisplayActive) {
  document.getElementById('btn-broadcast').style.display = 'none';
}
```

- [ ] **Step 9: 添加选中卡片样式**

在 style.css 中添加：

```css
.student-card.selected {
  border: 2px solid #4A90D9;
}
```

- [ ] **Step 10: 提交**

```bash
git add public/teacher.html public/js/teacher.js public/css/style.css
git commit -m "feat: add student selection and broadcast buttons to teacher side"
```

---

## Task 4: 联调测试

- [ ] **Step 1: 启动服务器**

```bash
cd /Users/fantamonster/Documents/ClaudeProject/meishu
node server.js
```

- [ ] **Step 2: 打开教师端和学生端**

- 教师：打开 `http://localhost:3000/teacher.html`
- 学生 1：打开 `http://localhost:3000/student.html`（可开多个标签页模拟多个学生）

- [ ] **Step 3: 测试推送展示流程**

1. 教师点击学生网格中某个学生卡片 → 卡片高亮，底部出现"推送展示"按钮
2. 点击"推送展示" →
   - 若锁定未开启，自动开启（学生端看到锁定遮罩）
   - 所有学生看到展示弹窗（被选中学生的作品）
   - 弹窗底部显示"等待老师关闭"
3. 教师点击"关闭展示" →
   - 学生端弹窗关闭，显示"老师已关闭展示，正在等待解锁..."
   - 锁定保持
4. 教师点击"解除锁定" →
   - 学生端完全恢复正常

- [ ] **Step 4: 测试选中切换**

1. 选中学生 A，点击推送展示
2. 不关闭展示，直接选中学生 B →
   - 推送替换为学生 B 的作品
3. 不关闭展示，取消选中 →
   - "推送展示"按钮消失，展示保持

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: complete broadcast display feature with integration"
```
