/* === constants.js === */
// Color palette - Warm Sun Macaron
const COLORS = {
  sun: '#FFD700',
  sunGlow: '#FFA500'
};

// Tint color groups: 9 families × 5 shades (light → dark)
const TINT_COLOR_GROUPS = [
  { name: '红', hue: 'red',    shades: ['#FFCDD2','#EF9A9A','#E74C3C','#C0392B','#7B1010'] },
  { name: '橙', hue: 'orange', shades: ['#FFE0B2','#FFCC80','#E67E22','#E65100','#7B3000'] },
  { name: '黄', hue: 'yellow', shades: ['#FFFDE7','#FFF176','#F1C40F','#F9A825','#876400'] },
  { name: '绿', hue: 'green',  shades: ['#DCEDC8','#A5D6A7','#2ECC71','#1E8449','#0D4D26'] },
  { name: '蓝', hue: 'blue',   shades: ['#BBDEFB','#90CAF9','#3498DB','#1565C0','#0A2463'] },
  { name: '紫', hue: 'purple', shades: ['#EDE7F6','#CE93D8','#9B59B6','#6A1B9A','#2D0050'] },
  { name: '粉', hue: 'pink',   shades: ['#FCE4EC','#F48FB1','#E91E90','#AD1457','#560027'] },
  { name: '棕', hue: 'brown',  shades: ['#FFD9B3','#E8A87C','#C07A40','#8B4513','#4A2C0A'] },
  { name: '黑', hue: 'dark',   shades: ['#CFD8DC','#90A4AE','#607D8B','#2C3E50','#101820'] },
];

// Derived flat list (mid shade per family + null for no-tint) - backwards compat
const TINT_COLORS = [null, ...TINT_COLOR_GROUPS.map(g => g.shades[2])];

// Shape categories: dots and lines
const SHAPE_CATEGORIES = [
  { id: 'dots', name: '点' },
  { id: 'lines', name: '线' }
];

// Shapes - PNG-based, extensible: add a PNG file + one line here
// Custom shapes are appended at runtime from server
const SHAPES = [];

// Three operating modes
const MODES = {
  SYMMETRIC: 'symmetric',
  PERSONIFY: 'personify',
  FREE: 'free'
};

// Sun skins
const SUN_SKINS = [
  { id: 'clay', name: '黏土饼', imagePath: 'images/clay-pie-skin.png', makeWhiteTransparent: true },
  { id: 'clay-morning', name: '早安', imagePath: 'images/clay-pie-morning-t.png', makeWhiteTransparent: true },
  { id: 'clay-tomato', name: '番茄', imagePath: 'images/clay-pie-tomato-t.png', makeWhiteTransparent: true },
  { id: 'clay-purple', name: '紫罗', imagePath: 'images/clay-pie-purple-t.png', makeWhiteTransparent: true },
  { id: 'cartoon', name: '卡通', baseColor: '#FFD700', shadowColor: '#CC9900', faceColor: '#E8A000' },
  { id: 'watercolor', name: '水彩', baseColor: '#FFE082', shadowColor: '#D4A056', faceColor: '#D4A056' },
  { id: 'sketch', name: '简笔画', baseColor: '#FFF9C4', shadowColor: '#C0A030', faceColor: '#C0A030' },
  { id: 'sunset', name: '夕阳', baseColor: '#FF8A65', shadowColor: '#BF360C', faceColor: '#BF360C' },
  { id: 'simple', name: '简约', imagePath: 'images/sun-simple-alpha.png', makeWhiteTransparent: true }
];

// Face part definitions for personify mode - PNG-extensible
// Custom face parts are appended at runtime from server
const FACE_PARTS = {
  eyes: [
    { id: 'eyes_round', name: '圆眼' },
    { id: 'eyes_happy', name: '开心眼' },
    { id: 'eyes_star', name: '星星眼' },
    { id: 'eyes_wink', name: '眨眼' },
    { id: 'eyes_sleepy', name: '困困眼' }
  ],
  noses: [
    { id: 'nose_dot', name: '小圆鼻' },
    { id: 'nose_triangle', name: '三角鼻' },
    { id: 'nose_button', name: '纽扣鼻' }
  ],
  mouths: [
    { id: 'mouth_smile', name: '微笑' },
    { id: 'mouth_laugh', name: '大笑' },
    { id: 'mouth_kiss', name: '嘟嘟嘴' },
    { id: 'mouth_surprised', name: '惊讶' },
    { id: 'mouth_tongue', name: '吐舌头' }
  ],
  extras: [
    { id: 'extra_blush', name: '腮红' },
    { id: 'extra_eyebrows_happy', name: '开心眉' },
    { id: 'extra_eyebrows_angry', name: '生气眉' },
    { id: 'extra_freckles', name: '雀斑' },
    { id: 'extra_glasses', name: '眼镜' }
  ]
};

const FACE_CATEGORIES = [
  { id: 'eyes', name: '眼睛' },
  { id: 'noses', name: '鼻子' },
  { id: 'mouths', name: '嘴巴' },
  { id: 'extras', name: '其他' }
];

// Preset positions for face part slots (fraction of sunRadius)
const FACE_SLOT_POSITIONS = {
  eyes:   { offsetX: 0, offsetY: -0.25 },
  noses:  { offsetX: 0, offsetY: 0.05 },
  mouths: { offsetX: 0, offsetY: 0.35 },
  extras: { offsetX: 0, offsetY: 0 }
};

// Sun configuration
const SUN_CONFIG = {
  radiusRatio: 0.36,
  personifyRadiusRatio: 0.32,   // Larger sun in personify mode for face operations
  breathingMin: 0.95,
  breathingMax: 1.05,
  breathingSpeed: 0
};

// Scale limits for pinch-zoom
const SCALE_LIMITS = {
  min: 0.5,
  max: 2.5
};

const FRUIT_NAMES = [
  '苹果','香蕉','橙子','葡萄','西瓜','草莓','芒果','菠萝','樱桃','桃子',
  '梨子','蓝莓','柠檬','椰子','荔枝','龙眼','火龙果','百香果','杨梅','枇杷',
  '柚子','橘子','金桔','木瓜','榴莲','山竹','番石榴','莲雾','杨桃','无花果',
  '红毛丹','人参果','奇异果','蔓越莓','覆盆子','黑莓','桑椹','枸杞','柿子','山楂',
  '哈密瓜','杏子','李子','石榴','牛油果','酸枣','马蹄','枣子','菠萝蜜','雪梨'
];


/* === asset-loader.js === */
// Asset loader - loads PNG assets with Canvas fallback for face parts
// Supports custom assets from server and tint color caching

const AssetLoader = {
  cache: {},
  ready: false,
  _supportsWebP: false,

  async _detectWebP() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0);
      img.onerror = () => resolve(false);
      img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  async _loadImagePreferWebP(pngPath, makeWhiteTransparent = false) {
    if (this._supportsWebP && pngPath.startsWith('images/') && pngPath.endsWith('.png')) {
      const img = await this.loadImage(pngPath.replace('.png', '.webp'), makeWhiteTransparent);
      if (img) return img;
    }
    return this.loadImage(pngPath, makeWhiteTransparent);
  },

  async loadAll() {
    this._supportsWebP = await this._detectWebP();
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

    // Build a color layer pre-clipped to original's alpha so transparent
    // pixels stay transparent and the 'color' blend only touches opaque pixels.
    const colorLayer = this.createCanvas(original.width, original.height);
    const clx = colorLayer.getContext('2d');
    clx.fillStyle = color;
    clx.fillRect(0, 0, colorLayer.width, colorLayer.height);
    clx.globalCompositeOperation = 'destination-in';
    clx.drawImage(original, 0, 0);

    const c = this.createCanvas(original.width, original.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(original, 0, 0);
    ctx.globalCompositeOperation = 'color';
    ctx.drawImage(colorLayer, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

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
        const img = await this._loadImagePreferWebP(skin.imagePath, skin.makeWhiteTransparent);
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

      // Layer 1: Circle body + shadow
      ctx.shadowColor = skin.shadowColor;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      const bodyGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
      bodyGrad.addColorStop(0, lightenColor(skin.baseColor, 40));
      bodyGrad.addColorStop(0.7, skin.baseColor);
      bodyGrad.addColorStop(1, skin.shadowColor);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Reset shadow for face drawing
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Layer 2: Default face (eyes + smile)
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
      const base = (typeof window !== 'undefined' && window.ASSET_BASE_URL) ? window.ASSET_BASE_URL : '/';
      // crossOrigin required for canvas getImageData on cross-origin images
      if (base !== '/') img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (makeWhiteTransparent) {
          try {
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
          } catch (e) {
            // CORS not yet configured — resolve with original image (white visible)
            resolve(img);
          }
        } else {
          resolve(img);
        }
      };
      img.onerror = () => resolve(null);
      img.src = base + path;
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
    const img = await this._loadImagePreferWebP(shape.src);
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
    const img = await this._loadImagePreferWebP(part.src);
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


/* === canvas-utils.js === */
// Draw sun using pre-generated skin image
function drawSun(ctx, centerX, centerY, canvasRadius, skinId, breathScale, mode) {
  const sunImg = AssetLoader.get('sun_' + skinId);
  if (!sunImg) return;

  const sunRadius = getSunRadius(canvasRadius, mode);
  const drawSize = (sunRadius + 25) * 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(breathScale, breathScale);
  ctx.drawImage(sunImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  ctx.restore();
}

// Get sun body radius for a given canvas radius (mode-aware)
function getSunRadius(canvasRadius, mode) {
  const ratio = (mode === 'personify')
    ? SUN_CONFIG.personifyRadiusRatio
    : SUN_CONFIG.radiusRatio;
  return canvasRadius * ratio;
}

// Draw a shape from cached asset image, with optional tint color
function drawShape(ctx, shape, baseSize) {
  const assetKey = `shape_${shape.type}`;
  const scale = shape.scale || 1;
  const size = baseSize * scale;

  // Get tinted or original image
  let img;
  if (shape.tintColor) {
    img = AssetLoader.getTinted(assetKey, shape.tintColor);
  } else {
    img = AssetLoader.get(assetKey);
  }
  if (!img) return;

  // Total angle = base angle pointing to center + user rotation offset
  const totalAngle = (shape.angle || 0) + (shape.rotationOffset || 0);

  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(totalAngle);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Draw a face part from cached asset
function drawFacePart(ctx, part, centerX, centerY, sunRadius) {
  const img = AssetLoader.get('face_' + part.partId);
  if (!img) return;

  const scale = part.scale || 1;
  const size = sunRadius * 0.8 * scale;

  ctx.save();
  ctx.translate(centerX + part.offsetX, centerY + part.offsetY);
  ctx.rotate(part.angle || 0);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Mirror shape positions for symmetric mode (X-axis and Y-axis reflection)
// Returns: original, X-mirror, Y-mirror, XY-mirror
function getMirroredPositions(shape, centerX, centerY) {
  const x = shape.x;
  const y = shape.y;
  const angle = shape.angle || 0; // angle pointing toward center (bottom faces center)
  const rotationOffset = shape.rotationOffset || 0;

  // Total angle for each mirror
  const totalAngle = angle + rotationOffset;

  return [
    // Original position
    { x: x, y: y, angle: totalAngle, rotationOffset: rotationOffset },
    // X-axis mirror (left-right symmetry): flip horizontally
    // angle changes: PI - angle (horizontal flip preserves "pointing toward center")
    { x: 2 * centerX - x, y: y, angle: Math.PI - totalAngle, rotationOffset: rotationOffset },
    // Y-axis mirror (up-down symmetry): flip vertically
    // angle changes: -angle (vertical flip preserves "pointing toward center")
    { x: x, y: 2 * centerY - y, angle: -totalAngle, rotationOffset: rotationOffset },
    // XY mirror (both axes): center symmetry (180° rotation)
    // angle changes: PI + angle
    { x: 2 * centerX - x, y: 2 * centerY - y, angle: Math.PI + totalAngle, rotationOffset: rotationOffset }
  ];
}


/* === face-mode.js === */
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


/* === socket-client.js === */
// Socket client for per-student architecture
class SocketClient {
  constructor() {
    this.socket = null;
    this.callbacks = {};
    this.sessionId = null;
    this._registered = false;
  }

  connect() {
    // If socket already exists and is connected, don't create new one
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return this;
    }

    // If socket exists but disconnected, try to reconnect
    if (this.socket && !this.socket.connected) {
      console.log('Socket exists but disconnected, attempting reconnect...');
      this.socket.connect();
      return this;
    }

    // Create new socket connection
    this._initializeSocket();
    this.socket.connect();
    return this;
  }

  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
    return this;
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  forceReconnect() {
    console.log('Force reconnect called');
    console.log('  Current socket state:', this.socket?.connected, this.socket?.id);

    // Remove all listeners and disconnect
    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (e) {
        console.error('Error disconnecting socket:', e);
      }
      this.socket = null;
    }

    console.log('  Creating new socket...');
    // Create new socket
    this._initializeSocket();
    console.log('  Calling connect()...');
    this.socket.connect();
    console.log('  connect() called, socket.id will be:', this.socket.id);
  }

  _initializeSocket() {
    console.log('  _initializeSocket creating new socket');
    this.socket = io({
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      timeout: 5000
    });

    // Reconnection events
    this.socket.on('connect', () => {
      console.log('  New socket CONNECTED, id:', this.socket.id, 'sessionId:', this.sessionId);
      // Wait a tiny bit for socket to be fully ready
      setTimeout(() => {
        // Only register if we haven't registered yet
        if (this.sessionId && !this._registered) {
          console.log('  Calling registerStudent with sessionId:', this.sessionId);
          this._registered = true;
          this.socket.emit('register_student', { sunSkin: this.sunSkin, sessionId: this.sessionId });
          console.log('  register_student event sent');
        } else if (this._registered) {
          console.log('  Already registered, skipping registerStudent');
        } else {
          console.log('  No sessionId, skipping registerStudent');
        }
      }, 50);
    });

    this.socket.on('reconnect', () => {
      console.log('Socket reconnected, sessionId:', this.sessionId);
      this.trigger('reconnect', { sessionId: this.sessionId });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnect attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnect error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connect error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this._registered = false; // Reset so we can register again on reconnect
      this.trigger('disconnect', { reason });
    });

    const events = [
      'init_state', 'mode_changed', 'lock_changed', 'student_count',
      // Teacher-specific events
      'teacher_init', 'student_joined', 'student_left', 'student_disconnected',
      'student_updated', 'student_state', 'student_list',
      'students_summary',
      // Asset sync
      'assets_updated',
      // Showcase & Gallery
      'showcase_start', 'showcase_update', 'showcase_end',
      'gallery_start', 'gallery_end',
      'showcase_status', 'gallery_status',
      'force_reset', 'all_students_cleared'
    ];

    events.forEach(event => {
      this.socket.on(event, (data) => {
        console.log('  Event received:', event);
        this.trigger(event, data);
      });
    });
  }

  // Student methods
  registerStudent(data) {
    const payload = { ...data, sessionId: this.sessionId };
    this.socket.emit('register_student', payload);
  }

  updateState(state) {
    this.socket.emit('update_state', state);
  }

  changeSkin(skinId) {
    this.socket.emit('change_skin', { skinId });
  }

  // Teacher methods
  registerTeacher() {
    this.socket.emit('register_teacher');
  }

  changeMode(mode) {
    this.socket.emit('change_mode', { mode });
  }

  toggleLock(locked) {
    this.socket.emit('toggle_lock', { locked });
  }

  getStudentState(studentId) {
    this.socket.emit('get_student_state', { studentId });
  }

  getStudentList() {
    this.socket.emit('get_student_list');
  }

  startShowcase(studentId, freezeStudent) {
    this.socket.emit('start_showcase', { studentId, freezeStudent });
  }

  stopShowcase() {
    this.socket.emit('stop_showcase');
  }

  startGallery(studentIds) {
    this.socket.emit('start_gallery', { studentIds });
  }

  stopGallery() {
    this.socket.emit('stop_gallery');
  }

  clearAllStudents() {
    this.socket.emit('clear_all_students');
  }
}


/* === gallery-animation.js === */
class GalleryAnimation {
  constructor(canvas, artworks) {
    this.canvas = canvas;
    this.artworks = artworks; // [{ studentId, fruitName, state }]
    this._raf = null;
    this._offscreens = [];
    this._stars = [];
    this._scrollX = 0;
    this._t = 0;
    this._ctx = null;         // cached 2d context
    this._bgGrad = null;      // cached background gradient
  }

  start() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._ctx = this.canvas.getContext('2d');
    this._bgGrad = this._buildBgGrad();
    this._prepareOffscreens();
    this._generateStars();
    this._loop();
  }

  _buildBgGrad() {
    const grad = this._ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#0a0a2e');
    grad.addColorStop(1, '#000');
    return grad;
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _prepareOffscreens() {
    this._offscreens = [];
    const W = this.canvas.width, H = this.canvas.height;
    // Display radius — bigger than before, capped for very wide screens
    const displaySize = Math.min(W / 3.2, 140);
    // Render at 2× for crisp quality when displayed
    const renderR = displaySize * 2;

    for (const art of this.artworks) {
      if (!art.state) continue;
      try {
        const oc = document.createElement('canvas');
        oc.width = renderR * 2;
        oc.height = renderR * 2;
        const ctx = oc.getContext('2d');
        if (!ctx) continue;
        const cx = renderR, cy = renderR, r = renderR;
        const srcR = art.state.canvasRadius || 400;
        const scale = r / srcR;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        const sunImg = AssetLoader.get('sun_' + (art.state.sunSkin || 'clay'));
        if (!sunImg) { ctx.fillStyle = '#ffcc00'; ctx.fill(); }
        drawSun(ctx, cx, cy, r, art.state.sunSkin || 'clay', 1, 'symmetric');
        (art.state.shapes || []).forEach(shape => {
          const dx = shape.x - srcR, dy = shape.y - srcR;
          const scaled = { ...shape, x: cx + dx * scale, y: cy + dy * scale, size: shape.size * scale };
          drawShape(ctx, scaled, scaled.size);
        });
        const sunR = getSunRadius(r, 'personify');
        (art.state.faceParts || []).forEach(part => {
          const sp = { ...part, offsetX: part.offsetX * scale, offsetY: part.offsetY * scale };
          drawFacePart(ctx, sp, cx, cy, sunR);
        });
        ctx.restore();
        this._offscreens.push({
          canvas: oc,
          size: displaySize,       // visual display radius
          renderR,                 // offscreen canvas logical radius
          fruitName: art.fruitName,
          rotationSpeed: (0.001 + Math.random() * 0.003) * (Math.random() < 0.5 ? 1 : -1),
          rotation: Math.random() * Math.PI * 2,
          hangY: H * (0.06 + Math.random() * 0.25),
        });
      } catch (e) {
        console.warn('[Gallery] offscreen render failed:', e);
      }
    }
  }

  _generateStars() {
    this._stars = [];
    for (let i = 0; i < 120; i++) {
      this._stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7,
        r: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02
      });
    }
  }

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    this._t++;
    this._scrollX += 0.5;
    this._offscreens.forEach(item => { item.rotation += item.rotationSpeed; });
    this._draw();
  }

  _draw() {
    const ctx = this._ctx;
    const W = this.canvas.width, H = this.canvas.height;

    // Background (use cached gradient)
    ctx.fillStyle = this._bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Stars — batched by opacity group to minimise save/restore overhead
    const yScale = H / (H * 0.7);
    ctx.fillStyle = '#fff';
    this._stars.forEach(s => {
      ctx.globalAlpha = 0.4 + 0.5 * Math.sin(s.phase + this._t * s.speed);
      ctx.beginPath();
      ctx.arc(s.x, s.y * yScale, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Far hills (dark, slow)
    this._drawHills(ctx, W, H, this._scrollX * 0.3, H * 0.82, '#0d1a2e', 0.18, 8);
    // Clouds
    this._drawClouds(ctx, W, H, this._scrollX * 0.6);
    // Near hills (lighter, faster)
    this._drawHills(ctx, W, H, this._scrollX * 0.9, H * 0.88, '#1a2a1a', 0.12, 6);

    // Hanging artworks
    if (this._offscreens.length === 0) return;
    const count = this._offscreens.length;
    const displaySize = this._offscreens[0].size;
    // Ensure spacing is wide enough that totalW > W + 4*displaySize,
    // so items always enter smoothly from off-screen right (never flash mid-screen).
    const minSpacing = displaySize * 4.2;
    const naturalSpacing = W / count;
    const spacing = Math.max(naturalSpacing, minSpacing);
    const totalW = spacing * count;
    const loopX = this._scrollX % totalW;

    // Normalize each item to its visible position using modular arithmetic.
    // After normalization x is in [0, totalW). If x > W + margin we bring it left;
    // this places off-screen-right items at negative x so they scroll cleanly into view.
    const margin = displaySize * 2;
    const positions = this._offscreens.map((item, i) => {
      let x = ((i * spacing + spacing / 2 - loopX) % totalW + totalW) % totalW;
      if (x > W + margin) x -= totalW;   // move ahead-of-screen items just off-screen left
      return { ...item, x };
    });

    // Draw all strings first
    ctx.strokeStyle = 'rgba(255,230,180,0.6)';
    ctx.lineWidth = 2;
    positions.forEach(({ x, hangY }) => {
      if (x < -margin || x > W + margin) return;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, hangY);
      ctx.stroke();
    });

    // Draw artworks with rotation around circle center
    positions.forEach(({ canvas: oc, size, x, hangY, rotation }) => {
      if (x < -margin || x > W + margin) return;
      const cx = x;
      const cy = hangY + size;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 20;
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.drawImage(oc, -size, -size, size * 2, size * 2);
      ctx.restore();
    });

    // Draw labels below the circle
    ctx.fillStyle = 'rgba(255,230,180,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    positions.forEach(({ size, fruitName, x, hangY }) => {
      if (x < -margin || x > W + margin) return;
      ctx.font = `bold ${Math.round(size * 0.25)}px "PingFang SC", Arial, sans-serif`;
      ctx.fillText(fruitName || '', x, hangY + size * 2 + 10);
    });
  }

  _drawHills(ctx, W, H, scrollX, baseY, color, heightRatio, count) {
    const hillW = W / count;
    const scrolled = scrollX % (hillW * 2);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let i = -2; i < count + 2; i++) {
      const cx = i * hillW * 2 - scrolled + hillW;
      ctx.bezierCurveTo(
        cx - hillW, baseY,
        cx - hillW * 0.5, baseY - H * heightRatio,
        cx, baseY - H * heightRatio
      );
      ctx.bezierCurveTo(
        cx + hillW * 0.5, baseY - H * heightRatio,
        cx + hillW, baseY,
        cx + hillW * 2, baseY
      );
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawClouds(ctx, W, H, scrollX) {
    const clouds = [
      { x: 0.1, y: 0.15, w: 0.18, h: 0.06 },
      { x: 0.35, y: 0.08, w: 0.22, h: 0.07 },
      { x: 0.65, y: 0.18, w: 0.15, h: 0.05 },
      { x: 0.85, y: 0.10, w: 0.20, h: 0.06 },
    ];
    const totalW = W;
    clouds.forEach(c => {
      const rawX = c.x * W - (scrollX % totalW);
      const x = rawX < -c.w * W ? rawX + totalW : rawX;
      const y = c.y * H;
      const w = c.w * W, h = c.h * H;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#fff';
      this._ellipseCloud(ctx, x, y, w, h);
      ctx.restore();
    });
  }

  _ellipseCloud(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(x - w * 0.25, y + h * 0.1, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.25, y + h * 0.1, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}


/* === student.js === */
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
    this._canvasRect = this.canvas.getBoundingClientRect();
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
        if (this.selectedShape) {
          this.selectedShape.tintColor = null;
          this.render();
        }
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
          if (this.selectedShape) {
            this.selectedShape.tintColor = shade;
            this.render();
          }
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
    document.getElementById('btn-layer-up')?.addEventListener('click', () => this.moveLayerUp());
    document.getElementById('btn-layer-down')?.addEventListener('click', () => this.moveLayerDown());
    this.setupCategoryTabs();
  }

  setSelectedShape(shape) {
    this.selectedShape = shape;
    this._updateSelectionToolbar();
  }

  _updateSelectionToolbar() {
    const hasSelection = !!(this.selectedShape || this.selectedFacePart);
    ['btn-copy', 'btn-delete', 'btn-layer-up', 'btn-layer-down'].forEach(id => {
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

  moveLayerUp() {
    if (!this.selectedShape) return;
    const idx = this.shapes.indexOf(this.selectedShape);
    if (idx < this.shapes.length - 1) {
      this.saveHistory();
      [this.shapes[idx], this.shapes[idx + 1]] = [this.shapes[idx + 1], this.shapes[idx]];
      this.syncToServer();
      this.render();
    }
  }

  moveLayerDown() {
    if (!this.selectedShape) return;
    const idx = this.shapes.indexOf(this.selectedShape);
    if (idx > 0) {
      this.saveHistory();
      [this.shapes[idx], this.shapes[idx - 1]] = [this.shapes[idx - 1], this.shapes[idx]];
      this.syncToServer();
      this.render();
    }
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
        this.render();
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
        this.render();
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
          this.render();
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
      // 选中形状添加阴影效果
      if (this.selectedShape && shape.id === this.selectedShape.id) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 5;
      }
      drawShape(ctx, shape, shape.size);
      if (this.selectedShape && shape.id === this.selectedShape.id) {
        ctx.restore();
      }
    });
  }

  renderFaceParts(ctx) {
    const sunR = getSunRadius(this.canvasRadius, this.mode);
    this.faceParts.forEach(part => {
      // 选中五官添加阴影效果
      if (this.selectedFacePart && part.id === this.selectedFacePart.id) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 5;
      }
      drawFacePart(ctx, part, this.centerX, this.centerY, sunR);
      if (this.selectedFacePart && part.id === this.selectedFacePart.id) {
        ctx.restore();
      }
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

    // 阴影效果：选中时形状浮起
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new StudentApp();
  app.init();
});
