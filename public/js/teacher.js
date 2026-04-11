class TeacherApp {
  constructor() {
    this.canvas = document.getElementById('preview-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.client = new SocketClient();
    this.shapes = [];
    this.mode = 'axisymmetric';
    this.breathPhase = 0;
    this.connectedCount = 0;
    this.isConnected = false;
    this.animationId = null;

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
      if (!this.isConnected) {
        this.isConnected = true;
        this.connectedCount++;
        document.getElementById('connection-count').textContent = `已连接：${this.connectedCount} 台设备`;
      }
    });

    this.client.socket.on('disconnect', () => {
      if (this.isConnected) {
        this.isConnected = false;
        this.connectedCount = Math.max(0, this.connectedCount - 1);
        document.getElementById('connection-count').textContent = `已连接：${this.connectedCount} 台设备`;
      }
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

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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
      // Original canvas is 800x800, center at (400, 400)
      // Working quadrant is bottom-left where x <= 400 and y >= 400
      return s.x <= 400 && s.y >= 400;
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
