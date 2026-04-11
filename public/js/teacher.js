class TeacherApp {
  constructor() {
    this.client = new SocketClient();
    this.students = new Map(); // id -> { state, canvas, ctx }
    this.mode = 'symmetric';
    this.locked = false;
    this.breathPhase = 0;
    this.animationId = null;
    this.zoomedStudentId = null;

    this.init();
  }

  async init() {
    await AssetLoader.loadAll();
    document.getElementById('loader')?.remove();

    this.setupControls();
    this.connectSocket();
    this.startAnimation();
  }

  setupControls() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.setMode(mode);
      });
    });

    // Lock button
    const lockBtn = document.getElementById('btn-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        this.locked = !this.locked;
        this.client.toggleLock(this.locked);
        lockBtn.classList.toggle('active', this.locked);
        lockBtn.textContent = this.locked ? '已锁定' : '锁定操作';
      });
    }

    // Close zoom button
    const closeZoom = document.getElementById('close-zoom');
    if (closeZoom) {
      closeZoom.addEventListener('click', () => this.closeZoom());
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.client.changeMode(mode);
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  connectSocket() {
    this.client.connect();
    this.client.registerTeacher();

    this.client.on('teacher_init', (data) => {
      this.mode = data.mode;
      this.locked = data.locked;

      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === this.mode);
      });

      const lockBtn = document.getElementById('btn-lock');
      if (lockBtn) {
        lockBtn.classList.toggle('active', this.locked);
        lockBtn.textContent = this.locked ? '已锁定' : '锁定操作';
      }

      // Initialize student entries
      if (data.students) {
        data.students.forEach(s => {
          this.addStudentEntry(s.id || s.socketId, s);
        });
      }
      this.updateStudentCount();
    });

    this.client.on('student_joined', (data) => {
      this.addStudentEntry(data.id, { shapes: [], faceParts: [], sunSkin: data.sunSkin, name: data.name });
      this.updateStudentCount();
    });

    this.client.on('student_left', (data) => {
      this.removeStudentEntry(data.id);
      this.updateStudentCount();
      if (this.zoomedStudentId === data.id) {
        this.closeZoom();
      }
    });

    this.client.on('student_updated', (data) => {
      const entry = this.students.get(data.id);
      if (entry) {
        entry.state = data.state;
      }
    });

    this.client.on('student_count', (data) => {
      this.updateStudentCountDisplay(data.count);
    });

    this.client.on('mode_changed', (data) => {
      this.mode = data.mode;
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === this.mode);
      });
    });

    this.client.on('students_summary', (summaries) => {
      // Update student count from summaries
      this.updateStudentCountDisplay(summaries.length);
    });
  }

  addStudentEntry(id, state) {
    if (this.students.has(id)) {
      this.students.get(id).state = state;
      return;
    }

    const grid = document.getElementById('student-grid');
    if (!grid) return;

    // Create thumbnail card
    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.studentId = id;

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    canvas.className = 'student-thumb';
    card.appendChild(canvas);

    const label = document.createElement('div');
    label.className = 'student-label';
    label.textContent = state.name || 'Student';
    card.appendChild(label);

    card.addEventListener('click', () => this.zoomStudent(id));

    grid.appendChild(card);

    this.students.set(id, {
      state: state,
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      card: card
    });
  }

  removeStudentEntry(id) {
    const entry = this.students.get(id);
    if (entry && entry.card) {
      entry.card.remove();
    }
    this.students.delete(id);
  }

  updateStudentCount() {
    this.updateStudentCountDisplay(this.students.size);
  }

  updateStudentCountDisplay(count) {
    const el = document.getElementById('student-count');
    if (el) el.textContent = `${count} 位学生在线`;

    const empty = document.getElementById('empty-state');
    if (empty) empty.style.display = this.students.size === 0 ? 'block' : 'none';
  }

  // --- Zoom view ---
  zoomStudent(id) {
    this.zoomedStudentId = id;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.add('visible');

    // Request latest state
    this.client.getStudentState(id);

    this.client.on('student_state', (data) => {
      if (data.id === this.zoomedStudentId) {
        const entry = this.students.get(data.id);
        if (entry) entry.state = data.state;
      }
    });
  }

  closeZoom() {
    this.zoomedStudentId = null;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.remove('visible');
  }

  // --- Animation ---
  startAnimation() {
    const animate = () => {
      this.breathPhase += SUN_CONFIG.breathingSpeed;
      if (this.breathPhase > Math.PI * 2) this.breathPhase = 0;

      const breathScale = SUN_CONFIG.breathingMin +
        (SUN_CONFIG.breathingMax - SUN_CONFIG.breathingMin) *
        (Math.sin(this.breathPhase) + 1) / 2;

      this.renderAll(breathScale);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  renderAll(breathScale) {
    // Render each student thumbnail
    this.students.forEach((entry, id) => {
      this.renderStudentCanvas(entry, breathScale);
    });

    // Render zoom view if open
    if (this.zoomedStudentId) {
      this.renderZoomView(breathScale);
    }
  }

  renderStudentCanvas(entry, breathScale) {
    const ctx = entry.ctx;
    const w = entry.canvas.width;
    const h = entry.canvas.height;
    const cx = w / 2, cy = h / 2, r = w / 2 - 5;

    // Background
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    bg.addColorStop(0, '#FFF8E7');
    bg.addColorStop(0.7, '#FFE8D0');
    bg.addColorStop(1, '#FFDAB3');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
    ctx.clip();

    // Sun
    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale);

    // Shapes
    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];

    // Need to scale shapes from student canvas coords to thumbnail coords
    // Student canvas is typically ~700-800px wide, thumbnail is 240px
    // We'll normalize: student canvasRadius maps to thumbnail r
    const studentCanvasRadius = 400; // Half of typical 800px canvas
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);

        const mirrors = getMirroredPositions(scaled, cx, cy);
        mirrors.slice(1).forEach(pos => {
          drawShape(ctx, { ...scaled, x: pos.x, y: pos.y, angle: pos.angle }, scaled.size);
        });
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r);
      faceParts.forEach(part => {
        const scaledPart = {
          ...part,
          offsetX: part.offsetX * scaleFactor,
          offsetY: part.offsetY * scaleFactor
        };
        drawFacePart(ctx, scaledPart, cx, cy, sunR);
      });
    }

    ctx.restore();
  }

  scaleShapeForThumb(shape, scaleFactor, thumbCX, thumbCY, studentCanvasRadius) {
    const dx = shape.x - studentCanvasRadius;
    const dy = shape.y - studentCanvasRadius;
    return {
      ...shape,
      x: thumbCX + dx * scaleFactor,
      y: thumbCY + dy * scaleFactor,
      size: shape.size * scaleFactor,
      scale: shape.scale || 1
    };
  }

  renderZoomView(breathScale) {
    const canvas = document.getElementById('zoom-canvas');
    if (!canvas) return;

    const entry = this.students.get(this.zoomedStudentId);
    if (!entry) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2, cy = h / 2, r = w / 2 - 5;

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    bg.addColorStop(0, '#FFF8E7');
    bg.addColorStop(0.7, '#FFE8D0');
    bg.addColorStop(1, '#FFDAB3');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
    ctx.clip();

    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale);

    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];
    const studentCanvasRadius = 400;
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);
        const mirrors = getMirroredPositions(scaled, cx, cy);
        mirrors.slice(1).forEach(pos => {
          drawShape(ctx, { ...scaled, x: pos.x, y: pos.y, angle: pos.angle }, scaled.size);
        });
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r);
      faceParts.forEach(part => {
        const scaledPart = {
          ...part,
          offsetX: part.offsetX * scaleFactor,
          offsetY: part.offsetY * scaleFactor
        };
        drawFacePart(ctx, scaledPart, cx, cy, sunR);
      });
    }

    // Symmetry guides
    if (this.mode === 'symmetric' || this.mode === 'free') {
      ctx.strokeStyle = 'rgba(255, 180, 100, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TeacherApp();
});
