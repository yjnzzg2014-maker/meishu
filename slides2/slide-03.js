// slide-03.js - 彩虹的故事
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 3,
  title: '从色彩到故事：《彩虹的故事》'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText("从色彩到故事：《彩虹的故事》", {
    x: 0.5, y: 0.25, w: 6, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Left - Image
  slide.addImage({
    x: 0.4, y: 0.9, w: 4.8, h: 3.5,
    path: "./imgs/slide3-rainbow-story.jpg",
    rounded: 0.15,
  });

  // Right content - learning points
  const points = [
    { icon: "🌈", title: "七色学习", desc: "红橙黄绿蓝靛紫" },
    { icon: "🎨", title: "核心技法", desc: "油画棒宽头画弧线" },
    { icon: "🏗️", title: "结构表现", desc: "强调弧形结构" },
    { icon: "📖", title: "联想拓展", desc: "像桥、像滑梯..." },
  ];

  const startX = 5.4;
  const startY = 0.9;
  const cardH = 0.75;
  const gap = 0.12;

  points.forEach((p, i) => {
    const y = startY + i * (cardH + gap);

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: startX, y: y, w: 4.3, h: cardH,
      fill: { color: theme.light },
      rectRadius: 0.1,
    });

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: startX + 0.1, y: y + 0.12, w: 0.5, h: 0.5,
      fill: { color: theme.accent },
    });
    slide.addText(p.icon, {
      x: startX + 0.1, y: y + 0.12, w: 0.5, h: 0.5,
      fontSize: 18, align: "center", valign: "middle",
    });

    // Title
    slide.addText(p.title, {
      x: startX + 0.7, y: y + 0.08, w: 3.4, h: 0.32,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, valign: "middle",
    });

    // Desc
    slide.addText(p.desc, {
      x: startX + 0.7, y: y + 0.4, w: 3.4, h: 0.3,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, valign: "top",
    });
  });

  // Story expression box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 4.15, w: 4.3, h: 0.65,
    fill: { color: theme.accent, transparency: 25 },
    rectRadius: 0.1,
    line: { color: theme.accent, width: 1.5 },
  });
  slide.addText("画面 + 故事 = 完整表达", {
    x: 5.4, y: 4.15, w: 4.3, h: 0.65,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Bottom tagline
  slide.addText("核心：造型能力 + 叙事能力", {
    x: 0.4, y: 4.9, w: 4.8, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.secondary, italic: true,
  });

  // Page number
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
  });
  slide.addText("03", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
