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
    this.brushStyle = 'solidCircle'; // solidCircle, hollowCircle, square, star, diagonal
    this.shapeTool = 'none'; // none, circle, square, line, arrow
    this.lineStart = null; // for line/arrow drawing
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

            <div class="draw-field">
              <label>笔刷样式</label>
              <div class="brush-style-selector">
                <button class="brush-style-btn active" data-style="solidCircle" title="实心圆">
                  <svg width="18" height="18"><circle cx="9" cy="9" r="6" fill="#2C3E50"/></svg>
                </button>
                <button class="brush-style-btn" data-style="hollowCircle" title="空心圆">
                  <svg width="18" height="18"><circle cx="9" cy="9" r="6" fill="none" stroke="#2C3E50" stroke-width="2"/></svg>
                </button>
                <button class="brush-style-btn" data-style="square" title="方形">
                  <svg width="18" height="18"><rect x="3" y="3" width="12" height="12" fill="#2C3E50"/></svg>
                </button>
                <button class="brush-style-btn" data-style="star" title="星星">
                  <svg width="18" height="18"><polygon points="9,2 11,7 16,7 12,10 14,16 9,12 4,16 6,10 2,7 7,7" fill="#2C3E50"/></svg>
                </button>
                <button class="brush-style-btn" data-style="diagonal" title="斜线">
                  <svg width="18" height="18"><line x1="3" y1="15" x2="15" y2="3" stroke="#2C3E50" stroke-width="2"/></svg>
                </button>
              </div>
            </div>

            <div class="draw-field">
              <label>基础图形</label>
              <div class="shape-tool-selector">
                <button class="shape-tool-btn" data-tool="circle" title="圆形">○</button>
                <button class="shape-tool-btn" data-tool="square" title="方形">□</button>
                <button class="shape-tool-btn" data-tool="line" title="直线">╱</button>
                <button class="shape-tool-btn" data-tool="arrow" title="箭头">→</button>
              </div>
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

    // Prevent native text selection and context menu on long press
    this.canvas.addEventListener('selectstart', (e) => e.preventDefault());
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

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

    const drawBrushStroke = (x, y) => {
      this.ctx.fillStyle = this.brushColor;
      this.ctx.strokeStyle = this.brushColor;
      const size = this.brushSize;

      switch (this.brushStyle) {
        case 'solidCircle':
          this.ctx.beginPath();
          this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          this.ctx.fill();
          break;
        case 'hollowCircle':
          this.ctx.beginPath();
          this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          this.ctx.lineWidth = Math.max(2, size / 4);
          this.ctx.stroke();
          break;
        case 'square':
          this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
          break;
        case 'star':
          this.drawStar(x, y, size);
          break;
        case 'diagonal':
          this.ctx.lineWidth = Math.max(2, size / 3);
          this.ctx.lineCap = 'round';
          this.ctx.beginPath();
          this.ctx.moveTo(x - size / 2, y + size / 2);
          this.ctx.lineTo(x + size / 2, y - size / 2);
          this.ctx.stroke();
          break;
      }
    };

    const startDraw = (e) => {
      e.preventDefault();
      const pos = getPos(e);

      if (this.shapeTool !== 'none') {
        this.lineStart = pos;
        this.drawing = true;
        return;
      }

      this.drawing = true;
      lastX = pos.x;
      lastY = pos.y;

      if (!this.isEraser) {
        drawBrushStroke(lastX, lastY);
      }
    };

    const draw = (e) => {
      if (!this.drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.currentPos = pos;

      if (this.shapeTool !== 'none' && this.shapeTool !== 'circle' && this.shapeTool !== 'square') {
        // Preview line/arrow while dragging
        this.redrawCanvasWithGrid();
        this.drawShapePreview(this.lineStart, pos, false);
        return;
      }

      if (this.isEraser) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.moveTo(lastX, lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.lineWidth = this.brushSize * 2;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        this.ctx.globalCompositeOperation = 'source-over';
      } else {
        drawBrushStroke(pos.x, pos.y);
      }

      lastX = pos.x;
      lastY = pos.y;
    };

    const endDraw = () => {
      if (this.drawing && this.shapeTool !== 'none' && this.lineStart) {
        const pos = this.currentPos || this.lineStart;
        this.redrawCanvasWithGrid();
        if (this.shapeTool === 'circle' || this.shapeTool === 'square') {
          // Click-to-add for circle and square
          this.drawShapePreview(this.lineStart, { x: this.lineStart.x + this.brushSize, y: this.lineStart.y + this.brushSize }, true);
        } else {
          // Drag-to-add for line and arrow
          this.drawShapePreview(this.lineStart, pos, true);
        }
      }
      this.drawing = false;
      this.lineStart = null;
      this.currentPos = null;
    };

    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', draw);
    this.canvas.addEventListener('mouseup', endDraw);
    this.canvas.addEventListener('mouseleave', endDraw);

    this.canvas.addEventListener('touchstart', startDraw, { passive: false });
    this.canvas.addEventListener('touchmove', draw, { passive: false });
    this.canvas.addEventListener('touchend', endDraw);
  }

  drawStar(cx, cy, size) {
    const outerR = size / 2;
    const innerR = outerR * 0.4;
    const spikes = 5;
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerR);

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerR;
      let y = cy + Math.sin(rot) * outerR;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerR);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawShapePreview(start, end, commit) {
    const cx = start.x, cy = start.y;
    const size = this.brushSize;

    this.ctx.strokeStyle = this.brushColor;
    this.ctx.fillStyle = this.brushColor;
    this.ctx.lineWidth = 2;

    switch (this.shapeTool) {
      case 'circle':
        const r = commit ? size / 2 : Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (commit) {
          this.ctx.fill();
        } else {
          this.ctx.stroke();
        }
        break;
      case 'square':
        const w = commit ? size : end.x - start.x;
        const h = commit ? size : end.y - start.y;
        if (commit) {
          this.ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
        } else {
          this.ctx.strokeRect(start.x, start.y, w, h);
        }
        break;
      case 'line':
        this.ctx.lineWidth = Math.max(2, size / 3);
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        break;
      case 'arrow':
        this.drawArrow(start.x, start.y, end.x, end.y);
        break;
    }
  }

  redrawCanvasWithGrid() {
    // Get all existing content
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
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

    // Restore content
    this.ctx.putImageData(imageData, 0, 0);
  }

  drawArrow(x1, y1, x2, y2) {
    const headLen = Math.max(10, this.brushSize * 1.5);
    const angle = Math.atan2(y2 - y1, x2 - x1);

    this.ctx.lineWidth = Math.max(2, this.brushSize / 3);
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
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

    // Brush style selector
    this.modal.querySelectorAll('.brush-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.brushStyle = btn.dataset.style;
        this.shapeTool = 'none';
        this.modal.querySelectorAll('.brush-style-btn').forEach(b => b.classList.remove('active'));
        this.modal.querySelectorAll('.shape-tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Shape tool selector
    this.modal.querySelectorAll('.shape-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shapeTool = btn.dataset.tool;
        this.brushStyle = 'solidCircle';
        this.modal.querySelectorAll('.brush-style-btn').forEach(b => b.classList.remove('active'));
        this.modal.querySelectorAll('.shape-tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Save
    this.modal.querySelector('.draw-save-btn').addEventListener('click', () => {
      this.save();
    });
  }

  show() {
    this.clearCanvas();
    this.brushStyle = 'solidCircle';
    this.shapeTool = 'none';
    this.modal.querySelector('.draw-name-input').value = '';
    // Reset active states
    this.modal.querySelectorAll('.brush-style-btn').forEach(b => b.classList.remove('active'));
    this.modal.querySelectorAll('.shape-tool-btn').forEach(b => b.classList.remove('active'));
    this.modal.querySelector('.brush-style-btn[data-style="solidCircle"]')?.classList.add('active');
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
