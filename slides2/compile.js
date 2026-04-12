// compile.js - Compile all slides into final presentation
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const theme = {
  primary: "023047",
  secondary: "219ebc",
  accent: "ffb703",
  light: "8ecae6",
  bg: "caf0f8"
};

pres.author = 'Claude';
pres.title = '小学美术项目式学习 - 天空单元（第二部分）';
pres.subject = '课程结构与教学设计';

for (let i = 1; i <= 5; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

pres.writeFile({ fileName: './output/presentation.pptx' })
  .then(() => console.log('Presentation created: ./output/presentation.pptx'))
  .catch(err => console.error('Error:', err));
