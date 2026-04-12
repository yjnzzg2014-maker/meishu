// slide-03.js - 时间线叙事 (with timeline image)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 3,
  title: '从白天到夜晚的自然叙事'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText(slideConfig.title, {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Large timeline image as hero visual (left side)
  slide.addImage({
    x: 0.4, y: 0.95, w: 6.2, h: 3.4,
    path: "./imgs/slide3-sky-timeline.jpg",
    rounded: 0.15,
  });

  // Right side - key points
  const points = [
    { icon: "☀️", text: "太阳 → 开启白天的叙事" },
    { icon: "☁️", text: "云朵 → 过渡与联想" },
    { icon: "🌈", text: "彩虹 → 色彩的魅力" },
    { icon: "⭐", text: "星空 → 夜晚的想象" },
  ];

  const startY = 1.1;
  points.forEach((point, index) => {
    const y = startY + index * 0.7;

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: 6.8, y: y, w: 0.5, h: 0.5,
      fill: { color: theme.accent },
    });

    slide.addText(point.icon, {
      x: 6.8, y: y, w: 0.5, h: 0.5,
      fontSize: 18, align: "center", valign: "middle",
    });

    // Point text
    slide.addText(point.text, {
      x: 7.4, y: y, w: 2.3, h: 0.5,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.primary, valign: "middle",
    });
  });

  // Key message at bottom
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 4.55, w: 9.2, h: 0.7,
    fill: { color: theme.light, transparency: 50 },
    rectRadius: 0.1,
  });

  slide.addText("构成完整的时间发展线索，帮助学生建立时间与画面变化的联系，强化单元的整体性与故事性", {
    x: 0.6, y: 4.55, w: 8.8, h: 0.7,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: theme.primary, valign: "middle", align: "center",
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
  });

  slide.addText("3", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: theme.primary, bold: true,
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
