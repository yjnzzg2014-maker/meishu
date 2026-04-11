// Draw sun with breathing glow effect
function drawSun(ctx, centerX, centerY, config, glowIntensity) {
  const { radius, rayCount, rayLength } = config;

  ctx.save();

  // Outer glow
  const glowRadius = radius + rayLength + 20;
  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, glowRadius);
  gradient.addColorStop(0, `rgba(255, 200, 50, ${0.6 * glowIntensity})`);
  gradient.addColorStop(0.5, `rgba(255, 165, 0, ${0.3 * glowIntensity})`);
  gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.fillStyle = '#FFCC00';
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 2 * Math.PI / rayCount) - Math.PI / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-8, -radius - 5);
    ctx.lineTo(8, -radius - 5);
    ctx.lineTo(4, -radius - rayLength);
    ctx.lineTo(-4, -radius - rayLength);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Sun body
  const bodyGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
  bodyGradient.addColorStop(0, '#FFEB3B');
  bodyGradient.addColorStop(0.7, '#FFD700');
  bodyGradient.addColorStop(1, '#FFA500');

  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Face (simple cute face)
  ctx.fillStyle = '#E8A000';
  // Eyes
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 8, 6, 0, Math.PI * 2);
  ctx.arc(centerX + 18, centerY - 8, 6, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(centerX, centerY + 5, 15, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.strokeStyle = '#E8A000';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

// Draw a shape at given position
function drawShape(ctx, shape, size) {
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.angle || 0);

  const fillColor = COLORS.shapes[shape.color] || COLORS.shapes.pink;

  switch (shape.type) {
    case 'circle':
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'triangle':
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'square':
      ctx.fillStyle = fillColor;
      const half = size / 2 * 0.85;
      roundRect(ctx, -half, -half, half * 2, half * 2, 8);
      ctx.fill();
      break;

    case 'rectangle':
      ctx.fillStyle = fillColor;
      roundRect(ctx, -size / 2, -size / 3, size, size * 0.65, 8);
      ctx.fill();
      break;

    case 'flower':
      drawFlower(ctx, size / 2, fillColor);
      break;

    case 'leaf':
      drawLeaf(ctx, size, fillColor);
      break;

    case 'star':
      drawStar(ctx, size / 2, fillColor);
      break;

    case 'cloud':
      drawCloud(ctx, size, fillColor);
      break;

    case 'bird':
      drawBird(ctx, size, fillColor);
      break;
  }

  ctx.restore();
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: flower
function drawFlower(ctx, size, color) {
  const petalSize = size * 0.35;
  const petalCount = 6;
  ctx.fillStyle = color;
  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.rotate(i * Math.PI / 3);
    ctx.beginPath();
    ctx.ellipse(0, -petalSize, petalSize * 0.6, petalSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: leaf
function drawLeaf(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.4);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.2, size * 0.4, size * 0.3);
  ctx.quadraticCurveTo(0, size * 0.5, -size * 0.4, size * 0.3);
  ctx.quadraticCurveTo(-size * 0.5, -size * 0.2, 0, -size * 0.4);
  ctx.fill();
  ctx.strokeStyle = '#5BA55B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.lineTo(0, size * 0.35);
  ctx.stroke();
}

// Helper: star
function drawStar(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
    const x = Math.cos(angle) * size;
    const y = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// Helper: cloud
function drawCloud(ctx, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-size * 0.2, 0, size * 0.3, 0, Math.PI * 2);
  ctx.arc(size * 0.15, -size * 0.1, size * 0.35, 0, Math.PI * 2);
  ctx.arc(size * 0.4, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: bird
function drawBird(ctx, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, 0);
  ctx.quadraticCurveTo(-size * 0.1, -size * 0.3, size * 0.2, 0);
  ctx.quadraticCurveTo(-size * 0.1, size * 0.3, -size * 0.4, 0);
  ctx.stroke();
}

// Mirror shape positions for axisymmetric mode
function getMirroredPositions(shape, centerX, centerY, canvasRadius) {
  const dx = shape.x - centerX;
  const dy = shape.y - centerY;

  return [
    { x: centerX + dx, y: centerY + dy, angle: shape.angle },                          // Original
    { x: centerX - dx, y: centerY + dy, angle: Math.PI - shape.angle },               // Horizontal mirror
    { x: centerX + dx, y: centerY - dy, angle: -shape.angle },                        // Vertical mirror
    { x: centerX - dx, y: centerY - dy, angle: Math.PI + shape.angle }                 // Both mirrors
  ];
}
