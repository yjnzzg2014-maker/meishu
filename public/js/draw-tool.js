// Drawing tool modal for teacher to create custom shapes
class DrawTool {
  constructor(onSave) {
    this.onSave = onSave;
    this.canvas = null;
    this.ctx = null;
    this.drawing = false;
    this.brushSize = 8;
    this.brushColor = '#2C3E50';
    this.isEraser = false;
    this.modal = null;

    this.buildModal();
  }

  buildModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'draw-modal';
    this.modal.innerHTML = `
      <div class="draw-modal-content">
        <div class="draw-modal-header">
          <h3>绘制素材</h3>
          <button class="draw-close-btn">&times;</button>
        </div>

        <div class="draw-body">
          <div class="draw-canvas-wrap">
            <canvas class="draw-canvas" width="300" height="300"></canvas>
          </div>

          <div class="draw-controls">
            <div class="draw-field">
              <label>名称</label>
              <input type="text" class="draw-name-input" placeholder="素材名称" maxlength="10">
            </div>

            <div class="draw-field">
              <label>分类</label>
              <div class="draw-category-btns">
                <button class="draw-cat-btn active" data-cat="dots">点</button>
                <button class="draw-cat-btn" data-cat="lines">线</button>
              </div>
            </div>

            <div class="draw-field">
              <label>颜色</label>
              <div class="draw-palette"></div>
            </div>

            <div class="draw-field">
              <label>笔刷 <span class="brush-size-val">8</span></label>
              <input type="range" class="draw-brush-range" min="2" max="30" value="8">
            </div>

            <div class="draw-tools-row">
              <button class="draw-tool-btn draw-eraser-btn">橡皮擦</button>
              <button class="draw-tool-btn draw-clear-btn">清空</button>
            </div>
          </div>
        </div>

        <div class="draw-modal-footer">
          <button class="draw-cancel-btn">取消</button>
          <button class="draw-save-btn">保存素材</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.canvas = this.modal.querySelector('.draw-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Fill with white initially, then clear to transparent
    this.clearCanvas();

    this.setupDrawEvents();
    this.setupControls();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw light grid pattern as background hint
    this.ctx.fillStyle = '#FAFAFA';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = '#EEE';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.canvas.width; i += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }
  }

  setupDrawEvents() {
    let lastX, lastY;

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    };

    const startDraw = (e) => {
      e.preventDefault();
      this.drawing = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
    };

    const draw = (e) => {
      if (!this.drawing) return;
      e.preventDefault();
      const pos = getPos(e);

      this.ctx.beginPath();
      this.ctx.moveTo(lastX, lastY);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.strokeStyle = this.isEraser ? '#FAFAFA' : this.brushColor;
      this.ctx.lineWidth = this.isEraser ? this.brushSize * 2 : this.brushSize;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;
    };

    const endDraw = () => {
      this.drawing = false;
    };

    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', draw);
    this.canvas.addEventListener('mouseup', endDraw);
    this.canvas.addEventListener('mouseleave', endDraw);

    this.canvas.addEventListener('touchstart', startDraw, { passive: false });
    this.canvas.addEventListener('touchmove', draw, { passive: false });
    this.canvas.addEventListener('touchend', endDraw);
  }

  setupControls() {
    // Close
    this.modal.querySelector('.draw-close-btn').addEventListener('click', () => this.hide());
    this.modal.querySelector('.draw-cancel-btn').addEventListener('click', () => this.hide());

    // Category buttons
    this.modal.querySelectorAll('.draw-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modal.querySelectorAll('.draw-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Color palette
    const palette = this.modal.querySelector('.draw-palette');
    const drawColors = ['#2C3E50', '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6', '#E91E90', '#8B4513', '#FFFFFF'];
    drawColors.forEach(color => {
      const swatch = document.createElement('button');
      swatch.className = 'draw-color-swatch' + (color === this.brushColor ? ' active' : '');
      swatch.style.background = color;
      if (color === '#FFFFFF') swatch.style.border = '2px solid #DDD';
      swatch.addEventListener('click', () => {
        this.brushColor = color;
        this.isEraser = false;
        this.modal.querySelector('.draw-eraser-btn').classList.remove('active');
        palette.querySelectorAll('.draw-color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
      palette.appendChild(swatch);
    });

    // Brush size
    const range = this.modal.querySelector('.draw-brush-range');
    const sizeVal = this.modal.querySelector('.brush-size-val');
    range.addEventListener('input', () => {
      this.brushSize = parseInt(range.value);
      sizeVal.textContent = this.brushSize;
    });

    // Eraser
    this.modal.querySelector('.draw-eraser-btn').addEventListener('click', (e) => {
      this.isEraser = !this.isEraser;
      e.target.classList.toggle('active', this.isEraser);
    });

    // Clear
    this.modal.querySelector('.draw-clear-btn').addEventListener('click', () => {
      this.clearCanvas();
    });

    // Save
    this.modal.querySelector('.draw-save-btn').addEventListener('click', () => {
      this.save();
    });
  }

  show() {
    this.clearCanvas();
    this.modal.querySelector('.draw-name-input').value = '';
    this.modal.classList.add('visible');
  }

  hide() {
    this.modal.classList.remove('visible');
  }

  save() {
    const name = this.modal.querySelector('.draw-name-input').value.trim();
    if (!name) {
      alert('请输入素材名称');
      return;
    }

    const activeCat = this.modal.querySelector('.draw-cat-btn.active');
    const category = activeCat ? activeCat.dataset.cat : 'dots';

    // Export canvas as PNG with transparency
    // First, replace the grid background with transparent
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.canvas.width;
    exportCanvas.height = this.canvas.height;
    const ectx = exportCanvas.getContext('2d');

    // Get pixel data from drawing canvas
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    // Replace background color (#FAFAFA / grid #EEE) with transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // If pixel is near background color (light gray), make transparent
      if (r >= 238 && g >= 238 && b >= 238) {
        data[i + 3] = 0;
      }
    }

    ectx.putImageData(imageData, 0, 0);
    const imageDataURL = exportCanvas.toDataURL('image/png');

    if (this.onSave) {
      this.onSave({ name, category, imageData: imageDataURL });
    }

    this.hide();
  }
}
