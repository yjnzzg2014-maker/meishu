// slide-02.js - 云朵的联想
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 2,
  title: '从形状到想象：《云朵的联想》'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText("从形状到想象：《云朵的联想》", {
    x: 0.5, y: 0.25, w: 6, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true
  });

  // Process flow - 3 steps with arrows
  const steps = [
    { num: "1", icon: "☁️", title: "随机生成", desc: "海绵拍印\n随机云朵形状" },
    { num: "2", icon: "💭", title: "联想转化", desc: "这朵云像什么？\n从形状到意义" },
    { num: "3", icon: "🐰", title: "具体形象", desc: "动物、物体\n记号笔添画" },
  ];

  const stepW = 2.6;
  const stepH = 2.0;
  const startX = 0.5;
  const startY = 1.0;
  const gap = 0.5;

  steps.forEach((step, i) => {
    const x = startX + i * (stepW + gap);

    // Step card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: startY, w: stepW, h: stepH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.15,
      line: { color: theme.light, width: 1 },
    });

    // Number badge
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.1, y: startY + 0.1, w: 0.4, h: 0.4,
      fill: { color: theme.accent },
    });
    slide.addText(step.num, {
      x: x + 0.1, y: startY + 0.1, w: 0.4, h: 0.4,
      fontSize: 14, fontFace: "Arial",
      color: theme.primary, bold: true,
      align: "center", valign: "middle",
    });

    // Icon
    slide.addText(step.icon, {
      x: x, y: startY + 0.55, w: stepW, h: 0.6,
      fontSize: 32, align: "center", valign: "middle",
    });

    // Title
    slide.addText(step.title, {
      x: x + 0.1, y: startY + 1.2, w: stepW - 0.2, h: 0.35,
      fontSize: 14, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center",
    });

    // Desc
    slide.addText(step.desc, {
      x: x + 0.1, y: startY + 1.5, w: stepW - 0.2, h: 0.5,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center",
    });

    // Arrow between steps
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RIGHT_ARROW, {
        x: x + stepW + 0.08, y: startY + stepH / 2 - 0.15,
        w: gap - 0.16, h: 0.3,
        fill: { color: theme.accent },
      });
    }
  });

  // Core ability box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 3.2, w: 8.7, h: 0.7,
    fill: { color: theme.accent, transparency: 25 },
    rectRadius: 0.12,
    line: { color: theme.accent, width: 1.5 },
  });
  slide.addText("核心能力：从'看见形状'到'生成意义'", {
    x: 0.5, y: 3.2, w: 8.7, h: 0.7,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Image on right
  slide.addImage({
    x: 6.8, y: 4.0, w: 2.9, h: 1.5,
    path: "./imgs/slide2-cloud-imagination.jpg",
    rounded: 0.1,
  });

  // Keywords at bottom
  const keywords = ["联想", "生成", "转化"];
  keywords.forEach((kw, i) => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5 + i * 1.3, y: 4.05, w: 1.1, h: 0.35,
      fill: { color: theme.secondary },
      rectRadius: 0.15,
    });
    slide.addText(kw, {
      x: 0.5 + i * 1.3, y: 4.05, w: 1.1, h: 0.35,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle",
    });
  });

  // Page number
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

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "023047", secondary: "219ebc", accent: "ffb703", light: "8ecae6", bg: "caf0f8" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
