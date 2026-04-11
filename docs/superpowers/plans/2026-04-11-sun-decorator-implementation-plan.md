# 太阳装饰家 - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time collaborative teaching app where students decorate around a sun using touch gestures, with teacher-controlled mirror modes.

**Architecture:**
- Node.js + Socket.IO server managing WebSocket connections and broadcasting state
- Student client: HTML5 Canvas with Pointer Events for touch, renders sun + shapes + mirror overlays
- Teacher client: Control panel with mode toggles, broadcasts commands to all students
- LAN deployment: teacher and students on same WiFi, connect via IP:port

**Tech Stack:** Node.js, Express, Socket.IO, HTML5 Canvas, Pointer Events API

---

## File Structure

```
sun-decorator/
├── package.json
├── server.js                    # Express + Socket.IO server
├── public/
│   ├── index.html               # Entry (redirects to /student)
│   ├── student.html             # Student client
│   ├── teacher.html             # Teacher client
│   ├── css/
│   │   └── style.css            # Shared + component styles
│   └── js/
│       ├── constants.js         # Colors, shapes config
│       ├── canvas-utils.js      # Shared canvas helpers
│       ├── student.js           # Student touch + render logic
│       ├── teacher.js           # Teacher control logic
│       └── socket-client.js     # Shared Socket.IO client
└── docs/
    └── specs/
        └── 2026-04-11-sun-decorator-design.md
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `server.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sun-decorator",
  "version": "1.0.0",
  "description": "Interactive teaching app for symmetric decoration around a sun",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: express and socket.io installed

- [ ] **Step 3: Create server.js**

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/student.html');
});

let state = {
  shapes: [],
  mode: 'axisymmetric' // 'axisymmetric' | 'quad'
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current state to new client
  socket.emit('sync_state', state);

  socket.on('add_shape', (data) => {
    state.shapes.push(data);
    socket.broadcast.emit('broadcast', { action: 'add_shape', payload: data });
  });

  socket.on('move_shape', (data) => {
    const shape = state.shapes.find(s => s.id === data.id);
    if (shape) {
      shape.x = data.x;
      shape.y = data.y;
    }
    socket.broadcast.emit('broadcast', { action: 'move_shape', payload: data });
  });

  socket.on('rotate_shape', (data) => {
    const shape = state.shapes.find(s => s.id === data.id);
    if (shape) {
      shape.angle = data.angle;
    }
    socket.broadcast.emit('broadcast', { action: 'rotate_shape', payload: data });
  });

  socket.on('delete_shape', (data) => {
    state.shapes = state.shapes.filter(s => s.id !== data.id);
    socket.broadcast.emit('broadcast', { action: 'delete_shape', payload: data });
  });

  socket.on('change_mode', (data) => {
    state.mode = data.mode;
    io.emit('mode_changed', { mode: data.mode });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sun Decorator server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: Test server starts**

Run: `node server.js`
Expected: "Sun Decorator server running on http://localhost:3000"

- [ ] **Step 5: Commit**

```bash
git add package.json server.js
git commit -m "feat: init project with Express + Socket.IO server"
```

---

## Task 2: HTML Skeleton + CSS Foundation

**Files:**
- Create: `public/index.html`
- Create: `public/student.html`
- Create: `public/teacher.html`
- Create: `public/css/style.css`

- [ ] **Step 1: Create public directory structure**

Run: `mkdir -p public/css public/js`

- [ ] **Step 2: Create public/index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=student.html">
  <title>Sun Decorator</title>
</head>
<body></body>
</html>
```

- [ ] **Step 3: Create public/student.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>太阳装饰家 - 学生端</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    <div id="shape-panel"></div>
    <div id="canvas-container">
      <canvas id="main-canvas"></canvas>
    </div>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="js/constants.js"></script>
  <script src="js/canvas-utils.js"></script>
  <script src="js/socket-client.js"></script>
  <script src="js/student.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create public/teacher.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>太阳装饰家 - 教师端</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="teacher-app">
    <h1>太阳装饰家 - 教师控制台</h1>
    <div id="control-panel">
      <div class="control-section">
        <h3>镜像模式</h3>
        <div class="mode-buttons">
          <button id="btn-axisymmetric" class="mode-btn active">轴对称</button>
          <button id="btn-quad" class="mode-btn">四分屏</button>
        </div>
      </div>
      <div class="control-section">
        <h3>学生连接</h3>
        <div id="connection-count">已连接：0 台设备</div>
      </div>
    </div>
    <div id="preview-container">
      <canvas id="preview-canvas"></canvas>
    </div>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="js/constants.js"></script>
  <script src="js/canvas-utils.js"></script>
  <script src="js/socket-client.js"></script>
  <script src="js/teacher.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create public/css/style.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

body {
  background: linear-gradient(180deg, #FFE5EC 0%, #FFDAC1 50%, #FFF5E6 100%);
}

#app {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Shape Panel - Left Side */
#shape-panel {
  width: 140px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 0 24px 24px 0;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-content: start;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0,0,0,0.08);
}

.shape-item {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.shape-item:active {
  transform: scale(0.92);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.shape-item svg {
  width: 36px;
  height: 36px;
}

/* Canvas Container */
#canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

#main-canvas {
  border-radius: 50%;
  box-shadow: 0 8px 40px rgba(255, 180, 50, 0.3);
  touch-action: none;
}

/* Teacher App */
#teacher-app {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

#teacher-app h1 {
  text-align: center;
  color: #E8A87C;
  font-size: 28px;
  margin-bottom: 24px;
}

#control-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.control-section {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.control-section h3 {
  color: #E8A87C;
  font-size: 16px;
  margin-bottom: 12px;
}

.mode-buttons {
  display: flex;
  gap: 12px;
}

.mode-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  cursor: pointer;
  background: #F5F5F5;
  color: #888;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(135deg, #FFB366, #FF9933);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 153, 51, 0.4);
}

#connection-count {
  color: #666;
  font-size: 14px;
}

#preview-container {
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

#preview-container canvas {
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #FFE5EC 0%, #FFDAC1 50%, #FFF5E6 100%);
}
```

- [ ] **Step 6: Commit**

```bash
git add public/index.html public/student.html public/teacher.html public/css/style.css
git commit -m "feat: add HTML skeleton and CSS foundation"
```

---

## Task 3: Constants + Canvas Utilities

**Files:**
- Create: `public/js/constants.js`
- Create: `public/js/canvas-utils.js`

- [ ] **Step 1: Create public/js/constants.js**

```javascript
// Color palette - Warm Sun Macaron
const COLORS = {
  sun: '#FFD700',
  sunGlow: '#FFA500',
  shapes: {
    pink: '#FFB5C5',
    orange: '#FFB366',
    yellow: '#FFE066',
    mint: '#98E4D0',
    sky: '#87CEEB',
    lavender: '#C9B1FF',
    peach: '#FFCBA4',
    coral: '#FF8A80'
  }
};

// Shape types
const SHAPES = [
  { id: 'circle', name: '圆形' },
  { id: 'triangle', name: '三角形' },
  { id: 'square', name: '正方形' },
  { id: 'rectangle', name: '长方形' },
  { id: 'flower', name: '花朵' },
  { id: 'leaf', name: '树叶' },
  { id: 'star', name: '星星' },
  { id: 'cloud', name: '云朵' },
  { id: 'bird', name: '小鸟' }
];

// Mirror modes
const MODES = {
  AXISYMMETRIC: 'axisymmetric',
  QUAD: 'quad'
};

// Sun configuration
const SUN_CONFIG = {
  radius: 60,
  rayCount: 8,
  rayLength: 30,
  breathingMin: 0.6,
  breathingMax: 1.0,
  breathingSpeed: 0.02
};
```

- [ ] **Step 2: Create public/js/canvas-utils.js**

```javascript
// Draw sun with breathing glow effect
function drawSun(ctx, centerX, centerY, config, glowIntensity) {
  const { radius, rayCount, rayLength } = config;

  ctx.save();

  // Outer glow
  const glowRadius = radius + rayLength + 20;
  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, glowRadius);
  gradient.addColorStop(0, `rgba(255, 200, 50, ${0.6 * glowIntensity})`);
  gradient.addColorStop(0.5, `rgba(255, 165, 0, ${0.3 * glowIntensity})`);
  gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.fillStyle = '#FFCC00';
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 2 * Math.PI / rayCount) - Math.PI / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-8, -radius - 5);
    ctx.lineTo(8, -radius - 5);
    ctx.lineTo(4, -radius - rayLength);
    ctx.lineTo(-4, -radius - rayLength);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Sun body
  const bodyGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
  bodyGradient.addColorStop(0, '#FFEB3B');
  bodyGradient.addColorStop(0.7, '#FFD700');
  bodyGradient.addColorStop(1, '#FFA500');

  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Face (simple cute face)
  ctx.fillStyle = '#E8A000';
  // Eyes
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 8, 6, 0, Math.PI * 2);
  ctx.arc(centerX + 18, centerY - 8, 6, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(centerX, centerY + 5, 15, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.strokeStyle = '#E8A000';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

// Draw a shape at given position
function drawShape(ctx, shape, size) {
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.angle || 0);

  const fillColor = COLORS.shapes[shape.color] || COLORS.shapes.pink;

  switch (shape.type) {
    case 'circle':
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'triangle':
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'square':
      ctx.fillStyle = fillColor;
      const half = size / 2 * 0.85;
      roundRect(ctx, -half, -half, half * 2, half * 2, 8);
      ctx.fill();
      break;

    case 'rectangle':
      ctx.fillStyle = fillColor;
      roundRect(ctx, -size / 2, -size / 3, size, size * 0.65, 8);
      ctx.fill();
      break;

    case 'flower':
      drawFlower(ctx, size / 2, fillColor);
      break;

    case 'leaf':
      drawLeaf(ctx, size, fillColor);
      break;

    case 'star':
      drawStar(ctx, size / 2, fillColor);
      break;

    case 'cloud':
      drawCloud(ctx, size, fillColor);
      break;

    case 'bird':
      drawBird(ctx, size, fillColor);
      break;
  }

  ctx.restore();
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: flower
function drawFlower(ctx, size, color) {
  const petalSize = size * 0.35;
  const petalCount = 6;
  ctx.fillStyle = color;
  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.rotate(i * Math.PI / 3);
    ctx.beginPath();
    ctx.ellipse(0, -petalSize, petalSize * 0.6, petalSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: leaf
function drawLeaf(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.4);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.2, size * 0.4, size * 0.3);
  ctx.quadraticCurveTo(0, size * 0.5, -size * 0.4, size * 0.3);
  ctx.quadraticCurveTo(-size * 0.5, -size * 0.2, 0, -size * 0.4);
  ctx.fill();
  ctx.strokeStyle = '#5BA55B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.lineTo(0, size * 0.35);
  ctx.stroke();
}

// Helper: star
function drawStar(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
    const x = Math.cos(angle) * size;
    const y = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// Helper: cloud
function drawCloud(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-size * 0.2, 0, size * 0.3, 0, Math.PI * 2);
  ctx.arc(size * 0.15, -size * 0.1, size * 0.35, 0, Math.PI * 2);
  ctx.arc(size * 0.4, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: bird
function drawBird(ctx, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, 0);
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.3, size * 0.2, 0);
  ctx.quadraticCurveTo(-size * 0.1, size * 0.3, -size * 0.4, 0);
  ctx.stroke();
}

// Mirror shape positions for axisymmetric mode
function getMirroredPositions(shape, centerX, centerY, canvasRadius) {
  const dx = shape.x - centerX;
  const dy = shape.y - centerY;

  return [
    { x: centerX + dx, y: centerY + dy, angle: shape.angle },                          // Original
    { x: centerX - dx, y: centerY + dy, angle: Math.PI - shape.angle },               // Horizontal mirror
    { x: centerX + dx, y: centerY - dy, angle: -shape.angle },                        // Vertical mirror
    { x: centerX - dx, y: centerY - dy, angle: Math.PI + shape.angle }                 // Both mirrors
  ];
}
```

- [ ] **Step 3: Commit**

```bash
git add public/js/constants.js public/js/canvas-utils.js
git commit -m "feat: add constants and canvas utility functions"
```

---

## Task 4: Socket Client + Student Logic

**Files:**
- Create: `public/js/socket-client.js`
- Create: `public/js/student.js`

- [ ] **Step 1: Create public/js/socket-client.js**

```javascript
class SocketClient {
  constructor() {
    this.socket = null;
    this.state = { shapes: [], mode: 'axisymmetric' };
    this.callbacks = {};
  }

  connect() {
    this.socket = io();

    this.socket.on('sync_state', (state) => {
      this.state = state;
      this.trigger('sync', state);
    });

    this.socket.on('broadcast', (data) => {
      this.handleBroadcast(data.action, data.payload);
    });

    this.socket.on('mode_changed', (data) => {
      this.state.mode = data.mode;
      this.trigger('modeChanged', data.mode);
    });

    return this;
  }

  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
    return this;
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  handleBroadcast(action, payload) {
    switch (action) {
      case 'add_shape':
        this.state.shapes.push(payload);
        break;
      case 'move_shape':
        const moveShape = this.state.shapes.find(s => s.id === payload.id);
        if (moveShape) { moveShape.x = payload.x; moveShape.y = payload.y; }
        break;
      case 'rotate_shape':
        const rotateShape = this.state.shapes.find(s => s.id === payload.id);
        if (rotateShape) rotateShape.angle = payload.angle;
        break;
      case 'delete_shape':
        this.state.shapes = this.state.shapes.filter(s => s.id !== payload.id);
        break;
    }
    this.trigger('broadcast', { action, payload });
  }

  addShape(shape) {
    this.state.shapes.push(shape);
    this.socket.emit('add_shape', shape);
  }

  moveShape(id, x, y) {
    const shape = this.state.shapes.find(s => s.id === id);
    if (shape) { shape.x = x; shape.y = y; }
    this.socket.emit('move_shape', { id, x, y });
  }

  rotateShape(id, angle) {
    const shape = this.state.shapes.find(s => s.id === id);
    if (shape) shape.angle = angle;
    this.socket.emit('rotate_shape', { id, angle });
  }

  deleteShape(id) {
    this.state.shapes = this.state.shapes.filter(s => s.id !== id);
    this.socket.emit('delete_shape', { id });
  }

  changeMode(mode) {
    this.state.mode = mode;
    this.socket.emit('change_mode', { mode });
  }
}
```

- [ ] **Step 2: Create public/js/student.js**

```javascript
const SHAPE_SIZE = 80;

class StudentApp {
  constructor() {
    this.canvas = document.getElementById('main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.shapePanel = document.getElementById('shape-panel');
    this.client = new SocketClient();

    this.shapes = [];
    this.selectedShape = null;
    this.dragOffset = { x: 0, y: 0 };
    this.mode = 'axisymmetric';
    this.breathPhase = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.renderShapePanel();
    this.setupTouchHandlers();
    this.connectSocket();
    this.startAnimation();
  }

  setupCanvas() {
    const container = document.getElementById('canvas-container');
    const size = Math.min(container.clientWidth, container.clientHeight) - 40;
    const canvasSize = size * 2; // Full diameter

    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';

    this.centerX = canvasSize / 2;
    this.centerY = canvasSize / 2;
    this.canvasRadius = canvasSize / 2;
  }

  renderShapePanel() {
    this.shapePanel.innerHTML = '';

    SHAPES.forEach(shape => {
      const item = document.createElement('div');
      item.className = 'shape-item';
      item.dataset.shapeId = shape.id;

      // Create mini canvas for preview
      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = 40;
      previewCanvas.height = 40;
      const previewCtx = previewCanvas.getContext('2d');

      const colors = Object.keys(COLORS.shapes);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const tempShape = { type: shape.id, x: 20, y: 20, angle: 0, color };
      drawShape(previewCtx, tempShape, 32);

      item.appendChild(previewCanvas);
      item.addEventListener('click', () => this.addShape(shape.id));
      this.shapePanel.appendChild(item);
    });
  }

  addShape(type) {
    const colors = Object.keys(COLORS.shapes);
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Add near the sun in the working quadrant (bottom-left)
    const angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.5;
    const distance = this.canvasRadius * 0.3 + Math.random() * this.canvasRadius * 0.2;

    const shape = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type,
      x: this.centerX - distance * Math.cos(angle),
      y: this.centerY + distance * Math.sin(angle),
      angle: Math.random() * Math.PI * 2,
      color: color,
      size: SHAPE_SIZE
    };

    this.shapes.push(shape);
    this.client.addShape(shape);
    this.render();
  }

  setupTouchHandlers() {
    let pointerId = null;
    let lastTouchDistance = 0;

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();

      if (pointerId !== null) return; // Already tracking
      pointerId = e.pointerId;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // Check if touching a shape
      this.selectedShape = this.findShapeAt(x, y);

      if (this.selectedShape) {
        this.dragOffset.x = x - this.selectedShape.x;
        this.dragOffset.y = y - this.selectedShape.y;
        this.canvas.setPointerCapture(e.pointerId);
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointerId || !this.selectedShape) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // Update shape position
      this.selectedShape.x = x - this.dragOffset.x;
      this.selectedShape.y = y - this.dragOffset.y;

      this.client.moveShape(this.selectedShape.id, this.selectedShape.x, this.selectedShape.y);
      this.render();
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;

      if (this.selectedShape) {
        // Check if shape is outside canvas - delete it
        const dx = this.selectedShape.x - this.centerX;
        const dy = this.selectedShape.y - this.centerY;
        if (Math.sqrt(dx * dx + dy * dy) > this.canvasRadius + SHAPE_SIZE) {
          this.deleteShape(this.selectedShape.id);
        }
      }

      this.selectedShape = null;
    });

    // Two-finger rotation via touch events
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        lastTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.selectedShape) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

        if (lastTouchDistance > 0) {
          const delta = distance - lastTouchDistance;
          this.selectedShape.angle += delta * 0.01;
          this.client.rotateShape(this.selectedShape.id, this.selectedShape.angle);
          this.render();
        }

        lastTouchDistance = distance;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      lastTouchDistance = 0;
    });
  }

  findShapeAt(x, y) {
    // Search in reverse order (top-most first)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      const dx = x - shape.x;
      const dy = y - shape.y;
      if (Math.sqrt(dx * dx + dy * dy) < shape.size / 2 + 10) {
        return shape;
      }
    }
    return null;
  }

  deleteShape(id) {
    this.shapes = this.shapes.filter(s => s.id !== id);
    this.client.deleteShape(id);
    this.render();
  }

  connectSocket() {
    this.client.connect();

    this.client.on('sync', (state) => {
      this.shapes = state.shapes || [];
      this.mode = state.mode || 'axisymmetric';
      this.render();
    });

    this.client.on('broadcast', ({ action, payload }) => {
      this.render();
    });

    this.client.on('modeChanged', (mode) => {
      this.mode = mode;
      this.render();
    });
  }

  startAnimation() {
    const animate = () => {
      this.breathPhase += SUN_CONFIG.breathingSpeed;
      if (this.breathPhase > Math.PI * 2) this.breathPhase = 0;

      const glowIntensity = SUN_CONFIG.breathingMin +
        (SUN_CONFIG.breathingMax - SUN_CONFIG.breathingMin) *
        (Math.sin(this.breathPhase) + 1) / 2;

      this.render(glowIntensity);
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  render(glowIntensity = 1) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear with gradient background
    const bgGradient = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.canvasRadius);
    bgGradient.addColorStop(0, '#FFF8E7');
    bgGradient.addColorStop(0.7, '#FFE8D0');
    bgGradient.addColorStop(1, '#FFDAB3');

    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.canvasRadius, 0, Math.PI * 2);
    ctx.fill();

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.canvasRadius - 5, 0, Math.PI * 2);
    ctx.clip();

    // Draw sun
    drawSun(ctx, this.centerX, this.centerY, SUN_CONFIG, glowIntensity);

    // Draw shapes with mirroring
    if (this.mode === 'axisymmetric') {
      this.renderAxisymmetric(ctx);
    } else {
      this.renderQuad(ctx);
    }

    ctx.restore();

    // Draw quadrant divider for axisymmetric mode
    if (this.mode === 'axisymmetric') {
      this.renderQuadrantDivider(ctx);
    }
  }

  renderAxisymmetric(ctx) {
    const workingShapes = this.shapes.filter(s => {
      // Only show shapes in bottom-left quadrant (our working area)
      const dx = s.x - this.centerX;
      const dy = s.y - this.centerY;
      return dx <= 0 && dy >= 0;
    });

    workingShapes.forEach(shape => {
      // Draw original
      drawShape(ctx, shape, shape.size);

      // Draw mirrors
      const mirrors = getMirroredPositions(shape, this.centerX, this.centerY, this.canvasRadius);
      mirrors.slice(1).forEach(pos => {
        const mirroredShape = { ...shape, x: pos.x, y: pos.y, angle: pos.angle };
        drawShape(ctx, mirroredShape, shape.size);
      });
    });
  }

  renderQuad(ctx) {
    const quadrantW = this.canvas.width / 2;
    const quadrantH = this.canvas.height / 2;
    const quadrants = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: quadrantW, offsetY: 0 },
      { offsetX: 0, offsetY: quadrantH },
      { offsetX: quadrantW, offsetY: quadrantH }
    ];

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 200, 150, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.centerX, 0);
    ctx.lineTo(this.centerX, this.canvas.height);
    ctx.moveTo(0, this.centerY);
    ctx.lineTo(this.canvas.width, this.centerY);
    ctx.stroke();

    // Draw shapes in all quadrants
    this.shapes.forEach(shape => {
      quadrants.forEach(q => {
        const shiftedShape = { ...shape, x: shape.x + q.offsetX, y: shape.y + q.offsetY };
        drawShape(ctx, shiftedShape, shape.size);
      });
    });
  }

  renderQuadrantDivider(ctx) {
    ctx.strokeStyle = 'rgba(255, 180, 100, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    // Only show the axes we care about (cross through sun)
    ctx.beginPath();
    ctx.moveTo(this.centerX, 0);
    ctx.lineTo(this.centerX, this.canvas.height);
    ctx.moveTo(0, this.centerY);
    ctx.lineTo(this.canvas.width, this.centerY);
    ctx.stroke();

    ctx.setLineDash([]);
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  new StudentApp();
});
```

- [ ] **Step 3: Commit**

```bash
git add public/js/socket-client.js public/js/student.js
git commit -m "feat: implement student client with touch interactions and canvas rendering"
```

---

## Task 5: Teacher Control Panel

**Files:**
- Create: `public/js/teacher.js`

- [ ] **Step 1: Create public/js/teacher.js**

```javascript
class TeacherApp {
  constructor() {
    this.canvas = document.getElementById('preview-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.client = new SocketClient();
    this.shapes = [];
    this.mode = 'axisymmetric';
    this.breathPhase = 0;
    this.connectedCount = 0;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupControls();
    this.connectSocket();
    this.startAnimation();
  }

  setupCanvas() {
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.centerX = 200;
    this.centerY = 200;
    this.canvasRadius = 180;
  }

  setupControls() {
    const btnAxisymmetric = document.getElementById('btn-axisymmetric');
    const btnQuad = document.getElementById('btn-quad');

    btnAxisymmetric.addEventListener('click', () => {
      this.setMode('axisymmetric');
    });

    btnQuad.addEventListener('click', () => {
      this.setMode('quad');
    });
  }

  setMode(mode) {
    this.mode = mode;
    this.client.changeMode(mode);

    document.getElementById('btn-axisymmetric').classList.toggle('active', mode === 'axisymmetric');
    document.getElementById('btn-quad').classList.toggle('active', mode === 'quad');
  }

  connectSocket() {
    this.client.connect();

    this.client.on('sync', (state) => {
      this.shapes = state.shapes || [];
      this.mode = state.mode || 'axisymmetric';
      document.getElementById('btn-axisymmetric').classList.toggle('active', this.mode === 'axisymmetric');
      document.getElementById('btn-quad').classList.toggle('active', this.mode === 'quad');
      this.render();
    });

    this.client.on('broadcast', () => {
      this.render();
    });

    // Track connections
    this.client.socket.on('connect', () => {
      this.connectedCount++;
      document.getElementById('connection-count').textContent = `已连接：${this.connectedCount} 台设备`;
    });

    this.client.socket.on('disconnect', () => {
      this.connectedCount = Math.max(0, this.connectedCount - 1);
      document.getElementById('connection-count').textContent = `已连接：${this.connectedCount} 台设备`;
    });
  }

  startAnimation() {
    const animate = () => {
      this.breathPhase += SUN_CONFIG.breathingSpeed;
      if (this.breathPhase > Math.PI * 2) this.breathPhase = 0;

      const glowIntensity = SUN_CONFIG.breathingMin +
        (SUN_CONFIG.breathingMax - SUN_CONFIG.breathingMin) *
        (Math.sin(this.breathPhase) + 1) / 2;

      this.render(glowIntensity);
      requestAnimationFrame(animate);
    };

    animate();
  }

  render(glowIntensity = 1) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear with gradient background
    const bgGradient = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.canvasRadius);
    bgGradient.addColorStop(0, '#FFF8E7');
    bgGradient.addColorStop(0.7, '#FFE8D0');
    bgGradient.addColorStop(1, '#FFDAB3');

    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.canvasRadius, 0, Math.PI * 2);
    ctx.fill();

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.canvasRadius - 3, 0, Math.PI * 2);
    ctx.clip();

    // Draw sun
    drawSun(ctx, this.centerX, this.centerY, SUN_CONFIG, glowIntensity);

    // Draw shapes
    if (this.mode === 'axisymmetric') {
      this.renderAxisymmetric(ctx);
    } else {
      this.renderQuad(ctx);
    }

    ctx.restore();

    // Quadrant divider
    if (this.mode === 'axisymmetric') {
      ctx.strokeStyle = 'rgba(255, 180, 100, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(this.centerX, 0);
      ctx.lineTo(this.centerX, h);
      ctx.moveTo(0, this.centerY);
      ctx.lineTo(w, this.centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Quad grid
      ctx.strokeStyle = 'rgba(255, 200, 150, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.centerX, 0);
      ctx.lineTo(this.centerX, h);
      ctx.moveTo(0, this.centerY);
      ctx.lineTo(w, this.centerY);
      ctx.stroke();
    }
  }

  renderAxisymmetric(ctx) {
    const workingShapes = this.shapes.filter(s => {
      const dx = s.x - this.centerX * 2; // Scale to preview canvas
      const dy = s.y - this.centerY * 2;
      return dx <= 0 && dy >= 0;
    });

    workingShapes.forEach(shape => {
      const scaledShape = this.scaleShape(shape);
      drawShape(ctx, scaledShape, scaledShape.size);

      const mirrors = getMirroredPositions(scaledShape, this.centerX, this.centerY, this.canvasRadius);
      mirrors.slice(1).forEach(pos => {
        const mirroredShape = { ...scaledShape, x: pos.x, y: pos.y, angle: pos.angle };
        drawShape(ctx, mirroredShape, mirroredShape.size);
      });
    });
  }

  renderQuad(ctx) {
    const quadrantW = this.canvas.width / 2;
    const quadrantH = this.canvas.height / 2;
    const quadrants = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: quadrantW, offsetY: 0 },
      { offsetX: 0, offsetY: quadrantH },
      { offsetX: quadrantW, offsetY: quadrantH }
    ];

    this.shapes.forEach(shape => {
      const scaledShape = this.scaleShape(shape);
      quadrants.forEach(q => {
        const shiftedShape = { ...scaledShape, x: scaledShape.x + q.offsetX, y: scaledShape.y + q.offsetY };
        drawShape(ctx, shiftedShape, shiftedShape.size);
      });
    });
  }

  scaleShape(shape) {
    const scale = 200 / 400; // Preview is half of student canvas
    return {
      ...shape,
      x: shape.x * scale,
      y: shape.y * scale,
      size: shape.size * scale
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TeacherApp();
});
```

- [ ] **Step 2: Commit**

```bash
git add public/js/teacher.js
git commit -m "feat: implement teacher control panel with mode switching"
```

---

## Task 6: Integration Test

**Files:**
- Test: `http://localhost:3000/student.html`
- Test: `http://localhost:3000/teacher.html`

- [ ] **Step 1: Start the server**

Run: `npm start`
Expected: Server running on http://localhost:3000

- [ ] **Step 2: Open student page**

Open browser to: http://localhost:3000/student.html
Expected:
- Left panel shows 9 shape options in 2-column grid
- Center shows circular canvas with sun
- Sun has breathing glow animation

- [ ] **Step 3: Open teacher page**

Open browser to: http://localhost:3000/teacher.html
Expected:
- Shows control panel with mode buttons
- Shows connection count
- Preview canvas shows sun

- [ ] **Step 4: Test adding a shape**

On student page, click a shape
Expected: Shape appears near the sun

- [ ] **Step 5: Test drag**

On student page, drag a shape
Expected: Shape moves, other clients receive update

- [ ] **Step 6: Test mode switch**

On teacher page, click "四分屏"
Expected: Student page switches to quad view

- [ ] **Step 7: Test axisymmetric mirror**

On teacher page, click "轴对称"
Expected: Shapes mirror to all 4 quadrants

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: complete sun-decorator app with full functionality"
```

---

## Spec Coverage Checklist

| Spec Section | Task(s) |
|--------------|---------|
| 视觉风格 (卡通童趣 + 马卡龙色) | Task 2, Task 3 |
| 太阳呼吸动画 | Task 3, Task 4 |
| 9种图形元素 | Task 3, Task 4 |
| 图形库 (2列网格) | Task 4 |
| 触摸拖拽旋转 | Task 4 |
| 轴对称镜像 | Task 4, Task 5 |
| 四分屏镜像 | Task 4, Task 5 |
| 教师控制端 | Task 5 |
| Socket.IO 实时同步 | Task 1, Task 4, Task 5 |

All spec requirements covered.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-11-sun-decorator-implementation-plan.md`**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach would you like?
