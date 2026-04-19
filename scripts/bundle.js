/**
 * Bundle JS files for student and teacher pages.
 * Output: public/js/bundle-student.js, public/js/bundle-teacher.js
 */

const fs = require('fs');
const path = require('path');

const JS_DIR = path.join(__dirname, '..', 'public', 'js');

const STUDENT_FILES = [
  'constants.js',
  'asset-loader.js',
  'canvas-utils.js',
  'face-mode.js',
  'socket-client.js',
  'gallery-animation.js',
  'student.js',
];

const TEACHER_FILES = [
  'constants.js',
  'asset-loader.js',
  'canvas-utils.js',
  'draw-tool.js',
  'socket-client.js',
  'teacher.js',
];

function bundle(files, outputName) {
  const parts = files.map(f => {
    const content = fs.readFileSync(path.join(JS_DIR, f), 'utf8');
    return `/* === ${f} === */\n${content}`;
  });
  const out = parts.join('\n\n');
  const outPath = path.join(JS_DIR, outputName);
  fs.writeFileSync(outPath, out);
  const kb = (out.length / 1024).toFixed(1);
  console.log(`✓ ${outputName} (${kb} KB, ${files.length} files)`);
}

console.log('\n📦 Bundling JS files...\n');
bundle(STUDENT_FILES, 'bundle-student.js');
bundle(TEACHER_FILES, 'bundle-teacher.js');
console.log('\n✅ Done\n');
