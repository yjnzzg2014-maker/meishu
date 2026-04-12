// slide-05.js - 单元总结
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'summary',
  index: 5,
  title: '从单一到综合：单元学习路径'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();

  // Background
  slide.background = { color: theme.bg };

  // Title
  slide.addText("从单一到综合：单元学习路径", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "center"
  });

  // Main flow - 4 lessons
  const lessons = [
    { icon: "☀️", title: "我的太阳", sub: "立体造型", skill: "表现力", color: theme.accent },
    { icon: "☁️", title: "云朵联想", sub: "联想训练", skill: "联想力", color: theme.secondary },
    { icon: "🌈", title: "彩虹故事", sub: "造型叙事", skill: "叙事力", color: theme.light },
    { icon: "⭐", title: "上天摘星", sub: "整合综合", skill: "建构力", color: theme.primary },
  ];

  const lessonW = 2.1;
  const lessonH = 1.6;
  const startX = 0.55;
  const lessonY = 1.0;
  const gap = 0.3;

  lessons.forEach((l, i) => {
    const x = startX + i * (lessonW + gap);

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: lessonY, w: lessonW, h: lessonH,
      fill: { color: "FFFFFF" },
      rectRadius: 0.15,
      line: { color: l.color, width: 2 },
    });

    // Top color bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: lessonY, w: lessonW, h: 0.5,
      fill: { color: l.color },
    });

    // Icon
    slide.addText(l.icon, {
      x: x, y: lessonY + 0.55, w: lessonW, h: 0.5,
      fontSize: 28, align: "center", valign: "middle",
    });

    // Title
    slide.addText(l.title, {
      x: x + 0.1, y: lessonY + 1.05, w: lessonW - 0.2, h: 0.28,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center",
    });

    // Subtitle
    slide.addText(l.sub, {
      x: x + 0.1, y: lessonY + 1.28, w: lessonW - 0.2, h: 0.25,
      fontSize: 9, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center",
    });

    // Arrow between cards
    if (i < lessons.length - 1) {
      slide.addShape(pres.shapes.RIGHT_ARROW, {
        x: x + lessonW + 0.02, y: lessonY + lessonH / 2 - 0.12,
        w: gap - 0.04, h: 0.24,
        fill: { color: theme.accent },
      });
    }
  });

  // Ability development row
  const abilities = ["表现力", "→", "联想力", "→", "叙事力", "→", "建构力"];
  const abY = 2.8;

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: abY, w: 9, h: 0.5,
    fill: { color: theme.light, transparency: 50 },
    rectRadius: 0.1,
  });

  abilities.forEach((ab, i) => {
    const isArrow = ab === "→";
    const xPos = 0.7 + i * 1.15;
    if (isArrow) {
      slide.addText(ab, {
        x: xPos, y: abY, w: 0.5, h: 0.5,
        fontSize: 14, fontFace: "Arial",
        color: theme.accent, bold: true,
        align: "center", valign: "middle",
      });
    } else {
      slide.addText(ab, {
        x: xPos, y: abY, w: 0.9, h: 0.5,
        fontSize: 12, fontFace: "Microsoft YaHei",
        color: theme.primary, bold: true,
        align: "center", valign: "middle",
      });
    }
  });

  // Learning mode
  slide.addText("学习方式", {
    x: 0.5, y: 3.5, w: 1.5, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
  });

  const modes = [
    { text: "分步训练", sub: "单一技法" },
    { text: "→", sub: "" },
    { text: "整合创作", sub: "综合应用" },
  ];

  modes.forEach((m, i) => {
    const x = 2.0 + i * 2.0;
    if (m.text === "→") {
      slide.addText(m.text, {
        x: x, y: 3.5, w: 0.5, h: 0.4,
        fontSize: 16, fontFace: "Arial",
        color: theme.accent, bold: true,
        align: "center", valign: "middle",
      });
    } else {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: x, y: 3.5, w: 1.5, h: 0.7,
        fill: { color: theme.secondary },
        rectRadius: 0.1,
      });
      slide.addText(m.text, {
        x: x, y: 3.5, w: 1.5, h: 0.45,
        fontSize: 11, fontFace: "Microsoft YaHei",
        color: "FFFFFF", bold: true,
        align: "center", valign: "middle",
      });
      slide.addText(m.sub, {
        x: x, y: 3.9, w: 1.5, h: 0.28,
        fontSize: 8, fontFace: "Microsoft YaHei",
        color: "FFFFFF",
        align: "center", valign: "top",
      });
    }
  });

  // Image
  slide.addImage({
    x: 6.5, y: 3.4, w: 3.2, h: 1.7,
    path: "./imgs/slide5-summary-flow.jpg",
    rounded: 0.1,
  });

  // Core message
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.4, w: 5.8, h: 0.65,
    fill: { color: theme.accent, transparency: 25 },
    rectRadius: 0.12,
    line: { color: theme.accent, width: 1.5 },
  });
  slide.addText("核心特征：递进性 + 系统性", {
    x: 0.5, y: 4.4, w: 5.8, h: 0.65,
    fontSize: 15, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
  });

  // Page number
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

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "023047", secondary: "219ebc", accent: "ffb703", light: "8ecae6", bg: "caf0f8" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
