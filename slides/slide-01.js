// slide-01.js - Cover Page
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: '小学美术项目式学习'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // === Decorative Elements ===

  // Top left decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: -1.2, y: -1.5, w: 3.5, h: 3.5,
    fill: { color: theme.light, transparency: 60 },
  });

  // Top right decorative rectangle
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.5, y: -0.3, w: 3.2, h: 1.8,
    rectRadius: 0.2,
    fill: { color: theme.accent, transparency: 25 },
  });

  // Bottom right decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: 4.2, w: 2.8, h: 2.8,
    fill: { color: theme.secondary, transparency: 50 },
  });

  // Bottom left decorative rectangle
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: -0.5, y: 4.5, w: 2.5, h: 1.5,
    rectRadius: 0.25,
    fill: { color: theme.light, transparency: 40 },
  });

  // Center decorative line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 2.0, w: 3, h: 0.08,
    fill: { color: theme.accent },
  });

  // Small accent dot above title
  slide.addShape(pres.shapes.OVAL, {
    x: 4.85, y: 1.3, w: 0.3, h: 0.3,
    fill: { color: theme.accent },
  });

  // === Main Content ===

  // Main Title - 60pt
  slide.addText("小学美术项目式学习", {
    x: 0.5, y: 1.7, w: 9, h: 1.0,
    fontSize: 60, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Subtitle - 36pt
  slide.addText("天空单元", {
    x: 0.5, y: 2.7, w: 9, h: 0.7,
    fontSize: 36, fontFace: "Microsoft YaHei",
    color: theme.secondary, bold: false,
    align: "center", valign: "middle",
  });

  // Tagline - 18pt
  slide.addText("让孩子在观察与想象中感受天空之美", {
    x: 0.5, y: 3.5, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei",
    color: theme.secondary, bold: false,
    align: "center", valign: "middle",
  });

  // Bottom decorative bar
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 3.8, y: 4.6, w: 2.4, h: 0.12,
    rectRadius: 0.06,
    fill: { color: theme.accent },
  });

  // Bottom text
  slide.addText("一年级美术教学设计", {
    x: 0.5, y: 4.85, w: 9, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: false,
    align: "center", valign: "middle",
  });

  return slide;
}

// Standalone preview
if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "023047", secondary: "219ebc",
    accent: "ffb703", light: "8ecae6", bg: "caf0f8"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
