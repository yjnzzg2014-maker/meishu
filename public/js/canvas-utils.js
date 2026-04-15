// Draw sun using pre-generated skin image
function drawSun(ctx, centerX, centerY, canvasRadius, skinId, breathScale, mode) {
  const sunImg = AssetLoader.get('sun_' + skinId);
  if (!sunImg) return;

  const sunRadius = getSunRadius(canvasRadius, mode);
  const drawSize = (sunRadius + 25) * 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(breathScale, breathScale);
  ctx.drawImage(sunImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  ctx.restore();
}

// Get sun body radius for a given canvas radius (mode-aware)
function getSunRadius(canvasRadius, mode) {
  const ratio = (mode === 'personify')
    ? SUN_CONFIG.personifyRadiusRatio
    : SUN_CONFIG.radiusRatio;
  return canvasRadius * ratio;
}

// Draw a shape from cached asset image, with optional tint color
function drawShape(ctx, shape, baseSize) {
  const assetKey = `shape_${shape.type}`;
  const scale = shape.scale || 1;
  const size = baseSize * scale;

  // Get tinted or original image
  let img;
  if (shape.tintColor) {
    img = AssetLoader.getTinted(assetKey, shape.tintColor);
  } else {
    img = AssetLoader.get(assetKey);
  }
  if (!img) return;

  // Total angle = base angle pointing to center + user rotation offset
  const totalAngle = (shape.angle || 0) + (shape.rotationOffset || 0);

  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(totalAngle);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Draw a face part from cached asset
function drawFacePart(ctx, part, centerX, centerY, sunRadius) {
  const img = AssetLoader.get('face_' + part.partId);
  if (!img) return;

  const scale = part.scale || 1;
  const size = sunRadius * 0.8 * scale;

  ctx.save();
  ctx.translate(centerX + part.offsetX, centerY + part.offsetY);
  ctx.rotate(part.angle || 0);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// Mirror shape positions for symmetric mode (X-axis and Y-axis reflection)
// Returns: original, X-mirror, Y-mirror, XY-mirror
function getMirroredPositions(shape, centerX, centerY) {
  const x = shape.x;
  const y = shape.y;
  const angle = shape.angle || 0; // angle pointing toward center (bottom faces center)
  const rotationOffset = shape.rotationOffset || 0;

  // Total angle for each mirror
  const totalAngle = angle + rotationOffset;

  return [
    // Original position
    { x: x, y: y, angle: totalAngle, rotationOffset: rotationOffset },
    // X-axis mirror (left-right symmetry): flip horizontally
    // angle changes: PI - angle (horizontal flip preserves "pointing toward center")
    { x: 2 * centerX - x, y: y, angle: Math.PI - totalAngle, rotationOffset: rotationOffset },
    // Y-axis mirror (up-down symmetry): flip vertically
    // angle changes: -angle (vertical flip preserves "pointing toward center")
    { x: x, y: 2 * centerY - y, angle: -totalAngle, rotationOffset: rotationOffset },
    // XY mirror (both axes): center symmetry (180° rotation)
    // angle changes: PI + angle
    { x: 2 * centerX - x, y: 2 * centerY - y, angle: Math.PI + totalAngle, rotationOffset: rotationOffset }
  ];
}
