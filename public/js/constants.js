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
  breathingSpeed: 0.015
};

// Scale limits for pinch-zoom
const SCALE_LIMITS = {
  min: 0.5,
  max: 2.5
};
