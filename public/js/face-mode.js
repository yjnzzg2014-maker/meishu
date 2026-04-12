// Face mode - manages personification logic
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

  getCategoryForPart(partId) {
    for (const catId of Object.keys(FACE_PARTS)) {
      if (FACE_PARTS[catId].some(p => p.id === partId)) {
        return catId;
      }
    }
    return 'extras';
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

      const isActive = this.app.faceParts.some(fp => fp.partId === part.id);
      if (isActive) {
        item.classList.add('active');
      }

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

      item.addEventListener('click', () => this.setPart(part.id));
      grid.appendChild(item);
    });
    this.panel.appendChild(grid);
  }

  setPart(partId) {
    const category = this.getCategoryForPart(partId);
    const sunRadius = getSunRadius(this.app.canvasRadius, this.app.mode);
    const slot = FACE_SLOT_POSITIONS[category] || { offsetX: 0, offsetY: 0 };

    this.app.faceParts = this.app.faceParts.filter(p =>
      this.getCategoryForPart(p.partId) !== category
    );

    this.app.faceParts.push({
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      partId: partId,
      offsetX: slot.offsetX * sunRadius,
      offsetY: slot.offsetY * sunRadius,
      scale: 1,
      angle: 0
    });

    this.app.syncToServer();
    this.app.render();
    this.updateActiveStates();

    this.panel.classList.add('panel-bounce');
    setTimeout(() => this.panel.classList.remove('panel-bounce'), 300);
  }

  updateActiveStates() {
    if (!this.panel) return;
    const items = this.panel.querySelectorAll('.face-item');
    const parts = FACE_PARTS[this.activeCategory] || [];

    items.forEach((item, index) => {
      if (index < parts.length) {
        const isActive = this.app.faceParts.some(fp => fp.partId === parts[index].id);
        item.classList.toggle('active', isActive);
      }
    });
  }

  findPartAt(x, y) {
    const sunRadius = getSunRadius(this.app.canvasRadius, this.app.mode);
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

  constrainToSun(part) {
    const sunRadius = getSunRadius(this.app.canvasRadius, this.app.mode);
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
