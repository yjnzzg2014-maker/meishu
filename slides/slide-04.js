// slide-04.js - 多样技法体验 (with classroom image)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 4,
  title: '多元技法，丰富体验'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText(slideConfig.title, {
    x: 0.5, y: 0.25, w: 5.5, h: 0.55,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Art classroom image (right side, large)
  slide.addImage({
    x: 5.5, y: 0.7, w: 4.2, h: 3.5,
    path: "./imgs/slide4-art-classroom.jpg",
    rounded: 0.15,
  });

  // 2x2 technique cards (left side)
  const cardW = 2.5;
  const cardH = 1.55;
  const startX = 0.4;
  const startY = 0.95;
  const gapX = 0.2;
  const gapY = 0.2;

  const cards = [
    { icon: "🏺", name: "粘土造型", result: "太阳", desc: "用粘土捏出立体感", color: theme.accent },
    { icon: "🧽", name: "海绵拍印", result: "云朵", desc: "拍印出柔软纹理", color: theme.secondary },
    { icon: "🎨", name: "油画棒绘画", result: "彩虹", desc: "画出绚丽色彩", color: theme.light },
    { icon: "✨", name: "综合材料", result: "星空", desc: "拼贴梦幻效果", color: theme.primary },
  ];

  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    // Card background
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.12,
      line: { color: theme.light, width: 1 },
    });

    // Colored header
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: cardW, h: 0.45,
      fill: { color: card.color },
      rectRadius: 0.12,
    });
    // Cover bottom corners
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y + 0.3, w: cardW, h: 0.2,
      fill: { color: card.color },
    });

    // Icon + name
    slide.addText(card.icon + " " + card.name, {
      x: x + 0.1, y: y + 0.05, w: cardW - 0.2, h: 0.38,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, valign: "middle",
    });

    // Result
    slide.addText("→ " + card.result, {
      x: x + 0.15, y: y + 0.55, w: cardW - 0.3, h: 0.35,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true,
    });

    // Description
    slide.addText(card.desc, {
      x: x + 0.15, y: y + 0.9, w: cardW - 0.3, h: 0.5,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary,
    });
  });

  // Bottom text
  slide.addText("技法各不相同，避免重复，提升学生动手能力与兴趣", {
    x: 0.4, y: 4.85, w: 5, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.secondary,
  });

  // Page number badge
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

// Standalone preview
if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "023047", secondary: "219ebc",
    accent: "ffb703", light: "8ecae6", bg: "caf0f8"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
