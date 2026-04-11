// Asset loader - generates placeholder assets via Canvas
// Replace generated images with PNGs by placing files in public/assets/ and updating paths

const AssetLoader = {
  cache: {},
  ready: false,

  async loadAll() {
    await Promise.all([
      this.generateSunSkins(),
      this.generateShapeAssets(),
      this.generateFaceAssets()
    ]);
    this.ready = true;
  },

  // Get a cached asset image
  get(key) {
    return this.cache[key] || null;
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
      // If skin has an image path, load the actual image
      if (skin.imagePath) {
        const img = await this.loadImage(skin.imagePath);
        if (img) {
          // Scale to standard size (400x400)
          const size = 400;
          const c = this.createCanvas(size, size);
          const ctx = c.getContext('2d');
          // Draw image scaled to fit
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

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, size / 2);
      glow.addColorStop(0, skin.glowColor + 'AA');
      glow.addColorStop(0.6, skin.glowColor + '44');
      glow.addColorStop(1, skin.glowColor + '00');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      // Rays
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

      // Body
      const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
      bodyGrad.addColorStop(0, lightenColor(skin.baseColor, 40));
      bodyGrad.addColorStop(0.7, skin.baseColor);
      bodyGrad.addColorStop(1, skin.glowColor);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Default face
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

  loadImage(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/' + path;
    });
  },,

  // --- Shape Assets ---
  async generateShapeAssets() {
    const size = 120;
    const colorKeys = Object.keys(COLORS.shapes);

    for (const shape of SHAPES) {
      for (const colorKey of colorKeys) {
        const c = this.createCanvas(size, size);
        const ctx = c.getContext('2d');
        const color = COLORS.shapes[colorKey];

        ctx.translate(size / 2, size / 2);
        this._drawShapeGraphic(ctx, shape.id, size * 0.8, color);

        this.cache[`shape_${shape.id}_${colorKey}`] = c;
      }
    }
  },

  _drawShapeGraphic(ctx, type, size, color) {
    const half = size / 2;
    ctx.fillStyle = color;

    switch (type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.fill();
        // Inner highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-half * 0.2, -half * 0.2, half * 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, half * 0.7);
        ctx.lineTo(-half, half * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(0, -half * 0.5);
        ctx.lineTo(half * 0.4, half * 0.2);
        ctx.lineTo(-half * 0.4, half * 0.2);
        ctx.closePath();
        ctx.fill();
        break;

      case 'square': {
        const s = half * 0.85;
        const r = 10;
        ctx.beginPath();
        ctx.moveTo(-s + r, -s);
        ctx.lineTo(s - r, -s);
        ctx.quadraticCurveTo(s, -s, s, -s + r);
        ctx.lineTo(s, s - r);
        ctx.quadraticCurveTo(s, s, s - r, s);
        ctx.lineTo(-s + r, s);
        ctx.quadraticCurveTo(-s, s, -s, s - r);
        ctx.lineTo(-s, -s + r);
        ctx.quadraticCurveTo(-s, -s, -s + r, -s);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'rectangle': {
        const w = half, h = half * 0.65;
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(-w + r, -h);
        ctx.lineTo(w - r, -h);
        ctx.quadraticCurveTo(w, -h, w, -h + r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(-w + r, h);
        ctx.quadraticCurveTo(-w, h, -w, h - r);
        ctx.lineTo(-w, -h + r);
        ctx.quadraticCurveTo(-w, -h, -w + r, -h);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'flower': {
        const petalR = half * 0.35;
        const petalCount = 6;
        for (let i = 0; i < petalCount; i++) {
          ctx.save();
          ctx.rotate(i * Math.PI / 3);
          ctx.beginPath();
          ctx.ellipse(0, -petalR * 1.1, petalR * 0.6, petalR, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#FFE066';
        ctx.beginPath();
        ctx.arc(0, 0, half * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-half * 0.05, -half * 0.05, half * 0.12, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'leaf':
        ctx.beginPath();
        ctx.moveTo(0, -half * 0.8);
        ctx.quadraticCurveTo(half * 0.9, -half * 0.3, half * 0.7, half * 0.5);
        ctx.quadraticCurveTo(0, half * 0.9, -half * 0.7, half * 0.5);
        ctx.quadraticCurveTo(-half * 0.9, -half * 0.3, 0, -half * 0.8);
        ctx.fill();
        ctx.strokeStyle = darkenColor(color, 30);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -half * 0.7);
        ctx.lineTo(0, half * 0.6);
        ctx.stroke();
        // Leaf veins
        for (let i = 1; i <= 3; i++) {
          const y = -half * 0.3 + i * half * 0.25;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(half * 0.3 * (1 - i * 0.15), y + half * 0.1);
          ctx.moveTo(0, y);
          ctx.lineTo(-half * 0.3 * (1 - i * 0.15), y + half * 0.1);
          ctx.stroke();
        }
        break;

      case 'star': {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r2 = i % 2 === 0 ? half : half * 0.4;
          const a = (i * Math.PI / 5) - Math.PI / 2;
          const x = Math.cos(a) * r2;
          const y = Math.sin(a) * r2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r2 = i % 2 === 0 ? half * 0.5 : half * 0.2;
          const a = (i * Math.PI / 5) - Math.PI / 2;
          const x = Math.cos(a) * r2 - half * 0.1;
          const y = Math.sin(a) * r2 - half * 0.1;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'cloud':
        ctx.beginPath();
        ctx.arc(-half * 0.25, half * 0.05, half * 0.35, 0, Math.PI * 2);
        ctx.arc(half * 0.15, -half * 0.1, half * 0.4, 0, Math.PI * 2);
        ctx.arc(half * 0.45, half * 0.05, half * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-half * 0.15, -half * 0.15, half * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'bird':
        ctx.strokeStyle = color;
        ctx.fillStyle = 'transparent';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-half * 0.6, 0);
        ctx.quadraticCurveTo(-half * 0.15, -half * 0.5, half * 0.3, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(half * 0.3, 0);
        ctx.quadraticCurveTo(half * 0.6, -half * 0.35, half * 0.8, -half * 0.1);
        ctx.stroke();
        // Eye dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(half * 0.35, -half * 0.08, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  },

  // --- Face Part Assets ---
  async generateFaceAssets() {
    const size = 100;

    // Eyes
    this._genFace('eyes_round', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.fillStyle = '#3D2B1F';
      ctx.beginPath();
      ctx.arc(-gap, 0, s * 0.12, 0, Math.PI * 2);
      ctx.arc(gap, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      // Highlights
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-gap + 3, -3, s * 0.04, 0, Math.PI * 2);
      ctx.arc(gap + 3, -3, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
    });

    this._genFace('eyes_happy', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.strokeStyle = '#3D2B1F';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      [-gap, gap].forEach(x => {
        ctx.beginPath();
        ctx.arc(x, 3, s * 0.1, -Math.PI * 0.9, -Math.PI * 0.1);
        ctx.stroke();
      });
    });

    this._genFace('eyes_star', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.fillStyle = '#3D2B1F';
      [-gap, gap].forEach(cx => {
        ctx.save();
        ctx.translate(cx, 0);
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? s * 0.13 : s * 0.06;
          const a = (i * Math.PI / 5) - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    });

    this._genFace('eyes_wink', size, (ctx, s) => {
      const gap = s * 0.25;
      // Left eye open
      ctx.fillStyle = '#3D2B1F';
      ctx.beginPath();
      ctx.arc(-gap, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-gap + 3, -3, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
      // Right eye winking
      ctx.strokeStyle = '#3D2B1F';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gap - s * 0.1, 0);
      ctx.lineTo(gap + s * 0.1, 0);
      ctx.stroke();
    });

    this._genFace('eyes_sleepy', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.strokeStyle = '#3D2B1F';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      [-gap, gap].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x - s * 0.1, 0);
        ctx.lineTo(x + s * 0.1, 0);
        ctx.stroke();
      });
    });

    // Noses
    this._genFace('nose_dot', size, (ctx, s) => {
      ctx.fillStyle = '#D4A056';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    });

    this._genFace('nose_triangle', size, (ctx, s) => {
      ctx.fillStyle = '#D4A056';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.06);
      ctx.lineTo(s * 0.06, s * 0.06);
      ctx.lineTo(-s * 0.06, s * 0.06);
      ctx.closePath();
      ctx.fill();
    });

    this._genFace('nose_button', size, (ctx, s) => {
      ctx.strokeStyle = '#D4A056';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#D4A056';
      ctx.beginPath();
      ctx.arc(-s * 0.02, 0, 2, 0, Math.PI * 2);
      ctx.arc(s * 0.02, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mouths
    this._genFace('mouth_smile', size, (ctx, s) => {
      ctx.strokeStyle = '#C0392B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -s * 0.05, s * 0.15, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    });

    this._genFace('mouth_laugh', size, (ctx, s) => {
      ctx.fillStyle = '#C0392B';
      ctx.beginPath();
      ctx.arc(0, -s * 0.03, s * 0.15, 0.05 * Math.PI, 0.95 * Math.PI);
      ctx.closePath();
      ctx.fill();
      // Tongue
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(0, s * 0.08, s * 0.08, 0, Math.PI);
      ctx.fill();
    });

    this._genFace('mouth_kiss', size, (ctx, s) => {
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#C0392B';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
    });

    this._genFace('mouth_surprised', size, (ctx, s) => {
      ctx.fillStyle = '#C0392B';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.1, s * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2C1810';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.06, s * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    this._genFace('mouth_tongue', size, (ctx, s) => {
      ctx.strokeStyle = '#C0392B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -s * 0.05, s * 0.15, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.07, 0, Math.PI);
      ctx.fill();
    });

    // Extras
    this._genFace('extra_blush', size, (ctx, s) => {
      const gap = s * 0.3;
      ctx.fillStyle = 'rgba(255, 150, 150, 0.5)';
      ctx.beginPath();
      ctx.ellipse(-gap, 0, s * 0.1, s * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(gap, 0, s * 0.1, s * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    this._genFace('extra_eyebrows_happy', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      [-gap, gap].forEach(x => {
        ctx.beginPath();
        ctx.arc(x, s * 0.08, s * 0.12, -Math.PI * 0.85, -Math.PI * 0.15);
        ctx.stroke();
      });
    });

    this._genFace('extra_eyebrows_angry', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-gap - s * 0.1, -s * 0.06);
      ctx.lineTo(-gap + s * 0.1, s * 0.02);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gap + s * 0.1, -s * 0.06);
      ctx.lineTo(gap - s * 0.1, s * 0.02);
      ctx.stroke();
    });

    this._genFace('extra_freckles', size, (ctx, s) => {
      ctx.fillStyle = '#D4A056';
      const spots = [[-0.15, -0.05], [-0.1, 0.05], [-0.2, 0.05], [0.15, -0.05], [0.1, 0.05], [0.2, 0.05]];
      spots.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x * s, y * s, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    this._genFace('extra_glasses', size, (ctx, s) => {
      const gap = s * 0.25;
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 3;
      [-gap, gap].forEach(x => {
        ctx.beginPath();
        ctx.arc(x, 0, s * 0.13, 0, Math.PI * 2);
        ctx.stroke();
      });
      // Bridge
      ctx.beginPath();
      ctx.moveTo(-gap + s * 0.13, 0);
      ctx.lineTo(gap - s * 0.13, 0);
      ctx.stroke();
      // Temples
      ctx.beginPath();
      ctx.moveTo(-gap - s * 0.13, 0);
      ctx.lineTo(-gap - s * 0.2, -s * 0.03);
      ctx.moveTo(gap + s * 0.13, 0);
      ctx.lineTo(gap + s * 0.2, -s * 0.03);
      ctx.stroke();
    });
  },

  _genFace(id, size, drawFn) {
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
