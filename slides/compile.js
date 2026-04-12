// compile.js - Compile all slides into final presentation
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const theme = {
  primary: "023047",    // deep blue - titles
  secondary: "219ebc",  // blue - body
  accent: "ffb703",     // yellow - highlights
  light: "8ecae6",      // light blue - cards
  bg: "caf0f8"          // pale blue - background
};

// Set presentation metadata
pres.author = 'Claude';
pres.title = '小学美术项目式学习 - 天空单元';
pres.subject = '一年级美术教学设计';

// Load and create all slides
for (let i = 1; i <= 5; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

// Write final presentation
pres.writeFile({ fileName: './output/presentation.pptx' })
  .then(() => {
    console.log('Presentation created successfully: ./output/presentation.pptx');
  })
  .catch(err => {
    console.error('Error creating presentation:', err);
  });
