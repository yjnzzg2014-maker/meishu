// Color palette - Warm Sun Macaron
const COLORS = {
  sun: '#FFD700',
  sunGlow: '#FFA500',
  shapes: {
    pink: '#FFB5C5',
    orange: '#FFB366',
    yellow: '#FFE066',
    mint: '#98E4D0',
    sky: '#87CEEB',
    lavender: '#C9B1FF',
    peach: '#FFCBA4',
    coral: '#FF8A80'
  }
};

// Shape types with categories
const SHAPES = [
  { id: 'circle', name: '圆形', category: 'geometry' },
  { id: 'triangle', name: '三角形', category: 'geometry' },
  { id: 'square', name: '正方形', category: 'geometry' },
  { id: 'rectangle', name: '长方形', category: 'geometry' },
  { id: 'flower', name: '花朵', category: 'nature' },
  { id: 'leaf', name: '树叶', category: 'nature' },
  { id: 'star', name: '星星', category: 'nature' },
  { id: 'cloud', name: '云朵', category: 'nature' },
  { id: 'bird', name: '小鸟', category: 'nature' }
];

const SHAPE_CATEGORIES = [
  { id: 'geometry', name: '几何' },
  { id: 'nature', name: '自然' }
];

// Three operating modes
const MODES = {
  SYMMETRIC: 'symmetric',     // Symmetric decoration around sun
  PERSONIFY: 'personify',     // Face decoration on sun
  FREE: 'free'                // Both types available
};

// Sun skins
const SUN_SKINS = [
  { id: 'cartoon', name: '卡通', baseColor: '#FFD700', glowColor: '#FFA500', rayColor: '#FFCC00', faceColor: '#E8A000' },
  { id: 'watercolor', name: '水彩', baseColor: '#FFE082', glowColor: '#FFCC80', rayColor: '#FFD54F', faceColor: '#D4A056' },
  { id: 'sketch', name: '简笔画', baseColor: '#FFF9C4', glowColor: '#FFF176', rayColor: '#FFF59D', faceColor: '#C0A030' },
  { id: 'sunset', name: '夕阳', baseColor: '#FF8A65', glowColor: '#FF5722', rayColor: '#FF7043', faceColor: '#BF360C' },
  { id: 'simple', name: '简约', imagePath: 'images/sun-simple-alpha.png', makeWhiteTransparent: true }
];

// Face part definitions for personify mode
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

// Sun configuration - much larger (35-40% of canvas diameter)
const SUN_CONFIG = {
  radiusRatio: 0.18,       // Sun radius as fraction of canvas radius (was fixed 60px ~15%)
  rayCount: 12,
  rayLengthRatio: 0.06,    // Ray length as fraction of canvas radius
  breathingMin: 0.95,
  breathingMax: 1.05,
  breathingSpeed: 0.015
};

// Scale limits for pinch-zoom
const SCALE_LIMITS = {
  min: 0.5,
  max: 2.5
};
