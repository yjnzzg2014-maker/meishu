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
