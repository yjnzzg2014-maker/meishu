// Color palette - Warm Sun Macaron
const COLORS = {
  sun: '#FFD700',
  sunGlow: '#FFA500'
};

// Tint color palette for shapes
const TINT_COLORS = [
  null,        // No tint (original)
  '#E74C3C',   // Red
  '#E67E22',   // Orange
  '#F1C40F',   // Yellow
  '#2ECC71',   // Green
  '#3498DB',   // Blue
  '#9B59B6',   // Purple
  '#E91E90',   // Pink
  '#8B4513',   // Brown
  '#2C3E50',   // Dark
];

// Shape categories: dots and lines
const SHAPE_CATEGORIES = [
  { id: 'dots', name: '点' },
  { id: 'lines', name: '线' }
];

// Shapes - PNG-based, extensible: add a PNG file + one line here
// Custom shapes are appended at runtime from server
const SHAPES = [
  { id: 'dot1', name: '点1', category: 'dots', src: 'assets/shapes/dots/dot1.png' },
  { id: 'dot2', name: '点2', category: 'dots', src: 'assets/shapes/dots/dot2.png' },
  { id: 'dot3', name: '点3', category: 'dots', src: 'assets/shapes/dots/dot3.png' },
  { id: 'dot4', name: '点4', category: 'dots', src: 'assets/shapes/dots/dot4.png' },
  { id: 'line1', name: '线1', category: 'lines', src: 'assets/shapes/lines/line1.png' },
  { id: 'line2', name: '线2', category: 'lines', src: 'assets/shapes/lines/line2.png' },
  { id: 'line3', name: '线3', category: 'lines', src: 'assets/shapes/lines/line3.png' }
];

// Three operating modes
const MODES = {
  SYMMETRIC: 'symmetric',
  PERSONIFY: 'personify',
  FREE: 'free'
};

// Sun skins
const SUN_SKINS = [
  { id: 'cartoon', name: '卡通', baseColor: '#FFD700', glowColor: '#FFA500', rayColor: '#FFCC00', faceColor: '#E8A000' },
  { id: 'watercolor', name: '水彩', baseColor: '#FFE082', glowColor: '#FFCC80', rayColor: '#FFD54F', faceColor: '#D4A056' },
  { id: 'sketch', name: '简笔画', baseColor: '#FFF9C4', glowColor: '#FFF176', rayColor: '#FFF59D', faceColor: '#C0A030' },
  { id: 'sunset', name: '夕阳', baseColor: '#FF8A65', glowColor: '#FF5722', rayColor: '#FF7043', faceColor: '#BF360C' },
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
  radiusRatio: 0.18,
  personifyRadiusRatio: 0.32,   // Larger sun in personify mode for face operations
  rayCount: 12,
  rayLengthRatio: 0.06,
  breathingMin: 0.95,
  breathingMax: 1.05,
  breathingSpeed: 0.015
};

// Scale limits for pinch-zoom
const SCALE_LIMITS = {
  min: 0.5,
  max: 2.5
};
