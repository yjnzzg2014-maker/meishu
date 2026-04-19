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


/* === draw-tool.js === */
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


/* === teacher.js === */
class TeacherApp {
  constructor() {
    this.client = new SocketClient();
    this.students = new Map();
    this.mode = 'symmetric';
    this.locked = false;
    this.breathPhase = 0;
    this.animationId = null;
    this.zoomedStudentId = null;
    this.selectedStudentId = null;
    this.sunAnimation = null;

    // Drawing tool
    this.drawTool = null;

    // Face import state
    this.faceImportData = null;

    // Shape import state
    this.shapeImportData = null;

    // Gallery selection state
    this.gallerySelectMode = false;
    this.gallerySelectedIds = new Set();

    // Shape multi-select state
    this.selectedShapeIds = new Set();

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable animation if user prefers reduced motion
    if (this.prefersReducedMotion) {
      this.breathPhase = Math.PI; // Use middle point for breathing
    }

    this.init();
  }

  async init() {
    await AssetLoader.loadAll();
    document.getElementById('loader')?.remove();

    this.setupControls();
    this.setupAssetManagement();
    this.connectSocket();
    this.startAnimation();
    this.renderCustomAssets();
    this.initStudentCardObserver();
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

    // Asset section collapse toggle
    const collapseBtn = document.getElementById('btn-collapse-assets');
    const assetSection = document.getElementById('asset-section');
    if (collapseBtn && assetSection) {
      collapseBtn.addEventListener('click', () => {
        const collapsed = assetSection.classList.toggle('collapsed');
        collapseBtn.setAttribute('aria-expanded', String(!collapsed));
        collapseBtn.setAttribute('aria-label', collapsed ? '展开素材管理' : '折叠素材管理');
      });
    }

    // Close zoom button
    const closeZoom = document.getElementById('close-zoom');
    if (closeZoom) {
      closeZoom.addEventListener('click', () => this.closeZoom());
    }

    // Clear all students
    document.getElementById('btn-clear-all')?.addEventListener('click', () => {
      if (!confirm('确定清除所有学生？学生端将断开连接、清空画板并重新加入。')) return;
      this.client.clearAllStudents();
    });

    // Showcase controls
    const showcaseBtn = document.getElementById('btn-showcase');
    const stopShowcaseBtn = document.getElementById('btn-stop-showcase');
    const showcaseDialog = document.getElementById('showcase-dialog');

    if (showcaseBtn) {
      showcaseBtn.addEventListener('click', () => {
        if (this.selectedStudentId) {
          showcaseDialog?.classList.add('visible');
        }
      });
    }
    document.getElementById('showcase-dialog-close')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
    });
    document.getElementById('btn-showcase-frozen')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
      if (this.selectedStudentId) this.client.startShowcase(this.selectedStudentId, true);
    });
    document.getElementById('btn-showcase-live')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
      if (this.selectedStudentId) this.client.startShowcase(this.selectedStudentId, false);
    });
    if (stopShowcaseBtn) {
      stopShowcaseBtn.addEventListener('click', () => this.client.stopShowcase());
    }

    // Gallery controls
    const gallerySelectBtn = document.getElementById('btn-gallery-select');
    const startGalleryBtn = document.getElementById('btn-start-gallery');
    const stopGalleryBtn = document.getElementById('btn-stop-gallery');

    if (gallerySelectBtn) {
      gallerySelectBtn.addEventListener('click', () => {
        this.gallerySelectMode = !this.gallerySelectMode;
        gallerySelectBtn.classList.toggle('active', this.gallerySelectMode);
        if (!this.gallerySelectMode) {
          this.gallerySelectedIds.clear();
          document.querySelectorAll('.student-card.gallery-selected').forEach(c => c.classList.remove('gallery-selected'));
          if (startGalleryBtn) startGalleryBtn.hidden = true;
        }
      });
    }
    if (startGalleryBtn) {
      startGalleryBtn.addEventListener('click', () => {
        const ids = [...this.gallerySelectedIds];
        if (ids.length > 0) this.client.startGallery(ids);
      });
    }
    if (stopGalleryBtn) {
      stopGalleryBtn.addEventListener('click', () => this.client.stopGallery());
    }
  }

  setupAssetManagement() {
    // --- Drawing Tool ---
    this.drawTool = new DrawTool(async (data) => {
      try {
        const res = await fetch('/api/shapes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to save shape:', e);
      }
    });

    const drawBtn = document.getElementById('btn-draw-shape');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => this.drawTool.show());
    }

    // --- Face Import ---
    const importBtn = document.getElementById('btn-import-face');
    const fileInput = document.getElementById('face-file-input');
    const faceModal = document.getElementById('face-import-modal');

    if (importBtn) {
      importBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.faceImportData = ev.target.result;
          // Show preview
          const previewArea = document.getElementById('face-preview-area');
          if (previewArea) {
            previewArea.innerHTML = '';
            const img = document.createElement('img');
            img.src = this.faceImportData;
            img.style.maxWidth = '120px';
            img.style.maxHeight = '120px';
            previewArea.appendChild(img);
          }
          // Show modal
          if (faceModal) faceModal.classList.add('visible');
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
      });
    }

    // Face modal controls
    document.getElementById('face-modal-close')?.addEventListener('click', () => {
      faceModal?.classList.remove('visible');
    });
    document.getElementById('face-modal-cancel')?.addEventListener('click', () => {
      faceModal?.classList.remove('visible');
    });

    // Face category buttons
    document.querySelectorAll('.face-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.face-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Face save
    document.getElementById('face-modal-save')?.addEventListener('click', async () => {
      const name = document.getElementById('face-import-name')?.value.trim();
      if (!name) { alert('请输入五官名称'); return; }
      if (!this.faceImportData) { alert('请选择图片'); return; }

      const activeCat = document.querySelector('.face-cat-btn.active');
      const category = activeCat ? activeCat.dataset.cat : 'eyes';

      try {
        const res = await fetch('/api/faces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, imageData: this.faceImportData })
        });
        if (res.ok) {
          faceModal?.classList.remove('visible');
          document.getElementById('face-import-name').value = '';
          this.faceImportData = null;
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to import face:', e);
      }
    });

    // --- Shape Import ---
    const shapeImportBtn = document.getElementById('btn-import-shape');
    const shapeFileInput = document.getElementById('shape-file-input');
    const shapeModal = document.getElementById('shape-import-modal');

    if (shapeImportBtn) {
      shapeImportBtn.addEventListener('click', () => shapeFileInput.click());
    }

    if (shapeFileInput) {
      shapeFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.shapeImportData = ev.target.result;
          const previewArea = document.getElementById('shape-preview-area');
          if (previewArea) {
            previewArea.innerHTML = '';
            const img = document.createElement('img');
            img.src = this.shapeImportData;
            img.style.maxWidth = '120px';
            img.style.maxHeight = '120px';
            previewArea.appendChild(img);
          }
          if (shapeModal) shapeModal.classList.add('visible');
        };
        reader.readAsDataURL(file);
        shapeFileInput.value = '';
      });
    }

    // Shape modal controls
    document.getElementById('shape-modal-close')?.addEventListener('click', () => {
      shapeModal?.classList.remove('visible');
    });
    document.getElementById('shape-modal-cancel')?.addEventListener('click', () => {
      shapeModal?.classList.remove('visible');
    });

    // Shape category buttons
    document.querySelectorAll('.shape-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shape-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Shape save
    document.getElementById('shape-modal-save')?.addEventListener('click', async () => {
      const name = document.getElementById('shape-import-name')?.value.trim();
      if (!name) { alert('请输入素材名称'); return; }
      if (!this.shapeImportData) { alert('请选择图片'); return; }

      const activeCat = document.querySelector('.shape-cat-btn.active');
      const category = activeCat ? activeCat.dataset.cat : 'dots';

      try {
        const res = await fetch('/api/shapes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, imageData: this.shapeImportData })
        });
        if (res.ok) {
          shapeModal?.classList.remove('visible');
          document.getElementById('shape-import-name').value = '';
          this.shapeImportData = null;
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to import shape:', e);
      }
    });

    // --- Shape Multi-Select ---
    const selectAllBtn = document.getElementById('btn-select-all-shapes');
    const deleteSelectedBtn = document.getElementById('btn-delete-selected-shapes');

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        const customShapes = SHAPES.filter(s => s.custom);
        if (this.selectedShapeIds.size === customShapes.length) {
          // Deselect all
          this.selectedShapeIds.clear();
          selectAllBtn.textContent = '全选';
        } else {
          // Select all
          customShapes.forEach(s => this.selectedShapeIds.add(s.id));
          selectAllBtn.textContent = '取消全选';
        }
        this.renderCustomAssets();
      });
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener('click', async () => {
        const count = this.selectedShapeIds.size;
        if (count === 0) return;
        if (!confirm(`确定删除选中的 ${count} 个素材？`)) return;

        try {
          for (const id of this.selectedShapeIds) {
            await fetch(`/api/shapes/${id}`, { method: 'DELETE' });
          }
          this.selectedShapeIds.clear();
          // Don't call reload/render here - socket event will handle it
        } catch (e) {
          console.error('Failed to delete shapes:', e);
        }
      });
    }
  }

  updateDeleteSelectedBtn() {
    const deleteSelectedBtn = document.getElementById('btn-delete-selected-shapes');
    const selectAllBtn = document.getElementById('btn-select-all-shapes');
    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = this.selectedShapeIds.size === 0;
      deleteSelectedBtn.textContent = `删除选中 (${this.selectedShapeIds.size})`;
    }
    if (selectAllBtn) {
      const customShapes = SHAPES.filter(s => s.custom);
      selectAllBtn.textContent = this.selectedShapeIds.size === customShapes.length ? '取消全选' : '全选';
    }
  }

  renderCustomAssets() {
    // Render custom shapes
    const shapesGrid = document.getElementById('custom-shapes-grid');
    const noShapes = document.getElementById('no-custom-shapes');
    if (shapesGrid) {
      shapesGrid.innerHTML = '';
      const customShapes = SHAPES.filter(s => s.custom);
      if (noShapes) noShapes.style.display = customShapes.length ? 'none' : 'block';

      customShapes.forEach(shape => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        if (this.selectedShapeIds.has(shape.id)) {
          card.classList.add('selected');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.selectedShapeIds.has(shape.id);
        checkbox.style.cssText = 'position:absolute;top:4px;left:4px;z-index:1;cursor:pointer';
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            this.selectedShapeIds.add(shape.id);
            card.classList.add('selected');
          } else {
            this.selectedShapeIds.delete(shape.id);
            card.classList.remove('selected');
          }
          this.updateDeleteSelectedBtn();
        });
        card.appendChild(checkbox);

        const img = AssetLoader.get(`shape_${shape.id}`);
        if (img) {
          const preview = document.createElement('canvas');
          preview.width = 60;
          preview.height = 60;
          const pctx = preview.getContext('2d');
          pctx.drawImage(img, 5, 5, 50, 50);
          card.appendChild(preview);
        }

        const info = document.createElement('div');
        info.className = 'asset-info';
        info.innerHTML = `<span class="asset-name">${shape.name}</span><span class="asset-cat">${shape.category === 'dots' ? '点' : '线'}</span>`;
        card.appendChild(info);

        const delBtn = document.createElement('button');
        delBtn.className = 'asset-del-btn';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', async () => {
          if (!confirm(`确定删除素材"${shape.name}"？`)) return;
          try {
            await fetch(`/api/shapes/${shape.id}`, { method: 'DELETE' });
          } catch (e) { console.error(e); }
        });
        card.appendChild(delBtn);

        shapesGrid.appendChild(card);
      });

      this.updateDeleteSelectedBtn();
    }

    // Render custom faces
    const facesGrid = document.getElementById('custom-faces-grid');
    const noFaces = document.getElementById('no-custom-faces');
    if (facesGrid) {
      facesGrid.innerHTML = '';
      const catNames = { eyes: '眼睛', noses: '鼻子', mouths: '嘴巴', extras: '其他' };
      let customFaceCount = 0;

      for (const catId of Object.keys(FACE_PARTS)) {
        FACE_PARTS[catId].filter(f => f.custom).forEach(face => {
          customFaceCount++;
          const card = document.createElement('div');
          card.className = 'asset-card';

          const img = AssetLoader.get(`face_${face.id}`);
          if (img) {
            const preview = document.createElement('canvas');
            preview.width = 60;
            preview.height = 60;
            const pctx = preview.getContext('2d');
            pctx.drawImage(img, 5, 5, 50, 50);
            card.appendChild(preview);
          }

          const info = document.createElement('div');
          info.className = 'asset-info';
          info.innerHTML = `<span class="asset-name">${face.name}</span><span class="asset-cat">${catNames[catId] || catId}</span>`;
          card.appendChild(info);

          const delBtn = document.createElement('button');
          delBtn.className = 'asset-del-btn';
          delBtn.textContent = '删除';
          delBtn.addEventListener('click', async () => {
            if (!confirm(`确定删除五官"${face.name}"？`)) return;
            try {
              await fetch(`/api/faces/${face.id}`, { method: 'DELETE' });
            } catch (e) { console.error(e); }
          });
          card.appendChild(delBtn);

          facesGrid.appendChild(card);
        });
      }

      if (noFaces) noFaces.style.display = customFaceCount ? 'none' : 'block';
    }
  }

  initStudentCardObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const studentId = entry.target.dataset.studentId;
          this.renderStudentCanvas(studentId);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.student-card').forEach(card => {
      observer.observe(card);
    });
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

      if (data.students) {
        data.students.forEach(s => {
          this.addStudentEntry(s.id || s.socketId, s);
        });
      }
      this.updateStudentCount();
    });

    this.client.on('student_joined', (data) => {
      // If this is a reconnect (student came back), find by sessionId and update
      if (data.isReconnect && data.sessionId) {
        // Find existing student by sessionId
        let existingEntry = null;
        let existingId = null;
        this.students.forEach((entry, id) => {
          if (entry.sessionId === data.sessionId) {
            existingEntry = entry;
            existingId = id;
          }
        });
        if (existingEntry && existingId !== data.id) {
          // Remove old entry and re-add with new id
          this.students.delete(existingId);
          existingEntry.disconnected = false;
          existingEntry.name = data.name;
          existingEntry.sunSkin = data.sunSkin;
          if (data.fruitName) existingEntry.fruitName = data.fruitName;
          this.students.set(data.id, existingEntry);
          // Update the card's studentId
          if (existingEntry.card) {
            existingEntry.card.dataset.studentId = data.id;
          }
          this.updateStudentCard(data.id);
          console.log(`Teacher: Student reconnected, updated entry from ${existingId} to ${data.id}`);
          this.updateStudentCount();
          return;
        }
      }

      // If student already exists (reconnect), just mark as online
      const existing = this.students.get(data.id);
      if (existing) {
        existing.disconnected = false;
        existing.name = data.name;
        existing.sunSkin = data.sunSkin;
        if (data.fruitName) existing.fruitName = data.fruitName;
        this.updateStudentCard(data.id);
      } else {
        this.addStudentEntry(data.id, { shapes: [], faceParts: [], sunSkin: data.sunSkin, name: data.name, disconnected: false, sessionId: data.sessionId, fruitName: data.fruitName || null });
      }
      this.updateStudentCount();
    });

    this.client.on('student_left', (data) => {
      // Try to find by socket.id first, then by sessionId
      let idToRemove = data.id;
      if (data.sessionId) {
        this.students.forEach((entry, id) => {
          if (entry.sessionId === data.sessionId) {
            idToRemove = id;
          }
        });
      }
      this.removeStudentEntry(idToRemove);
      this.updateStudentCount();
      if (this.zoomedStudentId === idToRemove) {
        this.closeZoom();
      }
    });

    this.client.on('student_disconnected', (data) => {
      // Try to find by socket.id first, then by sessionId
      let entry = this.students.get(data.id);
      if (!entry && data.sessionId) {
        this.students.forEach((e, id) => {
          if (e.sessionId === data.sessionId) {
            entry = e;
            data.id = id; // Update the id to the actual key
          }
        });
      }
      if (entry) {
        entry.disconnected = true;
        this.updateStudentCard(data.id);
      }
      this.updateStudentCount();
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
      this.updateStudentCountDisplay(summaries.length);
    });

    // Reload custom assets when updated
    this.client.on('assets_updated', async () => {
      await AssetLoader.reloadCustomAssets();
      this.renderCustomAssets();
    });

    // Handle student state response for zoom view
    this.client.on('student_state', (data) => {
      const entry = this.students.get(data.id);
      if (entry) entry.state = data.state;
    });

    this.client.on('showcase_status', (data) => {
      const showcaseBtn = document.getElementById('btn-showcase');
      const stopBtn = document.getElementById('btn-stop-showcase');
      if (data.active) {
        if (showcaseBtn) showcaseBtn.hidden = true;
        if (stopBtn) stopBtn.hidden = false;
      } else {
        if (showcaseBtn) { showcaseBtn.hidden = false; }
        if (stopBtn) stopBtn.hidden = true;
      }
    });

    this.client.on('gallery_status', (data) => {
      const startBtn = document.getElementById('btn-start-gallery');
      const stopBtn = document.getElementById('btn-stop-gallery');
      const selectBtn = document.getElementById('btn-gallery-select');
      if (data.active) {
        if (startBtn) startBtn.hidden = true;
        if (stopBtn) stopBtn.hidden = false;
        if (selectBtn) selectBtn.hidden = true;
      } else {
        if (stopBtn) stopBtn.hidden = true;
        if (startBtn) startBtn.hidden = true;
        if (selectBtn) selectBtn.hidden = false;
        this.gallerySelectMode = false;
        this.gallerySelectedIds.clear();
        document.querySelectorAll('.student-card.gallery-selected').forEach(c => c.classList.remove('gallery-selected'));
        selectBtn?.classList.remove('active');
      }
    });

    this.client.on('all_students_cleared', () => {
      // Remove all student cards from UI
      this.students.forEach((entry) => {
        if (entry.card) entry.card.remove();
      });
      this.students.clear();
      this.selectedStudentId = null;
      this.zoomedStudentId = null;
      this.gallerySelectedIds.clear();
      this.gallerySelectMode = false;
      this.closeZoom();
      this.updateStudentCount();
      const showcaseBtn = document.getElementById('btn-showcase');
      if (showcaseBtn) showcaseBtn.disabled = true;
    });
  }

  addStudentEntry(id, state) {
    if (this.students.has(id)) {
      this.students.get(id).state = state;
      return;
    }

    const grid = document.getElementById('student-grid');
    if (!grid) return;

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
    label.textContent = state.fruitName || state.name || 'Student';
    card.appendChild(label);

    card.addEventListener('click', () => {
      if (this.gallerySelectMode) {
        if (this.gallerySelectedIds.has(id)) {
          this.gallerySelectedIds.delete(id);
          card.classList.remove('gallery-selected');
        } else {
          this.gallerySelectedIds.add(id);
          card.classList.add('gallery-selected');
        }
        const startBtn = document.getElementById('btn-start-gallery');
        if (startBtn) startBtn.hidden = this.gallerySelectedIds.size === 0;
        return;
      }

      if (this.selectedStudentId === id) {
        // 取消选中并关闭放大
        this.selectedStudentId = null;
        this.zoomedStudentId = null;
        card.classList.remove('selected');
        this.closeZoom();
        const showcaseBtn = document.getElementById('btn-showcase');
        if (showcaseBtn) showcaseBtn.disabled = true;
      } else {
        // 选中并放大
        if (this.selectedStudentId) {
          const prev = document.querySelector('.student-card.selected');
          if (prev) prev.classList.remove('selected');
        }
        this.selectedStudentId = id;
        card.classList.add('selected');
        this.zoomStudent(id);
        const showcaseBtn = document.getElementById('btn-showcase');
        if (showcaseBtn) showcaseBtn.disabled = false;
      }
    });

    grid.appendChild(card);

    this.students.set(id, {
      state: state,
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      card: card,
      sessionId: state.sessionId || null,
      fruitName: state.fruitName || null
    });
  }

  removeStudentEntry(id) {
    const entry = this.students.get(id);
    if (entry && entry.card) {
      entry.card.remove();
    }
    this.students.delete(id);
  }

  updateStudentCard(id) {
    const entry = this.students.get(id);
    if (entry && entry.card) {
      entry.card.classList.toggle('disconnected', !!entry.disconnected);
    }
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

  zoomStudent(id) {
    this.zoomedStudentId = id;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.add('visible');

    // HD canvas support
    const canvas = document.getElementById('zoom-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 500 * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = '500px';
      canvas.style.height = '500px';
      ctx.scale(dpr, dpr);
    }

    this.client.getStudentState(id);
  }

  closeZoom() {
    this.zoomedStudentId = null;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.remove('visible');
  }

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

    // Disable animation if user prefers reduced motion
    if (this.prefersReducedMotion && this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      return;
    }

    animate();
  }

  renderAll(breathScale) {
    this.students.forEach((entry, id) => {
      this.renderStudentCanvas(entry, breathScale);
    });

    if (this.zoomedStudentId) {
      this.renderZoomView(breathScale);
    }
  }

  renderStudentCanvas(entry, breathScale) {
    const ctx = entry.ctx;
    const w = entry.canvas.width;
    const h = entry.canvas.height;
    const cx = w / 2, cy = h / 2, r = w / 2 - 5;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale, this.mode);

    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];
    const studentCanvasRadius = (entry.state && entry.state.canvasRadius) || 400;
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r, this.mode);
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

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale, this.mode);

    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];
    const studentCanvasRadius = (entry.state && entry.state.canvasRadius) || 400;
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r, this.mode);
      faceParts.forEach(part => {
        const scaledPart = {
          ...part,
          offsetX: part.offsetX * scaleFactor,
          offsetY: part.offsetY * scaleFactor
        };
        drawFacePart(ctx, scaledPart, cx, cy, sunR);
      });
    }

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
