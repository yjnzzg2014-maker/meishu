// slide-02.js - 贴近生活经验 (with image)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 2,
  title: '从生活出发：孩子眼中的天空'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText(slideConfig.title, {
    x: 0.5, y: 0.3, w: 5, h: 0.7,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Content rows - left side
  const rows = [
    { icon: "☀️", title: "直接的生活经验", desc: "一年级学生对天空具有直接的生活经验" },
    { icon: "🌈", title: "熟悉的内容", desc: "太阳、云朵、彩虹、星空" },
    { icon: "💬", title: "有话可说", desc: "每个孩子都'见过、说得出、有感受'" },
    { icon: "🎯", title: "降低门槛", desc: "教学从熟悉经验出发，激发表达欲望" },
  ];

  const startY = 1.2;
  const rowHeight = 0.85;
  const rowGap = 0.12;

  rows.forEach((row, index) => {
    const y = startY + index * (rowHeight + rowGap);

    // Card background
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.4, y: y, w: 5.2, h: rowHeight,
      fill: { color: theme.light },
      rectRadius: 0.15,
    });

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.55, y: y + 0.12, w: 0.55, h: 0.55,
      fill: { color: theme.accent },
    });

    slide.addText(row.icon, {
      x: 0.55, y: y + 0.12, w: 0.55, h: 0.55,
      fontSize: 20, align: "center", valign: "middle",
    });

    // Title
    slide.addText(row.title, {
      x: 1.25, y: y + 0.08, w: 4.2, h: 0.35,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, valign: "middle",
    });

    // Description
    slide.addText(row.desc, {
      x: 1.25, y: y + 0.43, w: 4.2, h: 0.35,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.secondary, valign: "top",
    });
  });

  // Image on right side - children looking at sky
  slide.addImage({
    x: 5.8, y: 0.8, w: 3.9, h: 4.2,
    path: "./imgs/slide2-children-sky.jpg",
    rounded: 0.15,
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
  });

  slide.addText("02", {
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
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
