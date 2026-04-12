// Asset loader - loads PNG assets with Canvas fallback for face parts
// Supports custom assets from server and tint color caching

const AssetLoader = {
  cache: {},
  ready: false,

  async loadAll() {
    await Promise.all([
      this.generateSunSkins(),
      this.loadShapeAssets(),
      this.generateFaceAssets()
    ]);
    // Load custom assets from server
    await this.loadCustomAssets();
    this.ready = true;
  },

  get(key) {
    return this.cache[key] || null;
  },

  // Get a tinted version of a cached asset (cached automatically)
  getTinted(key, color) {
    const cacheKey = `${key}_tint_${color}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const original = this.cache[key];
    if (!original) return null;

    const c = this.createCanvas(original.width, original.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(original, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, c.width, c.height);

    this.cache[cacheKey] = c;
    return c;
  },

  // Clear tint cache entries (call when custom assets change)
  clearTintCache() {
    const keys = Object.keys(this.cache);
    keys.forEach(key => {
      if (key.includes('_tint_')) delete this.cache[key];
    });
  },

  createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  },

  // --- Sun Skins ---
  async generateSunSkins() {
    for (const skin of SUN_SKINS) {
      if (skin.imagePath) {
        const img = await this.loadImage(skin.imagePath, skin.makeWhiteTransparent);
        if (img) {
          const size = 400;
          const c = this.createCanvas(size, size);
          const ctx = c.getContext('2d');
          const scale = Math.min(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (size - w) / 2;
          const y = (size - h) / 2;
          ctx.drawImage(img, x, y, w, h);
          this.cache['sun_' + skin.id] = c;
        }
        continue;
      }

      const size = 400;
      const c = this.createCanvas(size, size);
      const ctx = c.getContext('2d');
      const cx = size / 2, cy = size / 2, r = size * 0.35;

      const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, size / 2);
      glow.addColorStop(0, skin.glowColor + 'AA');
      glow.addColorStop(0.6, skin.glowColor + '44');
      glow.addColorStop(1, skin.glowColor + '00');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = skin.rayColor;
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * 2 * Math.PI / rayCount) - Math.PI / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-10, -r - 5);
        ctx.lineTo(10, -r - 5);
        ctx.lineTo(5, -r - 35);
        ctx.lineTo(-5, -r - 35);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
      bodyGrad.addColorStop(0, lightenColor(skin.baseColor, 40));
      bodyGrad.addColorStop(0.7, skin.baseColor);
      bodyGrad.addColorStop(1, skin.glowColor);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = skin.faceColor;
      ctx.beginPath();
      ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.08, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.08, r * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.strokeStyle = skin.faceColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      this.cache['sun_' + skin.id] = c;
    }
  },

  loadImage(path, makeWhiteTransparent = false) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (makeWhiteTransparent) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          const transparentImg = new Image();
          transparentImg.onload = () => resolve(transparentImg);
          transparentImg.src = canvas.toDataURL();
        } else {
          resolve(img);
        }
      };
      img.onerror = () => resolve(null);
      img.src = '/' + path;
    });
  },

  // --- Shape Assets (PNG-based) ---
  async loadShapeAssets() {
    const loadPromises = SHAPES.map(async (shape) => {
      await this._loadShapeEntry(shape);
    });
    await Promise.all(loadPromises);
  },

  async _loadShapeEntry(shape) {
    const img = await this.loadImage(shape.src);
    if (img) {
      const size = 120;
      const c = this.createCanvas(size, size);
      const ctx = c.getContext('2d');
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      this.cache[`shape_${shape.id}`] = c;
    }
  },

  // --- Face Part Assets ---
  async generateFaceAssets() {
    const size = 100;
    for (const catId of Object.keys(FACE_PARTS)) {
      for (const part of FACE_PARTS[catId]) {
        if (part.src) {
          await this._loadFaceEntry(part, size);
        } else {
          this._genFaceCanvas(part.id, size);
        }
      }
    }
  },

  async _loadFaceEntry(part, size) {
    const img = await this.loadImage(part.src);
    if (img) {
      size = size || 100;
      const c = this.createCanvas(size, size);
      const ctx = c.getContext('2d');
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      this.cache['face_' + part.id] = c;
    }
  },

  // --- Custom Assets from Server ---
  async loadCustomAssets() {
    try {
      const res = await fetch('/api/custom-assets');
      const data = await res.json();

      // Load custom shapes
      if (data.shapes && data.shapes.length) {
        for (const shape of data.shapes) {
          // Add to SHAPES array if not already there
          if (!SHAPES.find(s => s.id === shape.id)) {
            SHAPES.push(shape);
          }
          await this._loadShapeEntry(shape);
        }
      }

      // Load custom face parts
      if (data.faces && data.faces.length) {
        for (const face of data.faces) {
          const cat = face.category;
          if (!FACE_PARTS[cat]) FACE_PARTS[cat] = [];
          if (!FACE_PARTS[cat].find(f => f.id === face.id)) {
            FACE_PARTS[cat].push(face);
          }
          await this._loadFaceEntry(face, 100);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom assets:', e.message);
    }
  },

  // Reload custom assets (called when assets_updated event fires)
  async reloadCustomAssets() {
    this.clearTintCache();
    try {
      const res = await fetch('/api/custom-assets');
      const data = await res.json();

      // Remove old custom entries from SHAPES
      for (let i = SHAPES.length - 1; i >= 0; i--) {
        if (SHAPES[i].custom) SHAPES.splice(i, 1);
      }
      // Remove old custom entries from FACE_PARTS
      for (const catId of Object.keys(FACE_PARTS)) {
        FACE_PARTS[catId] = FACE_PARTS[catId].filter(f => !f.custom);
      }

      // Re-add from server
      if (data.shapes) {
        for (const shape of data.shapes) {
          SHAPES.push(shape);
          await this._loadShapeEntry(shape);
        }
      }
      if (data.faces) {
        for (const face of data.faces) {
          const cat = face.category;
          if (!FACE_PARTS[cat]) FACE_PARTS[cat] = [];
          FACE_PARTS[cat].push(face);
          await this._loadFaceEntry(face, 100);
        }
      }
    } catch (e) {
      console.warn('Failed to reload custom assets:', e.message);
    }
  },

  _genFaceCanvas(id, size) {
    const drawFns = {
      eyes_round: (ctx, s) => {
        const gap = s * 0.25;
        ctx.fillStyle = '#3D2B1F';
        ctx.beginPath(); ctx.arc(-gap, 0, s * 0.12, 0, Math.PI * 2); ctx.arc(gap, 0, s * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(-gap + 3, -3, s * 0.04, 0, Math.PI * 2); ctx.arc(gap + 3, -3, s * 0.04, 0, Math.PI * 2); ctx.fill();
      },
      eyes_happy: (ctx, s) => {
        const gap = s * 0.25;
        ctx.strokeStyle = '#3D2B1F'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        [-gap, gap].forEach(x => { ctx.beginPath(); ctx.arc(x, 3, s * 0.1, -Math.PI * 0.9, -Math.PI * 0.1); ctx.stroke(); });
      },
      eyes_star: (ctx, s) => {
        const gap = s * 0.25;
        ctx.fillStyle = '#3D2B1F';
        [-gap, gap].forEach(cx => {
          ctx.save(); ctx.translate(cx, 0); ctx.beginPath();
          for (let i = 0; i < 10; i++) { const r = i % 2 === 0 ? s * 0.13 : s * 0.06; const a = (i * Math.PI / 5) - Math.PI / 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
          ctx.closePath(); ctx.fill(); ctx.restore();
        });
      },
      eyes_wink: (ctx, s) => {
        const gap = s * 0.25;
        ctx.fillStyle = '#3D2B1F'; ctx.beginPath(); ctx.arc(-gap, 0, s * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(-gap + 3, -3, s * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3D2B1F'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(gap - s * 0.1, 0); ctx.lineTo(gap + s * 0.1, 0); ctx.stroke();
      },
      eyes_sleepy: (ctx, s) => {
        const gap = s * 0.25;
        ctx.strokeStyle = '#3D2B1F'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        [-gap, gap].forEach(x => { ctx.beginPath(); ctx.moveTo(x - s * 0.1, 0); ctx.lineTo(x + s * 0.1, 0); ctx.stroke(); });
      },
      nose_dot: (ctx, s) => { ctx.fillStyle = '#D4A056'; ctx.beginPath(); ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2); ctx.fill(); },
      nose_triangle: (ctx, s) => {
        ctx.fillStyle = '#D4A056'; ctx.beginPath();
        ctx.moveTo(0, -s * 0.06); ctx.lineTo(s * 0.06, s * 0.06); ctx.lineTo(-s * 0.06, s * 0.06);
        ctx.closePath(); ctx.fill();
      },
      nose_button: (ctx, s) => {
        ctx.strokeStyle = '#D4A056'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#D4A056'; ctx.beginPath(); ctx.arc(-s * 0.02, 0, 2, 0, Math.PI * 2); ctx.arc(s * 0.02, 0, 2, 0, Math.PI * 2); ctx.fill();
      },
      mouth_smile: (ctx, s) => {
        ctx.strokeStyle = '#C0392B'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.15, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      },
      mouth_laugh: (ctx, s) => {
        ctx.fillStyle = '#C0392B'; ctx.beginPath(); ctx.arc(0, -s * 0.03, s * 0.15, 0.05 * Math.PI, 0.95 * Math.PI); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#E74C3C'; ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.08, 0, Math.PI); ctx.fill();
      },
      mouth_kiss: (ctx, s) => {
        ctx.fillStyle = '#E74C3C'; ctx.beginPath(); ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#C0392B'; ctx.beginPath(); ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
      },
      mouth_surprised: (ctx, s) => {
        ctx.fillStyle = '#C0392B'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.1, s * 0.13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2C1810'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.06, s * 0.09, 0, 0, Math.PI * 2); ctx.fill();
      },
      mouth_tongue: (ctx, s) => {
        ctx.strokeStyle = '#C0392B'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.15, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        ctx.fillStyle = '#E74C3C'; ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.07, 0, Math.PI); ctx.fill();
      },
      extra_blush: (ctx, s) => {
        const gap = s * 0.3;
        ctx.fillStyle = 'rgba(255, 150, 150, 0.5)';
        ctx.beginPath(); ctx.ellipse(-gap, 0, s * 0.1, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(gap, 0, s * 0.1, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
      },
      extra_eyebrows_happy: (ctx, s) => {
        const gap = s * 0.25;
        ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        [-gap, gap].forEach(x => { ctx.beginPath(); ctx.arc(x, s * 0.08, s * 0.12, -Math.PI * 0.85, -Math.PI * 0.15); ctx.stroke(); });
      },
      extra_eyebrows_angry: (ctx, s) => {
        const gap = s * 0.25;
        ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-gap - s * 0.1, -s * 0.06); ctx.lineTo(-gap + s * 0.1, s * 0.02); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gap + s * 0.1, -s * 0.06); ctx.lineTo(gap - s * 0.1, s * 0.02); ctx.stroke();
      },
      extra_freckles: (ctx, s) => {
        ctx.fillStyle = '#D4A056';
        [[-0.15, -0.05], [-0.1, 0.05], [-0.2, 0.05], [0.15, -0.05], [0.1, 0.05], [0.2, 0.05]].forEach(([x, y]) => {
          ctx.beginPath(); ctx.arc(x * s, y * s, 2.5, 0, Math.PI * 2); ctx.fill();
        });
      },
      extra_glasses: (ctx, s) => {
        const gap = s * 0.25;
        ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 3;
        [-gap, gap].forEach(x => { ctx.beginPath(); ctx.arc(x, 0, s * 0.13, 0, Math.PI * 2); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(-gap + s * 0.13, 0); ctx.lineTo(gap - s * 0.13, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-gap - s * 0.13, 0); ctx.lineTo(-gap - s * 0.2, -s * 0.03);
        ctx.moveTo(gap + s * 0.13, 0); ctx.lineTo(gap + s * 0.2, -s * 0.03); ctx.stroke();
      }
    };

    const drawFn = drawFns[id];
    if (!drawFn) return;

    const c = this.createCanvas(size, size);
    const ctx = c.getContext('2d');
    ctx.translate(size / 2, size / 2);
    drawFn(ctx, size);
    this.cache['face_' + id] = c;
  }
};

// Color helpers
function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
  const b = Math.max(0, (num & 0xFF) - amount);
  return `rgb(${r},${g},${b})`;
}
