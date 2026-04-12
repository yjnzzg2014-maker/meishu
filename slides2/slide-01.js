// slide-01.js - 我的太阳（立体造型）
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 1,
  title: '从平面到立体：《我的太阳》'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText("从平面到立体：《我的太阳》", {
    x: 0.5, y: 0.25, w: 6, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Subtitle badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.85, w: 1.8, h: 0.35,
    fill: { color: theme.accent },
    rectRadius: 0.15,
  });
  slide.addText("第二课时", {
    x: 0.5, y: 0.85, w: 1.8, h: 0.35,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Left content area - key points
  const points = [
    { icon: "📐", title: "教学转型", desc: "从平面点线到立体造型" },
    { icon: "🎯", title: "核心技法", desc: "团、搓、捏（超轻粘土）" },
    { icon: "😊", title: "教学难点", desc: "太阳的'拟人化表情'" },
    { icon: "💫", title: "情感表达", desc: "喜、怒、哀、乐等情绪" },
  ];

  const startY = 1.35;
  points.forEach((p, i) => {
    const y = startY + i * 0.72;

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.4, y: y, w: 5.0, h: 0.62,
      fill: { color: theme.light },
      rectRadius: 0.1,
    });

    // Icon
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.08, w: 0.46, h: 0.46,
      fill: { color: theme.accent },
    });
    slide.addText(p.icon, {
      x: 0.5, y: y + 0.08, w: 0.46, h: 0.46,
      fontSize: 16, align: "center", valign: "middle",
    });

    // Title
    slide.addText(p.title, {
      x: 1.05, y: y + 0.06, w: 4.2, h: 0.28,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, valign: "middle",
    });

    // Desc
    slide.addText(p.desc, {
      x: 1.05, y: y + 0.32, w: 4.2, h: 0.26,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, valign: "top",
    });
  });

  // Highlight box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 4.25, w: 5.0, h: 0.55,
    fill: { color: theme.accent, transparency: 30 },
    rectRadius: 0.1,
    line: { color: theme.accent, width: 1.5 },
  });
  slide.addText("核心：从'符号太阳'到'有情感的形象'", {
    x: 0.5, y: 4.25, w: 4.8, h: 0.55,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Right image area
  slide.addImage({
    x: 5.6, y: 0.6, w: 4.1, h: 4.3,
    path: "./imgs/slide1-sun-clay.jpg",
    rounded: 0.15,
  });

  // Page number
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
  });
  slide.addText("01", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "023047", secondary: "219ebc", accent: "ffb703", light: "8ecae6", bg: "caf0f8" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
