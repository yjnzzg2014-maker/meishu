class GalleryAnimation {
  constructor(canvas, artworks) {
    this.canvas = canvas;
    this.artworks = artworks; // [{ studentId, fruitName, state }]
    this._raf = null;
    this._offscreens = [];
    this._stars = [];
    this._scrollX = 0;
    this._t = 0;
  }

  start() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._prepareOffscreens();
    this._generateStars();
    this._loop();
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _prepareOffscreens() {
    this._offscreens = this.artworks.map(art => {
      const size = Math.min(this.canvas.height * 0.45, 320);
      const oc = document.createElement('canvas');
      oc.width = size * 2;
      oc.height = size * 2;
      const ctx = oc.getContext('2d');
      const cx = size, cy = size, r = size;
      const srcR = art.state.canvasRadius || 400;
      const scale = r / srcR;
      ctx.fillStyle = '#fffbe6';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      drawSun(ctx, cx, cy, r, art.state.sunSkin || 'clay', 1, 'symmetric');
      (art.state.shapes || []).forEach(shape => {
        const dx = shape.x - srcR, dy = shape.y - srcR;
        const scaled = { ...shape, x: cx + dx * scale, y: cy + dy * scale, size: shape.size * scale };
        drawShape(ctx, scaled, scaled.size);
      });
      const sunR = getSunRadius(r, 'personify');
      (art.state.faceParts || []).forEach(part => {
        const sp = { ...part, offsetX: part.offsetX * scale, offsetY: part.offsetY * scale };
        drawFacePart(ctx, sp, cx, cy, sunR);
      });
      ctx.restore();
      return { canvas: oc, size, fruitName: art.fruitName };
    });
  }

  _generateStars() {
    this._stars = [];
    for (let i = 0; i < 120; i++) {
      this._stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7,
        r: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02
      });
    }
  }

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    this._t++;
    this._scrollX += 0.5;
    this._draw();
  }

  _draw() {
    const ctx = this.canvas.getContext('2d');
    const W = this.canvas.width, H = this.canvas.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0a2e');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars
    this._stars.forEach(s => {
      const opacity = 0.4 + 0.5 * Math.sin(s.phase + this._t * s.speed);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y * (H / (H * 0.7)), s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Far hills (dark, slow)
    this._drawHills(ctx, W, H, this._scrollX * 0.3, H * 0.82, '#0d1a2e', 0.18, 8);
    // Clouds
    this._drawClouds(ctx, W, H, this._scrollX * 0.6);
    // Near hills (lighter, faster)
    this._drawHills(ctx, W, H, this._scrollX * 0.9, H * 0.88, '#1a2a1a', 0.12, 6);

    // Hanging artworks
    if (this._offscreens.length === 0) return;
    const spacing = Math.max(280, W / Math.max(this._offscreens.length, 1));
    const totalW = spacing * this._offscreens.length;
    const loopX = this._scrollX % totalW;

    for (let i = 0; i < this._offscreens.length; i++) {
      const { canvas: oc, size, fruitName } = this._offscreens[i];
      let x = i * spacing - loopX + spacing / 2;
      // Loop back
      if (x < -size) x += totalW;
      if (x > W + size) x -= totalW;

      const stringLen = H * (0.1 + (i % 5) * 0.05);
      const artY = stringLen;

      // String
      ctx.save();
      ctx.strokeStyle = 'rgba(255,230,180,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, artY);
      ctx.stroke();
      ctx.restore();

      // Artwork circle (shadow)
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 20;
      ctx.drawImage(oc, x - size, artY, size * 2, size * 2);
      ctx.restore();

      // Fruit name label
      ctx.save();
      ctx.fillStyle = 'rgba(255,230,180,0.85)';
      ctx.font = `bold ${Math.round(size * 0.18)}px "PingFang SC", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(fruitName || '', x, artY + size * 2 + 8);
      ctx.restore();
    }
  }

  _drawHills(ctx, W, H, scrollX, baseY, color, heightRatio, count) {
    const hillW = W / count;
    const scrolled = scrollX % (hillW * 2);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let i = -2; i < count + 2; i++) {
      const cx = i * hillW * 2 - scrolled + hillW;
      ctx.bezierCurveTo(
        cx - hillW, baseY,
        cx - hillW * 0.5, baseY - H * heightRatio,
        cx, baseY - H * heightRatio
      );
      ctx.bezierCurveTo(
        cx + hillW * 0.5, baseY - H * heightRatio,
        cx + hillW, baseY,
        cx + hillW * 2, baseY
      );
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawClouds(ctx, W, H, scrollX) {
    const clouds = [
      { x: 0.1, y: 0.15, w: 0.18, h: 0.06 },
      { x: 0.35, y: 0.08, w: 0.22, h: 0.07 },
      { x: 0.65, y: 0.18, w: 0.15, h: 0.05 },
      { x: 0.85, y: 0.10, w: 0.20, h: 0.06 },
    ];
    const totalW = W;
    clouds.forEach(c => {
      const rawX = c.x * W - (scrollX % totalW);
      const x = rawX < -c.w * W ? rawX + totalW : rawX;
      const y = c.y * H;
      const w = c.w * W, h = c.h * H;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#fff';
      this._ellipseCloud(ctx, x, y, w, h);
      ctx.restore();
    });
  }

  _ellipseCloud(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(x - w * 0.25, y + h * 0.1, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.25, y + h * 0.1, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
