// Draw sun using pre-generated skin image
function drawSun(ctx, centerX, centerY, canvasRadius, skinId, breathScale) {
  const sunImg = AssetLoader.get('sun_' + skinId);
  if (!sunImg) return;

  const sunRadius = canvasRadius * SUN_CONFIG.radiusRatio;
  const drawSize = (sunRadius + canvasRadius * SUN_CONFIG.rayLengthRatio + 20) * 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(breathScale, breathScale);
  ctx.drawImage(sunImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  ctx.restore();
}

// Get sun body radius for a given canvas radius
function getSunRadius(canvasRadius) {
  return canvasRadius * SUN_CONFIG.radiusRatio;
}

// Draw a shape from cached asset image
function drawShape(ctx, shape, baseSize) {
  const assetKey = `shape_${shape.type}_${shape.color}`;
  const img = AssetLoader.get(assetKey);
  if (!img) return;

  const scale = shape.scale || 1;
  const size = baseSize * scale;

  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.angle || 0);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Draw a face part from cached asset
function drawFacePart(ctx, part, centerX, centerY, sunRadius) {
  const img = AssetLoader.get('face_' + part.partId);
  if (!img) return;

  const scale = part.scale || 1;
  // Face parts are positioned relative to sun center
  const size = sunRadius * 0.8 * scale;

  ctx.save();
  ctx.translate(centerX + part.offsetX, centerY + part.offsetY);
  ctx.rotate(part.angle || 0);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Mirror shape positions for symmetric mode
function getMirroredPositions(shape, centerX, centerY) {
  const dx = shape.x - centerX;
  const dy = shape.y - centerY;

  return [
    { x: centerX + dx, y: centerY + dy, angle: shape.angle || 0 },
    { x: centerX - dx, y: centerY + dy, angle: Math.PI - (shape.angle || 0) },
    { x: centerX + dx, y: centerY - dy, angle: -(shape.angle || 0) },
    { x: centerX - dx, y: centerY - dy, angle: Math.PI + (shape.angle || 0) }
  ];
}
