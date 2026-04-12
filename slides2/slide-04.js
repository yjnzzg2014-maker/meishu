// slide-04.js - 上天摘星星
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 4,
  title: '整合与升华：《上天摘星星》'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText("整合与升华：《上天摘星星》", {
    x: 0.5, y: 0.25, w: 6, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.85, w: 1.5, h: 0.32,
    fill: { color: theme.primary },
    rectRadius: 0.15,
  });
  slide.addText("收官课", {
    x: 0.5, y: 0.85, w: 1.5, h: 0.32,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle",
  });

  // Left - Image
  slide.addImage({
    x: 0.4, y: 1.3, w: 4.6, h: 3.3,
    path: "./imgs/slide4-star-craft.jpg",
    rounded: 0.15,
  });

  // Right - Integration cards
  const integrations = [
    { icon: "☀️", title: "第一课", desc: "粘土太阳", color: theme.accent },
    { icon: "☁️", title: "第二课", desc: "云朵联想", color: theme.secondary },
    { icon: "🌈", title: "第三课", desc: "彩虹故事", color: theme.light },
  ];

  const cardW = 4.5;
  const cardH = 0.6;
  const startX = 5.2;
  const startY = 1.25;
  const gap = 0.1;

  // Integration header
  slide.addText("前三课整合", {
    x: startX, y: startY, w: cardW, h: 0.35,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
  });

  integrations.forEach((item, i) => {
    const y = startY + 0.4 + i * (cardH + gap);

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: startX, y: y, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.1,
      line: { color: item.color, width: 2 },
    });

    // Icon
    slide.addText(item.icon, {
      x: startX + 0.1, y: y, w: 0.5, h: cardH,
      fontSize: 20, align: "center", valign: "middle",
    });

    // Title
    slide.addText(item.title, {
      x: startX + 0.65, y: y + 0.08, w: 1.2, h: 0.28,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, valign: "middle",
    });

    // Desc
    slide.addText(item.desc, {
      x: startX + 1.8, y: y + 0.08, w: 2.5, h: 0.28,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, valign: "middle",
    });
  });

  // New techniques
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 3.4, w: 4.5, h: 0.65,
    fill: { color: theme.light },
    rectRadius: 0.1,
  });
  slide.addText("🎯 新技法：纸弹簧 + 综合材料", {
    x: 5.3, y: 3.4, w: 4.3, h: 0.35,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
  });
  slide.addText("制作可弹跳的立体星星", {
    x: 5.3, y: 3.7, w: 4.3, h: 0.3,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: theme.secondary,
  });

  // Space & dynamic effect
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 4.15, w: 4.5, h: 0.6,
    fill: { color: theme.accent, transparency: 30 },
    rectRadius: 0.1,
    line: { color: theme.accent, width: 1.5 },
  });
  slide.addText("空间层次 + 动态效果", {
    x: 5.2, y: 4.15, w: 4.5, h: 0.6,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Bottom
  slide.addText("构建完整'天空世界'", {
    x: 0.4, y: 4.85, w: 4.6, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.secondary, italic: true,
  });

  // Page number
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
  });
  slide.addText("04", {
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
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
