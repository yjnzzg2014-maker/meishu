const SHAPE_SIZE = 200;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  SUN_CONFIG.breathingSpeed = 0; // 禁用呼吸动画
}

class StudentApp {
  constructor() {
    this.canvas = document.getElementById('main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.breathingWrapper = document.getElementById('breathing-wrapper');
    this.shapePanel = document.getElementById('shape-panel');
    this.client = new SocketClient();

    this.shapes = [];
    this.faceParts = [];
    this.selectedShape = null;
    this.selectedFacePart = null;
    this.dragOffset = { x: 0, y: 0 };

    // Tap-to-cycle state for overlapping shapes
    this._lastTapPos = null;
    this._lastTapTime = 0;
    this._cycleIndex = 0;
    this._cycleShapes = [];

    this.mode = 'symmetric';
    this.sunSkin = 'clay';
    this.locked = false;
    this.breathPhase = 0;
    this.animationId = null;
    this.history = [];
    this.activeShapeCategory = 'dots';
    this.selectedTintColor = null; // Current tint color selection
    this._expandedHue = null; // current expanded hue key in color panel

    // Throttle state
    this._syncTimer = null;
    this._syncPending = false;

    // Render scheduling state
    this._breathAnimFrame = null;  // rAF ID for main animation loop
    this._renderDirty = false;     // flag: render needed on next rAF tick
    this._canvasRect = null;       // cached getBoundingClientRect()
    this._localSaveTimer = null;   // debounce timer for localStorage writes

    // Session ID for reconnect handling
    this.sessionId = localStorage.getItem('sun_decorator_sessionId');

    // Fruit name assigned by server
    this.fruitName = null;

    // Gallery animation instance
    this._galleryAnimation = null;

    // Socket state flags
    this._socketConnecting = false;
    this._socketConnected = false;
    this._wasRegistered = false;

    this.faceMode = new FaceMode(this);
  }

  async init() {
    const loader = document.getElementById('loader');
    await AssetLoader.loadAll();

    // Show start button
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      startBtn.hidden = false;
      startBtn.addEventListener('click', () => this.startDrawing());
    }
  }

  startDrawing() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    this.toggleFullscreen();

    this.setupCanvas();
    this.renderShapePanel();
    this.renderColorPanel();
    this.setupSkinSelector();
    this.setupToolbar();
    this.setupTouchHandlers();
    this.connectSocket();
    this.faceMode.init();
    this.updateModeUI();
    this.startAnimation();
    this.setupFullscreen();
  }

  setupFullscreen() {
    const exitBtn = document.getElementById('btn-exit-fullscreen');
    if (exitBtn) {
      exitBtn.hidden = false;
      exitBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // 全屏状态变化时重新计算画布和面板尺寸
    document.addEventListener('fullscreenchange', () => {
      if (exitBtn) {
        exitBtn.hidden = !document.fullscreenElement;
      }
      this.setupCanvas();
      this.render();
    });

    // 窗口 resize 时同步重算（旋转屏幕、分屏等场景）
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.render();
    });
  }

  async toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen not supported or denied');
    }
  }

  setupCanvas() {
    const availW = window.innerWidth;
    const availH = window.innerHeight;

    // 画布 = min(vw, vh)，不再减去 16px gap → 横屏正好填满高度
    const size = Math.max(100, Math.min(availW, availH));

    // panelW：两侧剩余空间各取一半，完整填满画布两侧；下限 64px 兜底竖屏/方屏
    const panelW = Math.max(64, Math.floor((availW - size) / 2));

    // Use actual device pixel ratio (capped at 2) instead of hardcoded ×2.
    // On low-end tablets (DPR=1 or 1.5) this reduces canvas pixels by 44–75%.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasSize = Math.round(size * dpr);
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';

    this.centerX = canvasSize / 2;
    this.centerY = canvasSize / 2;
    this.canvasRadius = canvasSize / 2;

    ['shape-panel', 'face-panel', 'color-panel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.width = panelW + 'px';
    });

    // Invalidate cached rect after layout changes
    requestAnimationFrame(() => { this._canvasRect = this.canvas.getBoundingClientRect(); });
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

  renderColorPanel() {
    const list = document.getElementById('color-rainbow-list');
    if (!list) return;
    list.innerHTML = '';
    list.appendChild(this._buildHueRow(null));
    TINT_COLOR_GROUPS.forEach(g => list.appendChild(this._buildHueRow(g)));
  }

  _buildHueRow(group) {
    const isNoTint = group === null;
    const hueKey = isNoTint ? '__no_tint__' : group.hue;
    const wrapper = document.createElement('div');

    const row = document.createElement('div');
    row.className = 'color-hue-row' + (this._isHueSelected(group) ? ' selected-hue' : '');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', isNoTint ? '原色（无染色）' : group.name + '色系');

    const name = document.createElement('span');
    name.className = 'color-hue-name';
    name.textContent = isNoTint ? '原' : group.name;
    row.appendChild(name);

    if (isNoTint) {
      row.appendChild(Object.assign(document.createElement('div'), { className: 'no-tint-bar' }));
    } else {
      const bar = document.createElement('div');
      bar.className = 'color-hue-bar';
      group.shades.forEach(shade => {
        const seg = document.createElement('div');
        seg.className = 'color-hue-bar-segment';
        seg.style.background = shade;
        bar.appendChild(seg);
      });
      row.appendChild(bar);
    }

    const indicator = document.createElement('div');
    indicator.className = 'color-hue-indicator';
    const curShade = isNoTint ? null : this._currentShadeForHue(group);
    if (curShade) indicator.style.background = curShade;
    row.appendChild(indicator);

    row.addEventListener('click', () => {
      if (isNoTint) {
        this.selectedTintColor = null;
        this._expandedHue = null;
      } else {
        this._expandedHue = (this._expandedHue === hueKey) ? null : hueKey;
      }
      this.renderColorPanel();
    });

    wrapper.appendChild(row);

    if (!isNoTint) {
      const grid = document.createElement('div');
      grid.className = 'shade-grid' + (this._expandedHue === hueKey ? ' expanded' : '');
      group.shades.forEach(shade => {
        const sw = document.createElement('button');
        sw.className = 'shade-swatch' + (this.selectedTintColor === shade ? ' active' : '');
        sw.style.background = shade;
        sw.setAttribute('aria-label', shade);
        sw.addEventListener('click', e => {
          e.stopPropagation();
          this.selectedTintColor = shade;
          this._expandedHue = null;
          this.renderColorPanel();
        });
        grid.appendChild(sw);
      });
      wrapper.appendChild(grid);
    }

    return wrapper;
  }

  _isHueSelected(group) {
    if (group === null) return this.selectedTintColor === null;
    return group.shades.includes(this.selectedTintColor);
  }

  _currentShadeForHue(group) {
    if (!group) return null;
    return group.shades.find(s => s === this.selectedTintColor) || null;
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

  updateSkinSelectorUI() {
    const container = document.getElementById('skin-selector');
    if (!container) return;
    container.querySelectorAll('.skin-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.skinId === this.sunSkin);
    });
  }

  setupToolbar() {
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-clear')?.addEventListener('click', () => this.clearAll());
    document.getElementById('btn-copy')?.addEventListener('click', () => this.copySelected());
    document.getElementById('btn-delete')?.addEventListener('click', () => this.deleteSelected());
    this.setupCategoryTabs();
  }

  setSelectedShape(shape) {
    this.selectedShape = shape;
    this._updateSelectionToolbar();
  }

  _updateSelectionToolbar() {
    const hasSelection = !!(this.selectedShape || this.selectedFacePart);
    ['btn-copy', 'btn-delete'].forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle('active', hasSelection);
      btn.disabled = !hasSelection;
    });
  }

  copySelected() {
    if (!this.selectedShape) return;
    this.saveHistory();
    const clone = {
      ...JSON.parse(JSON.stringify(this.selectedShape)),
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      x: this.selectedShape.x + 30,
      y: this.selectedShape.y + 30,
    };
    this.shapes.push(clone);
    this.setSelectedShape(clone);
    this.syncToServer();
    this.render();
  }

  deleteSelected() {
    if (!this.selectedShape) return;
    this.saveHistory();
    this.shapes = this.shapes.filter(s => s.id !== this.selectedShape.id);
    this.setSelectedShape(null);
    this._hideCycleIndicator();
    this.syncToServer();
    this.render();
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
    // Tracks whether the active drag was interrupted by a system pointercancel
    // (Huawei side-panel / palm rejection) so we can re-adopt the pointer seamlessly.
    let dragCancelled = false;
    let dragCancelledAt = 0;
    const CANCEL_RECOVERY_MS = 500;

    // Prevent native text selection and context menu on long press
    this.canvas.addEventListener('selectstart', (e) => e.preventDefault());
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.locked) return;
      if (primaryPointerId !== null) return;

      const { x, y } = this.canvasCoords(e);

      // Re-adopt pointer after a system-cancelled drag (Huawei gesture interference).
      // Skip cycling logic and recalculate offsets to avoid a jump.
      if (dragCancelled && (Date.now() - dragCancelledAt) < CANCEL_RECOVERY_MS &&
          (this.selectedShape || this.selectedFacePart)) {
        dragCancelled = false;
        primaryPointerId = e.pointerId;
        if (this.selectedShape) {
          this.dragOffset.x = x - this.selectedShape.x;
          this.dragOffset.y = y - this.selectedShape.y;
          this.canvas.setPointerCapture(e.pointerId);
        } else if (this.selectedFacePart) {
          this.dragOffset.x = x - (this.centerX + this.selectedFacePart.offsetX);
          this.dragOffset.y = y - (this.centerY + this.selectedFacePart.offsetY);
          this.canvas.setPointerCapture(e.pointerId);
        }
        return;
      }

      dragCancelled = false;
      primaryPointerId = e.pointerId;

      if (this.mode === 'personify' || this.mode === 'free') {
        this.selectedFacePart = this.faceMode.findPartAt(x, y);
        if (this.selectedFacePart) {
          const px = this.centerX + this.selectedFacePart.offsetX;
          const py = this.centerY + this.selectedFacePart.offsetY;
          this.dragOffset.x = x - px;
          this.dragOffset.y = y - py;
          this.setSelectedShape(null);
          this.canvas.setPointerCapture(e.pointerId);
          return;
        }
      }

      if (this.mode === 'symmetric' || this.mode === 'free') {
        const found = this.findShapeAt(x, y);
        this.setSelectedShape(found);
        if (found) {
          this.dragOffset.x = x - found.x;
          this.dragOffset.y = y - found.y;
          this.selectedFacePart = null;
          this.canvas.setPointerCapture(e.pointerId);
          this.saveHistory();
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      // Re-adopt pointer seamlessly if a system cancel interrupted an active drag.
      if (primaryPointerId === null && dragCancelled &&
          (Date.now() - dragCancelledAt) < CANCEL_RECOVERY_MS &&
          (this.selectedShape || this.selectedFacePart)) {
        dragCancelled = false;
        isPinching = false;
        primaryPointerId = e.pointerId;
        const { x, y } = this.canvasCoords(e);
        if (this.selectedShape) {
          this.dragOffset.x = x - this.selectedShape.x;
          this.dragOffset.y = y - this.selectedShape.y;
        } else if (this.selectedFacePart) {
          this.dragOffset.x = x - (this.centerX + this.selectedFacePart.offsetX);
          this.dragOffset.y = y - (this.centerY + this.selectedFacePart.offsetY);
        }
      }

      if (e.pointerId !== primaryPointerId) return;
      if (isPinching) return;

      const { x, y } = this.canvasCoords(e);

      if (this.selectedFacePart) {
        this.selectedFacePart.offsetX = x - this.dragOffset.x - this.centerX;
        this.selectedFacePart.offsetY = y - this.dragOffset.y - this.centerY;
        this.faceMode.constrainToSun(this.selectedFacePart);
        this.throttledSync();
        this._scheduleRender();
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
        this._scheduleRender();
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      if (e.pointerId !== primaryPointerId) return;
      primaryPointerId = null;
      dragCancelled = false;
      this._flushSync();

      if (this.selectedShape) {
        const dx = this.selectedShape.x - this.centerX;
        const dy = this.selectedShape.y - this.centerY;
        if (Math.sqrt(dx * dx + dy * dy) > this.canvasRadius + SHAPE_SIZE) {
          this.shapes = this.shapes.filter(s => s.id !== this.selectedShape.id);
          this.setSelectedShape(null);
          this.syncToServer();
          this.render();
          try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
          return;
        }
      }

      // 仅结束 face part 拖拽；shape 选中保持，直到用户点击空白区域
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
          this._scheduleRender();
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

    // touchcancel: 系统中断（如来电、通知、导航栏滑动）时重置 pinch 状态
    this.canvas.addEventListener('touchcancel', (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
        initialPinchDist = 0;
        this._flushSync();
      }
    }, { passive: true });

    // pointercancel: 系统中断（华为侧边栏、手掌误触等）时标记为可恢复状态，
    // 而非直接丢弃拖拽。500ms 内手指仍在移动可无缝续接。
    this.canvas.addEventListener('pointercancel', (e) => {
      if (e.pointerId === primaryPointerId) {
        primaryPointerId = null;
        isPinching = false;  // 防止 isPinching 卡死
        dragCancelled = !!(this.selectedShape || this.selectedFacePart);
        dragCancelledAt = Date.now();
        this._flushSync();
        try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    });
  }

  canvasCoords(e) {
    const rect = this._canvasRect || (this._canvasRect = this.canvas.getBoundingClientRect());
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  findShapesAt(x, y) {
    const hits = [];
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      const hitSize = (shape.size * (shape.scale || 1)) / 2 + 15;
      const dx = x - shape.x, dy = y - shape.y;
      if (dx * dx + dy * dy < hitSize * hitSize) hits.push(shape);
    }
    return hits;
  }

  findShapeAt(x, y) {
    const CYCLE_R = 40;
    const CYCLE_TIMEOUT = 1200;
    const now = Date.now();
    const hits = this.findShapesAt(x, y);

    if (hits.length === 0) {
      this._lastTapPos = null; this._cycleShapes = []; this._hideCycleIndicator();
      return null;
    }
    if (hits.length === 1) {
      this._lastTapPos = { x, y }; this._lastTapTime = now;
      this._cycleIndex = 0; this._cycleShapes = hits; this._hideCycleIndicator();
      return hits[0];
    }

    const isSamePos = this._lastTapPos &&
      Math.hypot(x - this._lastTapPos.x, y - this._lastTapPos.y) < CYCLE_R;
    const isRecent = (now - this._lastTapTime) < CYCLE_TIMEOUT;

    if (isSamePos && isRecent) {
      this._cycleIndex = (this._cycleIndex + 1) % hits.length;
    } else {
      this._cycleIndex = 0;
    }
    this._lastTapPos = { x, y }; this._lastTapTime = now; this._cycleShapes = hits;
    this._showCycleIndicator(x, y, this._cycleIndex + 1, hits.length);
    return hits[this._cycleIndex];
  }

  _showCycleIndicator(canvasX, canvasY, current, total) {
    const el = document.getElementById('overlap-indicator');
    const counter = document.getElementById('overlap-counter');
    if (!el || !counter) return;
    counter.textContent = `${current}/${total}`;
    el.hidden = false;
    const rect = this.canvas.getBoundingClientRect();
    const sx = rect.left + canvasX * (rect.width / this.canvas.width);
    const sy = rect.top  + canvasY * (rect.height / this.canvas.height);
    el.style.left = (sx + 16) + 'px';
    el.style.top  = (sy - 32) + 'px';
  }

  _hideCycleIndicator() {
    const el = document.getElementById('overlap-indicator');
    if (el) el.hidden = true;
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
    const last = this.history[this.history.length - 1];
    const now = Date.now();

    // 100ms 内的操作合并
    if (last && now - last.timestamp < 100) {
      last.shapes = JSON.parse(JSON.stringify(this.shapes));
      last.faceParts = JSON.parse(JSON.stringify(this.faceParts));
      // 不push新记录，更新timestamp
      last.timestamp = now;
      return;
    }

this.history.push({
      shapes: JSON.parse(JSON.stringify(this.shapes)),
      faceParts: JSON.parse(JSON.stringify(this.faceParts)),
      timestamp: now
    });

// 限制历史记录长度
    if (this.history.length > 20) {
      this.history.shift();
    }
  }

  undo() {
    if (this.history.length === 0) return;
    const prev = this.history.pop();
    this.shapes = prev.shapes;
    this.faceParts = prev.faceParts;
    this._lastTapPos = null; this._cycleShapes = [];
    this.setSelectedShape(null);
    this._hideCycleIndicator();
    this.syncToServer();
    this.render();
  }

  clearAll() {
    if (this.shapes.length === 0 && this.faceParts.length === 0) return;
    this.saveHistory();
    this.shapes = [];
    this.faceParts = [];
    this._lastTapPos = null; this._cycleShapes = [];
    this.setSelectedShape(null);
    this._hideCycleIndicator();
    this.syncToServer();
    this.render();
  }

  saveStateToLocal() {
    // Debounce localStorage writes: Android WebView flushes to disk synchronously
    // on every setItem call, blocking the main thread for 50-200ms.
    // Batch writes so at most one flush happens per 800ms of inactivity.
    if (this._localSaveTimer) clearTimeout(this._localSaveTimer);
    this._localSaveTimer = setTimeout(() => {
      this._localSaveTimer = null;
      try {
        localStorage.setItem('sun_decorator_state', JSON.stringify({
          shapes: this.shapes,
          faceParts: this.faceParts,
          sunSkin: this.sunSkin,
        }));
      } catch(e) {}
    }, 800);
  }

  syncToServer() {
    this.client.updateState({
      shapes: this.shapes,
      faceParts: this.faceParts,
      sunSkin: this.sunSkin,
      canvasRadius: this.canvasRadius
    });
    this.saveStateToLocal();
  }

  connectSocket() {
    // Prevent multiple socket connections
    if (this._socketConnecting || this._socketConnected) {
      console.log('Socket already connecting or connected, skipping');
      return;
    }

    this._socketConnecting = true;

    window.addEventListener('beforeunload', () => {
      // Flush immediately on page close — bypass the debounce timer
      if (this._localSaveTimer) { clearTimeout(this._localSaveTimer); this._localSaveTimer = null; }
      try {
        localStorage.setItem('sun_decorator_state', JSON.stringify({
          shapes: this.shapes, faceParts: this.faceParts, sunSkin: this.sunSkin,
        }));
      } catch(e) {}
    });

    this.client.connect();

    // Set sessionId on client if we have one
    if (this.sessionId) {
      this.client.setSessionId(this.sessionId);
    }

    this.client.registerStudent({ sunSkin: this.sunSkin });

    // Handle socket.io connect event
    this.client.on('connect', () => {
      console.log('=== SOCKET CONNECT EVENT ===');
      console.log('  sessionId:', this.sessionId);
      console.log('  _wasRegistered:', this._wasRegistered);
      console.log('  socket.id:', this.client.socket?.id);
      this._socketConnected = true;
      this._socketConnecting = false;

      // Always register when connected - server will determine if it's a reconnect
      if (this.sessionId) {
        console.log('  Registering with sessionId:', this.sessionId);
        this.client.registerStudent({ sunSkin: this.sunSkin });
      }
    });

    // Monitor network status changes
    window.addEventListener('online', () => {
      console.log('=== NETWORK ONLINE EVENT ===');
      console.log('  sessionId:', this.sessionId);
      console.log('  socket.connected:', this.client.socket?.connected);
      console.log('  socket.id:', this.client.socket?.id);

      // If socket exists but not connected after network comes back,
      // force a complete reconnection
      if (this.client.socket && !this.client.socket.connected && this.sessionId) {
        console.log('  Network is back but socket disconnected, forcing full reconnection...');
        // Wait a bit for network to stabilize
        setTimeout(() => {
          if (!this.client.socket?.connected) {
            console.log('  Still disconnected, recreating socket...');
            this.client.forceReconnect();
          }
        }, 2000);
      }
    });

    // No need for periodic checks - Socket.IO handles reconnection automatically

    // Handle disconnect - show overlay and auto-lock
    this.client.on('disconnect', (data) => {
      console.log('STUDENT DISCONNECTED, reason:', data.reason);
      this.locked = true;
      this.updateLockUI();
      this.showReconnectOverlay();
    });

    // Handle reconnect - hide overlay and restore state
    this.client.on('reconnect', (data) => {
      console.log('=== RECONNECT EVENT ===');
      console.log('  this.sessionId:', this.sessionId);
      console.log('  sessionStorage:', sessionStorage.getItem('sun_decorator_sessionId'));
      console.log('  this._wasRegistered:', this._wasRegistered);
      // Re-register with same sessionId only if we were registered before
      if (this.sessionId && this._wasRegistered) {
        console.log('  Re-registering with sessionId:', this.sessionId);
        this.client.setSessionId(this.sessionId);
        this.client.registerStudent({ sunSkin: this.sunSkin });
      } else {
        console.log('  Skipping re-registration, sessionId or _wasRegistered is false');
      }
    });

    this.client.on('init_state', (data) => {
      console.log('Received init_state:', { isReconnect: data.isReconnect, shapes: data.state?.shapes?.length });
      this._wasRegistered = true;
      this._initStateReceived = true; // Mark that we received init_state
      this.mode = data.mode;
      this.locked = data.locked;
      this.updateLockUI();

      // Save sessionId for future reconnects
      if (data.sessionId) {
        this.sessionId = data.sessionId;
        localStorage.setItem('sun_decorator_sessionId', data.sessionId);
        this.client.setSessionId(this.sessionId);
        console.log('SessionId saved:', this.sessionId);
      }

      // Show fruit name inside mode capsule
      if (data.fruitName) {
        this.fruitName = data.fruitName;
        const el = document.getElementById('student-fruit-name');
        const sep = document.querySelector('.capsule-sep');
        if (el) { el.textContent = data.fruitName; el.hidden = false; }
        if (sep) sep.hidden = false;
      }

      // If this is a reconnection, clear local state and use server state
      if (data.isReconnect) {
        console.log('Restoring state from server after reconnect');
        this.shapes = [];
        this.faceParts = [];
      }

      if (data.state) {
        this.shapes = data.state.shapes || [];
        this.faceParts = data.state.faceParts || [];
        this.sunSkin = data.state.sunSkin || this.sunSkin;
        this.updateSkinSelectorUI();
      }

      // If not reconnect and server returned empty state, try localStorage fallback
      if (!data.isReconnect && this.shapes.length === 0 && this.faceParts.length === 0) {
        try {
          const saved = localStorage.getItem('sun_decorator_state');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.shapes && parsed.shapes.length > 0) {
              this.shapes = parsed.shapes;
              this.faceParts = parsed.faceParts || [];
              this.sunSkin = parsed.sunSkin || this.sunSkin;
              this.syncToServer();
              console.log('Restored state from localStorage fallback');
            }
          }
        } catch(e) {}
      }

      this.updateModeUI();
      this.render();

      // Hide reconnect overlay after state is restored
      this.hideReconnectOverlay();
      console.log('init_state processed, locked:', this.locked);
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

    this.client.on('showcase_start', (data) => {
      const isSelf = this.client.socket && this.client.socket.id === data.studentId;
      if (isSelf) {
        // This student is being showcased — show notice, don't block canvas
        const notice = document.getElementById('showcase-self-notice');
        if (notice) notice.hidden = false;
        return;
      }
      const overlay = document.getElementById('showcase-overlay');
      const nameEl = document.getElementById('showcase-fruit-name');
      const canvas = document.getElementById('showcase-canvas');
      if (!overlay || !canvas) return;
      if (nameEl) nameEl.textContent = data.fruitName || '';
      overlay.hidden = false;
      this._renderShowcaseState(canvas, data.state);
    });

    this.client.on('showcase_update', (data) => {
      const canvas = document.getElementById('showcase-canvas');
      if (!canvas || document.getElementById('showcase-overlay')?.hidden) return;
      this._renderShowcaseState(canvas, data.state);
    });

    this.client.on('showcase_end', () => {
      const overlay = document.getElementById('showcase-overlay');
      if (overlay) overlay.hidden = true;
      const notice = document.getElementById('showcase-self-notice');
      if (notice) notice.hidden = true;
    });

    this.client.on('gallery_start', (data) => {
      const overlay = document.getElementById('gallery-overlay');
      const canvas = document.getElementById('gallery-canvas');
      if (!overlay || !canvas) return;
      overlay.hidden = false;
      if (this._galleryAnimation) this._galleryAnimation.stop();
      this._galleryAnimation = new GalleryAnimation(canvas, data.artworks);
      this._galleryAnimation.start();
    });

    this.client.on('gallery_end', () => {
      if (this._galleryAnimation) {
        this._galleryAnimation.stop();
        this._galleryAnimation = null;
      }
      const overlay = document.getElementById('gallery-overlay');
      if (overlay) overlay.hidden = true;
    });

    this.client.on('force_reset', () => {
      // Clear all local state
      this.shapes = [];
      this.faceParts = [];
      this.history = [];
      this.setSelectedShape(null);
      this._hideCycleIndicator();
      // Clear saved session so server assigns a fresh one
      localStorage.removeItem('sun_decorator_sessionId');
      localStorage.removeItem('sun_decorator_state');
      this.sessionId = null;
      this.client.sessionId = null;
      this.client._registered = false;
      // Hide any overlays
      const galleryOverlay = document.getElementById('gallery-overlay');
      if (galleryOverlay) galleryOverlay.hidden = true;
      if (this._galleryAnimation) { this._galleryAnimation.stop(); this._galleryAnimation = null; }
      const showcaseOverlay = document.getElementById('showcase-overlay');
      if (showcaseOverlay) showcaseOverlay.hidden = true;
      const notice = document.getElementById('showcase-self-notice');
      if (notice) notice.hidden = true;
      // Re-register as new student
      this.client.socket.emit('register_student', { sunSkin: this.sunSkin, sessionId: null });
      this.render();
    });

  }

  _renderShowcaseState(canvas, state) {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.85;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    const cx = size, cy = size, r = size;
    const skinId = state.sunSkin || 'clay';
    const srcR = state.canvasRadius || 400;
    const scale = r / srcR;
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSun(ctx, cx, cy, r, skinId, 1, 'symmetric');
    (state.shapes || []).forEach(shape => {
      const dx = shape.x - srcR, dy = shape.y - srcR;
      const scaled = { ...shape, x: cx + dx * scale, y: cy + dy * scale, size: shape.size * scale };
      drawShape(ctx, scaled, scaled.size);
    });
    const sunR = getSunRadius(r, 'personify');
    (state.faceParts || []).forEach(part => {
      const sp = { ...part, offsetX: part.offsetX * scale, offsetY: part.offsetY * scale };
      drawFacePart(ctx, sp, cx, cy, sunR);
    });
    ctx.restore();
  }

  updateModeUI() {
    const modeLabel = document.getElementById('mode-label');
    const shapePanel = document.getElementById('shape-panel');
    const colorPanel = document.getElementById('color-panel');

    const labels = { symmetric: '装饰模式', personify: '人脸模式' };
    if (modeLabel) modeLabel.textContent = labels[this.mode] || '';

    const isDecorate = this.mode === 'symmetric';

    if (shapePanel) shapePanel.classList.toggle('visible', isDecorate);
    if (colorPanel) colorPanel.classList.toggle('visible', isDecorate);

    if (this.mode === 'personify') {
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

  showReconnectOverlay() {
    const overlay = document.getElementById('reconnect-overlay');
    if (overlay) {
      overlay.classList.add('visible');
      overlay.hidden = false;
    }
  }

  hideReconnectOverlay() {
    const overlay = document.getElementById('reconnect-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
      overlay.hidden = true;
    }
  }

  _checkAndReconnect() {
    // Just rely on Socket.IO's built-in reconnection
    console.log('  Socket.IO will handle reconnection automatically');
  }

  startAnimation() {
    // Always run a persistent rAF loop so the browser treats this page as a
    // continuous animation and maintains full frame priority (prevents Android's
    // sporadic-rAF throttling that kicks in after ~10 one-shot rAF calls).
    // Renders are gated by _renderDirty to avoid unnecessary GPU work when idle.
    this._renderDirty = true;
    let breathPhase = 0;
    const tick = () => {
      this._breathAnimFrame = requestAnimationFrame(tick);
      if (!prefersReducedMotion && SUN_CONFIG.breathingSpeed > 0) {
        breathPhase += SUN_CONFIG.breathingSpeed;
        this.render(1 + Math.sin(breathPhase) * 0.02);
      } else if (this._renderDirty) {
        this._renderDirty = false;
        this.render();
      }
    };
    tick();
  }

  // Signal that the canvas needs to be redrawn on the next rAF tick.
  _scheduleRender() {
    this._renderDirty = true;
  }

  render(breathScale = 1) {
    const ctx = this.ctx;
    const canvasSize = this.canvasRadius * 2;
    const left = this.centerX - this.canvasRadius;
    const top = this.centerY - this.canvasRadius;

    // White square background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(left, top, canvasSize, canvasSize);

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, canvasSize, canvasSize);
    ctx.clip();

    drawSun(ctx, this.centerX, this.centerY, this.canvasRadius, this.sunSkin, breathScale, this.mode);

    this.renderShapes(ctx);

    if (this.mode === 'personify' || this.mode === 'free') {
      this.renderFaceParts(ctx);
    }

    ctx.restore();

    this.renderSelectionHighlight(ctx);
  }

  renderShapes(ctx) {
    this.shapes.forEach(shape => {
      drawShape(ctx, shape, shape.size);
    });
  }

  renderFaceParts(ctx) {
    const sunR = getSunRadius(this.canvasRadius, this.mode);
    this.faceParts.forEach(part => {
      drawFacePart(ctx, part, this.centerX, this.centerY, sunR);
    });
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
