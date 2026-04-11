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

// Shape types
const SHAPES = [
  { id: 'circle', name: '圆形' },
  { id: 'triangle', name: '三角形' },
  { id: 'square', name: '正方形' },
  { id: 'rectangle', name: '长方形' },
  { id: 'flower', name: '花朵' },
  { id: 'leaf', name: '树叶' },
  { id: 'star', name: '星星' },
  { id: 'cloud', name: '云朵' },
  { id: 'bird', name: '小鸟' }
];

// Mirror modes
const MODES = {
  AXISYMMETRIC: 'axisymmetric',
  QUAD: 'quad'
};

// Sun configuration
const SUN_CONFIG = {
  radius: 60,
  rayCount: 8,
  rayLength: 30,
  breathingMin: 0.6,
  breathingMax: 1.0,
  breathingSpeed: 0.02
};
