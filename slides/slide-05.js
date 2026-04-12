// slide-05.js - 想象力空间 (with imagination image)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 5,
  title: '从观察走向创造'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText(slideConfig.title, {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "center"
  });

  // Main statement with accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 0.9, w: 5, h: 0.06,
    fill: { color: theme.accent },
  });

  slide.addText("'天空'既是观察对象，也是创作载体", {
    x: 0.5, y: 1.0, w: 9, h: 0.5,
    fontSize: 20, fontFace: "Microsoft YaHei",
    color: theme.accent, bold: true, align: "center"
  });

  // Imagination image as hero (full width bottom)
  slide.addImage({
    x: 0.4, y: 1.65, w: 5.8, h: 3.2,
    path: "./imgs/slide5-imagination.jpg",
    rounded: 0.15,
  });

  // Right side - 4 concept cards
  const concepts = [
    { emoji: "🌟", title: "开放延展", desc: "丰富的想象空间" },
    { emoji: "💭", title: "联想自由", desc: "鼓励自由表达" },
    { emoji: "🎨", title: "个性创作", desc: "支持个性化" },
    { emoji: "🚀", title: "创新意识", desc: "培养想象力" },
  ];

  const cardW = 3.3;
  const cardH = 0.72;
  const startX = 6.4;
  const startY = 1.65;
  const gapY = 0.18;

  concepts.forEach((c, index) => {
    const y = startY + index * (cardH + gapY);

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: startX, y: y, w: cardW, h: cardH,
      fill: { color: theme.light },
      rectRadius: 0.1,
    });

    // Emoji circle
    slide.addShape(pres.shapes.OVAL, {
      x: startX + 0.1, y: y + 0.1, w: 0.52, h: 0.52,
      fill: { color: theme.accent },
    });

    slide.addText(c.emoji, {
      x: startX + 0.1, y: y + 0.1, w: 0.52, h: 0.52,
      fontSize: 18, align: "center", valign: "middle",
    });

    // Title
    slide.addText(c.title, {
      x: startX + 0.7, y: y + 0.08, w: 2.4, h: 0.35,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, valign: "middle",
    });

    // Description
    slide.addText(c.desc, {
      x: startX + 0.7, y: y + 0.4, w: 2.4, h: 0.28,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, valign: "top",
    });
  });

  // Closing tagline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.0, w: 5.8, h: 0.03,
    fill: { color: theme.light },
  });

  slide.addText("在观察中想象，在想象中创造", {
    x: 0.4, y: 5.08, w: 5.8, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: theme.secondary, italic: true, align: "center",
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.primary },
  });

  slide.addText("5", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: "FFFFFF", bold: true,
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
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
