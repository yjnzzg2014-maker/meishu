const SHAPE_SIZE = 200;

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
    this.isDisplaying = false;
    this.displayState = null;
    this.breathPhase = 0;
    this.animationId = null;
    this.history = [];
    this.activeShapeCategory = 'dots';
    this.selectedTintColor = null; // Current tint color selection

    // Throttle state
    this._syncTimer = null;
    this._syncPending = false;

    this.faceMode = new FaceMode(this);
  }

  async init() {
    const loader = document.getElementById('loader');
    await AssetLoader.loadAll();
    if (loader) loader.style.display = 'none';

    this.setupCanvas();
    this.renderShapePanel();
    this.renderColorPalette();
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

      const img = AssetLoader.get(`shape_${shape.id}`);
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

  renderColorPalette() {
    const container = document.getElementById('color-palette');
    if (!container) return;
    container.innerHTML = '';

    TINT_COLORS.forEach((color, idx) => {
      const swatch = document.createElement('button');
      swatch.className = 'color-swatch' + (color === this.selectedTintColor ? ' active' : '');
      if (color) {
        swatch.style.background = color;
      } else {
        // No-tint swatch: show as white with a cross pattern
        swatch.classList.add('no-tint');
      }

      swatch.addEventListener('click', () => {
        this.selectedTintColor = color;
        container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });

      container.appendChild(swatch);
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

    this.setupCategoryTabs();
  }

  addShape(type) {
    if (this.locked) return;

    const angle = Math.random() * Math.PI * 2;
    const sunR = getSunRadius(this.canvasRadius, this.mode);
    const minDist = sunR + SHAPE_SIZE;
    const maxDist = this.canvasRadius * 0.6;
    const distance = minDist + Math.random() * (maxDist - minDist);

    const newX = this.centerX + Math.cos(angle) * distance;
    const newY = this.centerY + Math.sin(angle) * distance;

    // Calculate angle pointing to center (bottom of shape faces center)
    const toCenterAngle = Math.atan2(this.centerY - newY, this.centerX - newX);
    // rotationOffset starts at 0, angle is the base pointing-to-center angle
    const rotationOffset = 0;

    const shape = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type,
      x: newX,
      y: newY,
      angle: toCenterAngle,
      rotationOffset: rotationOffset,
      size: SHAPE_SIZE,
      scale: 1
    };

    // Apply selected tint color
    if (this.selectedTintColor) {
      shape.tintColor = this.selectedTintColor;
    }

    this.saveHistory();
    this.shapes.push(shape);
    this.syncToServer();
    this.render();
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
    let shapeInitRotationOffset = 0;
    let isPinching = false;

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.locked) return;
      if (primaryPointerId !== null) return;
      primaryPointerId = e.pointerId;

      const { x, y } = this.canvasCoords(e);

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
        this.throttledSync();
        this.render();
        return;
      }

      if (this.selectedShape) {
        this.selectedShape.x = x - this.dragOffset.x;
        this.selectedShape.y = y - this.dragOffset.y;

        // Update angle to always point to center (bottom faces center)
        const toCenterAngle = Math.atan2(
          this.centerY - this.selectedShape.y,
          this.centerX - this.selectedShape.x
        );
        this.selectedShape.angle = toCenterAngle;

        this.throttledSync();
        this.render();
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (e.pointerId !== primaryPointerId) return;
      primaryPointerId = null;
      this._flushSync();

      if (this.selectedShape) {
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

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        isPinching = true;
        const t1 = e.touches[0], t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchAngle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);

        const target = this.selectedShape || this.selectedFacePart;
        if (target) {
          shapeInitScale = target.scale || 1;
          shapeInitRotationOffset = target.rotationOffset || 0;
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
          let newScale = shapeInitScale * (currentDist / initialPinchDist);
          newScale = Math.max(SCALE_LIMITS.min, Math.min(SCALE_LIMITS.max, newScale));
          target.scale = newScale;

          // Update rotation offset (relative to the pointing-to-center base angle)
          const relativeRotation = currentAngle - initialPinchAngle;
          target.rotationOffset = shapeInitRotationOffset + relativeRotation;

          if (this.selectedFacePart) {
            this.faceMode.constrainToSun(this.selectedFacePart);
          }

          this.throttledSync();
          this.render();
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
        initialPinchDist = 0;
        this._flushSync();
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
    // In symmetric mode, check all mirror positions; otherwise just the shape position
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      const hitSize = (shape.size * (shape.scale || 1)) / 2 + 15;

      if (this.mode === 'symmetric') {
        // Check all 4 mirror positions
        const mirrors = getMirroredPositions(shape, this.centerX, this.centerY);
        for (const pos of mirrors) {
          const dx = x - pos.x;
          const dy = y - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) < hitSize) {
            return shape;
          }
        }
      } else {
        const dx = x - shape.x;
        const dy = y - shape.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitSize) {
          return shape;
        }
      }
    }
    return null;
  }

  throttledSync() {
    this._syncPending = true;
    if (this._syncTimer) return;
    this._syncTimer = setTimeout(() => {
      this._syncTimer = null;
      if (this._syncPending) {
        this._syncPending = false;
        this.syncToServer();
      }
    }, 100);
  }

  _flushSync() {
    if (this._syncTimer) {
      clearTimeout(this._syncTimer);
      this._syncTimer = null;
    }
    if (this._syncPending) {
      this._syncPending = false;
      this.syncToServer();
    }
  }

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

  syncToServer() {
    this.client.updateState({
      shapes: this.shapes,
      faceParts: this.faceParts,
      sunSkin: this.sunSkin,
      canvasRadius: this.canvasRadius
    });
  }

  connectSocket() {
    this.client.connect();
    this.client.registerStudent({ sunSkin: this.sunSkin });

    this.client.on('init_state', (data) => {
      this.mode = data.mode;
      this.locked = data.locked;
      this.updateLockUI();
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

    // Reload assets when teacher adds/removes custom assets
    this.client.on('assets_updated', async () => {
      await AssetLoader.reloadCustomAssets();
      this.renderShapePanel();
      this.faceMode.renderPanel();
    });

    // Display broadcast from teacher
    this.client.on('display_broadcast', (data) => {
      this.showDisplayModal(data.state);
    });

    // Display closed by teacher
    this.client.on('display_closed_by_teacher', () => {
      this.hideDisplayModal();
    });
  }

  updateModeUI() {
    const modeLabel = document.getElementById('mode-label');
    const shapePanel = document.getElementById('shape-panel');

    const labels = {
      symmetric: '对称装饰模式',
      personify: '拟人化模式',
      free: '自由模式'
    };
    if (modeLabel) modeLabel.textContent = labels[this.mode] || '';

    if (shapePanel) {
      shapePanel.classList.toggle('visible', this.mode === 'symmetric' || this.mode === 'free');
    }
    if (this.mode === 'personify' || this.mode === 'free') {
      this.faceMode.show();
    } else {
      this.faceMode.hide();
    }

    // Show/hide color palette based on mode
    const colorBar = document.getElementById('color-bar');
    if (colorBar) {
      colorBar.classList.toggle('visible', this.mode === 'symmetric' || this.mode === 'free');
    }
  }

  updateLockUI() {
    const lockOverlay = document.getElementById('lock-overlay');
    if (lockOverlay) {
      lockOverlay.classList.toggle('visible', this.locked);
    }
  }

  showDisplayModal(state) {
    this.isDisplaying = true;
    this.displayState = state;

    const modal = document.getElementById('display-modal');
    const canvas = document.getElementById('display-canvas');
    const displayWaiting = document.getElementById('display-waiting');

    if (!canvas) return;

    // 渲染被展示学生的作品到 display-canvas
    this.renderDisplayCanvas(canvas, state);

    modal.classList.add('visible');
    displayWaiting.classList.remove('visible');
  }

  hideDisplayModal() {
    this.isDisplaying = false;
    const displayWaiting = document.getElementById('display-waiting');
    document.getElementById('display-modal').classList.remove('visible');
    displayWaiting.classList.add('visible');
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
    const skinImg = AssetLoader.get('sun_' + skin);
    if (skinImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(skinImg, 0, 0, size, size);
      ctx.restore();
    }

    // 绘制 shapes
    if (state.shapes) {
      state.shapes.forEach(shape => {
        drawShape(ctx, shape, shape.size);
      });
    }

    // 绘制 faceParts
    if (state.faceParts) {
      const displaySunR = size / 2 * SUN_CONFIG.personifyRadiusRatio;
      state.faceParts.forEach(part => {
        drawFacePart(ctx, part, size / 2, size / 2, displaySunR);
      });
    }
  }

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

  render(breathScale = 1) {
    const ctx = this.ctx;

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

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.canvasRadius - 3, 0, Math.PI * 2);
    ctx.clip();

    drawSun(ctx, this.centerX, this.centerY, this.canvasRadius, this.sunSkin, breathScale, this.mode);

    if (this.mode === 'symmetric') {
      this.renderSymmetric(ctx);
    } else if (this.mode === 'personify') {
      this.renderFaceParts(ctx);
    } else {
      this.renderSymmetric(ctx);
      this.renderFaceParts(ctx);
    }

    ctx.restore();

    if (this.mode === 'symmetric' || this.mode === 'free') {
      this.renderSymmetryGuides(ctx);
    }

    this.renderSelectionHighlight(ctx);
  }

  renderSymmetric(ctx) {
    this.shapes.forEach(shape => {
      drawShape(ctx, shape, shape.size);
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
    const sunR = getSunRadius(this.canvasRadius, this.mode);
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
      const sunR = getSunRadius(this.canvasRadius, this.mode);
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

document.addEventListener('DOMContentLoaded', () => {
  const app = new StudentApp();
  app.init();
});
