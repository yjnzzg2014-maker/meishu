const SHAPE_SIZE = 80;

class StudentApp {
  constructor() {
    this.canvas = document.getElementById('main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.shapePanel = document.getElementById('shape-panel');
    this.client = new SocketClient();

    this.shapes = [];
    this.faceParts = [];
    this.selectedShape = null;
    this.selectedFacePart = null;
    this.dragOffset = { x: 0, y: 0 };
    this.mode = 'symmetric';
    this.sunSkin = 'cartoon';
    this.locked = false;
    this.breathPhase = 0;
    this.animationId = null;
    this.history = []; // For undo
    this.activeShapeCategory = 'geometry';

    this.faceMode = new FaceMode(this);
  }

  async init() {
    // Load assets first
    const loader = document.getElementById('loader');
    await AssetLoader.loadAll();
    if (loader) loader.style.display = 'none';

    this.setupCanvas();
    this.renderShapePanel();
    this.setupSkinSelector();
    this.setupToolbar();
    this.setupTouchHandlers();
    this.connectSocket();
    this.faceMode.init();
    this.updateModeUI();
    this.startAnimation();
  }

  setupCanvas() {
    const container = document.getElementById('canvas-container');
    const size = Math.min(container.clientWidth, container.clientHeight) - 20;
    const canvasSize = size * 2;

    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';

    this.centerX = canvasSize / 2;
    this.centerY = canvasSize / 2;
    this.canvasRadius = canvasSize / 2;
  }

  renderShapePanel() {
    const container = document.getElementById('shape-items');
    if (!container) return;
    container.innerHTML = '';

    const filtered = SHAPES.filter(s => s.category === this.activeShapeCategory);

    filtered.forEach(shape => {
      const item = document.createElement('div');
      item.className = 'shape-item';
      item.dataset.shapeId = shape.id;

      const colors = Object.keys(COLORS.shapes);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const img = AssetLoader.get(`shape_${shape.id}_${color}`);
      if (img) {
        const preview = document.createElement('canvas');
        preview.width = 56;
        preview.height = 56;
        const pctx = preview.getContext('2d');
        pctx.drawImage(img, 4, 4, 48, 48);
        item.appendChild(preview);
      }

      const label = document.createElement('span');
      label.className = 'shape-label';
      label.textContent = shape.name;
      item.appendChild(label);

      item.addEventListener('click', () => this.addShape(shape.id));
      container.appendChild(item);
    });
  }

  setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeShapeCategory = tab.dataset.category;
        this.renderShapePanel();
      });
    });
  }

  setupSkinSelector() {
    const container = document.getElementById('skin-selector');
    if (!container) return;

    SUN_SKINS.forEach(skin => {
      const btn = document.createElement('button');
      btn.className = 'skin-btn' + (skin.id === this.sunSkin ? ' active' : '');
      btn.dataset.skinId = skin.id;

      const preview = document.createElement('canvas');
      preview.width = 40;
      preview.height = 40;
      const pctx = preview.getContext('2d');
      const img = AssetLoader.get('sun_' + skin.id);
      if (img) pctx.drawImage(img, 0, 0, 40, 40);
      btn.appendChild(preview);

      const label = document.createElement('span');
      label.textContent = skin.name;
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        container.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.sunSkin = skin.id;
        this.client.changeSkin(skin.id);
        this.render();
      });

      container.appendChild(btn);
    });
  }

  setupToolbar() {
    const undoBtn = document.getElementById('btn-undo');
    const clearBtn = document.getElementById('btn-clear');

    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.undo());
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAll());
    }

    // Category tabs
    this.setupCategoryTabs();
  }

  addShape(type) {
    if (this.locked) return;

    const colors = Object.keys(COLORS.shapes);
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Place near sun at random radial position
    const angle = Math.random() * Math.PI * 2;
    const sunR = getSunRadius(this.canvasRadius);
    const minDist = sunR + SHAPE_SIZE;
    const maxDist = this.canvasRadius * 0.6;
    const distance = minDist + Math.random() * (maxDist - minDist);

    // Radial angle: angle from sun center to placement point
    const radialAngle = angle;

    const shape = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type,
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance,
      angle: radialAngle, // Initial angle = radial direction from sun center
      color: color,
      size: SHAPE_SIZE,
      scale: 1
    };

    this.saveHistory();
    this.shapes.push(shape);
    this.syncToServer();
    this.render();

    // Visual feedback
    this.flashPanel();
  }

  flashPanel() {
    const panel = document.getElementById('shape-panel');
    if (panel) {
      panel.classList.add('panel-bounce');
      setTimeout(() => panel.classList.remove('panel-bounce'), 300);
    }
  }

  setupTouchHandlers() {
    let primaryPointerId = null;
    let initialPinchDist = 0;
    let initialPinchAngle = 0;
    let shapeInitScale = 1;
    let shapeInitAngle = 0;
    let isPinching = false;

    // --- Pointer events for drag ---
    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.locked) return;

      if (primaryPointerId !== null) return;
      primaryPointerId = e.pointerId;

      const { x, y } = this.canvasCoords(e);

      // Check face parts first (if in personify or free mode)
      if (this.mode === 'personify' || this.mode === 'free') {
        this.selectedFacePart = this.faceMode.findPartAt(x, y);
        if (this.selectedFacePart) {
          const px = this.centerX + this.selectedFacePart.offsetX;
          const py = this.centerY + this.selectedFacePart.offsetY;
          this.dragOffset.x = x - px;
          this.dragOffset.y = y - py;
          this.selectedShape = null;
          this.canvas.setPointerCapture(e.pointerId);
          return;
        }
      }

      // Check shapes
      if (this.mode === 'symmetric' || this.mode === 'free') {
        this.selectedShape = this.findShapeAt(x, y);
        if (this.selectedShape) {
          this.dragOffset.x = x - this.selectedShape.x;
          this.dragOffset.y = y - this.selectedShape.y;
          this.selectedFacePart = null;
          this.canvas.setPointerCapture(e.pointerId);
          this.saveHistory();
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (e.pointerId !== primaryPointerId) return;
      if (isPinching) return;

      const { x, y } = this.canvasCoords(e);

      if (this.selectedFacePart) {
        this.selectedFacePart.offsetX = x - this.dragOffset.x - this.centerX;
        this.selectedFacePart.offsetY = y - this.dragOffset.y - this.centerY;
        this.faceMode.constrainToSun(this.selectedFacePart);
        this.syncToServer();
        this.render();
        return;
      }

      if (this.selectedShape) {
        this.selectedShape.x = x - this.dragOffset.x;
        this.selectedShape.y = y - this.dragOffset.y;
        this.syncToServer();
        this.render();
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (e.pointerId !== primaryPointerId) return;
      primaryPointerId = null;

      if (this.selectedShape) {
        // Delete if dragged outside canvas
        const dx = this.selectedShape.x - this.centerX;
        const dy = this.selectedShape.y - this.centerY;
        if (Math.sqrt(dx * dx + dy * dy) > this.canvasRadius + SHAPE_SIZE) {
          this.shapes = this.shapes.filter(s => s.id !== this.selectedShape.id);
          this.syncToServer();
          this.render();
        }
      }

      this.selectedShape = null;
      this.selectedFacePart = null;
      try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    });

    // --- Touch events for pinch zoom + rotation ---
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        isPinching = true;
        const t1 = e.touches[0], t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);

        const target = this.selectedShape || this.selectedFacePart;
        if (target) {
          shapeInitScale = target.scale || 1;
          shapeInitAngle = target.angle || 0;
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && isPinching) {
        const t1 = e.touches[0], t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const currentAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);

        const target = this.selectedShape || this.selectedFacePart;
        if (target && initialPinchDist > 0) {
          // Scale
          let newScale = shapeInitScale * (currentDist / initialPinchDist);
          newScale = Math.max(SCALE_LIMITS.min, Math.min(SCALE_LIMITS.max, newScale));
          target.scale = newScale;

          // Rotation
          target.angle = shapeInitAngle + (currentAngle - initialPinchAngle);

          if (this.selectedFacePart) {
            this.faceMode.constrainToSun(this.selectedFacePart);
          }

          this.syncToServer();
          this.render();
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
        initialPinchDist = 0;
      }
    }, { passive: true });
  }

  canvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  findShapeAt(x, y) {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      const hitSize = (shape.size * (shape.scale || 1)) / 2 + 15;
      const dx = x - shape.x;
      const dy = y - shape.y;
      if (Math.sqrt(dx * dx + dy * dy) < hitSize) {
        return shape;
      }
    }
    return null;
  }

  // --- History / Undo ---
  saveHistory() {
    this.history.push({
      shapes: JSON.parse(JSON.stringify(this.shapes)),
      faceParts: JSON.parse(JSON.stringify(this.faceParts))
    });
    if (this.history.length > 20) this.history.shift();
  }

  undo() {
    if (this.history.length === 0) return;
    const prev = this.history.pop();
    this.shapes = prev.shapes;
    this.faceParts = prev.faceParts;
    this.syncToServer();
    this.render();
  }

  clearAll() {
    if (this.shapes.length === 0 && this.faceParts.length === 0) return;
    this.saveHistory();
    this.shapes = [];
    this.faceParts = [];
    this.syncToServer();
    this.render();
  }

  // --- Sync to server ---
  syncToServer() {
    this.client.updateState({
      shapes: this.shapes,
      faceParts: this.faceParts,
      sunSkin: this.sunSkin
    });
  }

  // --- Socket ---
  connectSocket() {
    this.client.connect();
    this.client.registerStudent({ sunSkin: this.sunSkin });

    this.client.on('init_state', (data) => {
      this.mode = data.mode;
      this.locked = data.locked;
      if (data.state) {
        this.shapes = data.state.shapes || [];
        this.faceParts = data.state.faceParts || [];
        this.sunSkin = data.state.sunSkin || 'cartoon';
      }
      this.updateModeUI();
      this.render();
    });

    this.client.on('mode_changed', (data) => {
      this.mode = data.mode;
      this.updateModeUI();
      this.render();
    });

    this.client.on('lock_changed', (data) => {
      this.locked = data.locked;
      this.updateLockUI();
    });
  }

  updateModeUI() {
    const modeLabel = document.getElementById('mode-label');
    const shapePanel = document.getElementById('shape-panel');
    const facePanel = document.getElementById('face-panel');

    const labels = {
      symmetric: '对称装饰模式',
      personify: '拟人化模式',
      free: '自由模式'
    };
    if (modeLabel) modeLabel.textContent = labels[this.mode] || '';

    // Show/hide panels based on mode
    if (shapePanel) {
      shapePanel.classList.toggle('visible', this.mode === 'symmetric' || this.mode === 'free');
    }
    if (this.mode === 'personify' || this.mode === 'free') {
      this.faceMode.show();
    } else {
      this.faceMode.hide();
    }
  }

  updateLockUI() {
    const lockOverlay = document.getElementById('lock-overlay');
    if (lockOverlay) {
      lockOverlay.classList.toggle('visible', this.locked);
    }
  }

  // --- Animation ---
  startAnimation() {
    const animate = () => {
      this.breathPhase += SUN_CONFIG.breathingSpeed;
      if (this.breathPhase > Math.PI * 2) this.breathPhase = 0;

      const breathScale = SUN_CONFIG.breathingMin +
        (SUN_CONFIG.breathingMax - SUN_CONFIG.breathingMin) *
        (Math.sin(this.breathPhase) + 1) / 2;

      this.render(breathScale);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  // --- Render ---
  render(breathScale = 1) {
    const ctx = this.ctx;

    // Background gradient
    const bgGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.canvasRadius
    );
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
    drawSun(ctx, this.centerX, this.centerY, this.canvasRadius, this.sunSkin, breathScale);

    // Draw shapes based on mode
    if (this.mode === 'symmetric') {
      this.renderSymmetric(ctx);
    } else if (this.mode === 'personify') {
      this.renderFaceParts(ctx);
    } else {
      // Free mode: both
      this.renderSymmetric(ctx);
      this.renderFaceParts(ctx);
    }

    ctx.restore();

    // Draw symmetry guides for symmetric/free mode
    if (this.mode === 'symmetric' || this.mode === 'free') {
      this.renderSymmetryGuides(ctx);
    }

    // Selection highlight
    this.renderSelectionHighlight(ctx);
  }

  renderSymmetric(ctx) {
    this.shapes.forEach(shape => {
      // Draw original
      drawShape(ctx, shape, shape.size);

      // Draw 3 mirror copies
      const mirrors = getMirroredPositions(shape, this.centerX, this.centerY);
      mirrors.slice(1).forEach(pos => {
        const mirroredShape = {
          ...shape,
          x: pos.x,
          y: pos.y,
          angle: pos.angle
        };
        drawShape(ctx, mirroredShape, shape.size);
      });
    });
  }

  renderFaceParts(ctx) {
    const sunR = getSunRadius(this.canvasRadius);
    this.faceParts.forEach(part => {
      drawFacePart(ctx, part, this.centerX, this.centerY, sunR);
    });
  }

  renderSymmetryGuides(ctx) {
    ctx.strokeStyle = 'rgba(255, 180, 100, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY - this.canvasRadius);
    ctx.lineTo(this.centerX, this.centerY + this.canvasRadius);
    ctx.moveTo(this.centerX - this.canvasRadius, this.centerY);
    ctx.lineTo(this.centerX + this.canvasRadius, this.centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  renderSelectionHighlight(ctx) {
    const target = this.selectedShape || this.selectedFacePart;
    if (!target) return;

    let x, y, radius;
    if (this.selectedShape) {
      x = target.x;
      y = target.y;
      radius = (target.size * (target.scale || 1)) / 2 + 8;
    } else {
      const sunR = getSunRadius(this.canvasRadius);
      x = this.centerX + target.offsetX;
      y = this.centerY + target.offsetY;
      radius = sunR * 0.4 * (target.scale || 1) + 8;
    }

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  const app = new StudentApp();
  app.init();
});
