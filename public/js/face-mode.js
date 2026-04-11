// Face mode - manages personification (五官装饰) logic
class FaceMode {
  constructor(app) {
    this.app = app;
    this.panel = document.getElementById('face-panel');
    this.activeCategory = 'eyes';
    this.selectedPart = null;
    this.dragOffset = { x: 0, y: 0 };
  }

  init() {
    this.renderPanel();
  }

  renderPanel() {
    if (!this.panel) return;
    this.panel.innerHTML = '';

    // Category tabs
    const tabs = document.createElement('div');
    tabs.className = 'face-tabs';
    FACE_CATEGORIES.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = 'face-tab' + (cat.id === this.activeCategory ? ' active' : '');
      tab.textContent = cat.name;
      tab.addEventListener('click', () => {
        this.activeCategory = cat.id;
        this.renderPanel();
      });
      tabs.appendChild(tab);
    });
    this.panel.appendChild(tabs);

    // Part items
    const grid = document.createElement('div');
    grid.className = 'face-grid';
    const parts = FACE_PARTS[this.activeCategory] || [];
    parts.forEach(part => {
      const item = document.createElement('div');
      item.className = 'face-item';

      const img = AssetLoader.get('face_' + part.id);
      if (img) {
        const preview = document.createElement('canvas');
        preview.width = 56;
        preview.height = 56;
        const pctx = preview.getContext('2d');
        pctx.drawImage(img, 3, 3, 50, 50);
        item.appendChild(preview);
      }

      const label = document.createElement('span');
      label.className = 'face-label';
      label.textContent = part.name;
      item.appendChild(label);

      item.addEventListener('click', () => this.addPart(part.id));
      grid.appendChild(item);
    });
    this.panel.appendChild(grid);
  }

  addPart(partId) {
    const sunRadius = getSunRadius(this.app.canvasRadius);

    const part = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      partId: partId,
      offsetX: (Math.random() - 0.5) * sunRadius * 0.3,
      offsetY: (Math.random() - 0.5) * sunRadius * 0.3,
      scale: 1,
      angle: 0
    };

    this.app.faceParts.push(part);
    this.app.syncToServer();
    this.app.render();

    // Bounce animation feedback
    this.panel.classList.add('panel-bounce');
    setTimeout(() => this.panel.classList.remove('panel-bounce'), 300);
  }

  findPartAt(x, y) {
    const sunRadius = getSunRadius(this.app.canvasRadius);
    const cx = this.app.centerX;
    const cy = this.app.centerY;

    for (let i = this.app.faceParts.length - 1; i >= 0; i--) {
      const part = this.app.faceParts[i];
      const px = cx + part.offsetX;
      const py = cy + part.offsetY;
      const size = sunRadius * 0.4 * (part.scale || 1);
      const dx = x - px;
      const dy = y - py;
      if (Math.sqrt(dx * dx + dy * dy) < size) {
        return part;
      }
    }
    return null;
  }

  // Constrain face part to stay within sun body
  constrainToSun(part) {
    const sunRadius = getSunRadius(this.app.canvasRadius);
    const maxDist = sunRadius * 0.75;
    const dist = Math.sqrt(part.offsetX * part.offsetX + part.offsetY * part.offsetY);
    if (dist > maxDist) {
      const ratio = maxDist / dist;
      part.offsetX *= ratio;
      part.offsetY *= ratio;
    }
  }

  show() {
    if (this.panel) this.panel.classList.add('visible');
  }

  hide() {
    if (this.panel) this.panel.classList.remove('visible');
  }
}
