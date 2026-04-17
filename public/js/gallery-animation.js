class GalleryAnimation {
  constructor(canvas, artworks) {
    this.canvas = canvas;
    this.artworks = artworks; // [{ studentId, fruitName, state }]
    this._raf = null;
    this._offscreens = [];
    this._stars = [];
    this._scrollX = 0;
    this._t = 0;
    this._ctx = null;         // cached 2d context
    this._bgGrad = null;      // cached background gradient
  }

  start() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._ctx = this.canvas.getContext('2d');
    this._bgGrad = this._buildBgGrad();
    this._prepareOffscreens();
    this._generateStars();
    this._loop();
  }

  _buildBgGrad() {
    const grad = this._ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, '#0a0a2e');
    grad.addColorStop(1, '#000');
    return grad;
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _prepareOffscreens() {
    this._offscreens = [];
    const size = Math.min(this.canvas.width / 5 * 0.55, 100);
    console.log('[Gallery] artworks received:', this.artworks.length, 'size:', size, 'AssetLoader.ready:', AssetLoader.ready);
    for (const art of this.artworks) {
      console.log('[Gallery] art.state:', art.state, 'fruitName:', art.fruitName);
      if (!art.state) { console.warn('[Gallery] skipping art: no state'); continue; }
      try {
        const oc = document.createElement('canvas');
        oc.width = size * 2;
        oc.height = size * 2;
        const ctx = oc.getContext('2d');
        if (!ctx) continue;
        const cx = size, cy = size, r = size;
        const srcR = art.state.canvasRadius || 400;
        const scale = r / srcR;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        const sunImg = AssetLoader.get('sun_' + (art.state.sunSkin || 'clay'));
        console.log('[Gallery] sunImg for', art.state.sunSkin, ':', sunImg);
        if (!sunImg) {
          // Fallback: plain colored circle so we can see the sun is being positioned correctly
          ctx.fillStyle = '#ffcc00';
          ctx.fill();
        }
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
        this._offscreens.push({
          canvas: oc,
          size,
          fruitName: art.fruitName,
          rotationSpeed: (0.001 + Math.random() * 0.003) * (Math.random() < 0.5 ? 1 : -1),
          rotation: Math.random() * Math.PI * 2,
          hangY: this.canvas.height * (0.05 + Math.random() * 0.22),
        });
      } catch (e) {
        console.warn('[Gallery] offscreen render failed:', e);
      }
    }
    console.log('[Gallery] _offscreens prepared:', this._offscreens.length);
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
    this._offscreens.forEach(item => { item.rotation += item.rotationSpeed; });
    this._draw();
  }

  _draw() {
    const ctx = this._ctx;
    const W = this.canvas.width, H = this.canvas.height;

    // Background (use cached gradient)
    ctx.fillStyle = this._bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Stars — batched by opacity group to minimise save/restore overhead
    const yScale = H / (H * 0.7);
    ctx.fillStyle = '#fff';
    this._stars.forEach(s => {
      ctx.globalAlpha = 0.4 + 0.5 * Math.sin(s.phase + this._t * s.speed);
      ctx.beginPath();
      ctx.arc(s.x, s.y * yScale, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Far hills (dark, slow)
    this._drawHills(ctx, W, H, this._scrollX * 0.3, H * 0.82, '#0d1a2e', 0.18, 8);
    // Clouds
    this._drawClouds(ctx, W, H, this._scrollX * 0.6);
    // Near hills (lighter, faster)
    this._drawHills(ctx, W, H, this._scrollX * 0.9, H * 0.88, '#1a2a1a', 0.12, 6);

    // Hanging artworks
    if (this._offscreens.length === 0) return;
    const count = this._offscreens.length;
    const spacing = count >= 5 ? W / count : W / Math.max(count, 1);
    const totalW = spacing * count;
    const loopX = this._scrollX % totalW;

    // Compute positions
    const positions = this._offscreens.map((item, i) => {
      let x = i * spacing - loopX + spacing / 2;
      if (x < -item.size * 2) x += totalW;
      if (x > W + item.size * 2) x -= totalW;
      return { ...item, x };
    });

    // Draw all strings first
    ctx.strokeStyle = 'rgba(255,230,180,0.6)';
    ctx.lineWidth = 2;
    positions.forEach(({ x, hangY }) => {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, hangY);
      ctx.stroke();
    });

    // Draw artworks with rotation around circle center
    positions.forEach(({ canvas: oc, size, x, hangY, rotation }) => {
      const cx = x;
      const cy = hangY + size;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 20;
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.drawImage(oc, -size, -size, size * 2, size * 2);
      ctx.restore();
    });

    // Draw labels below the circle
    ctx.fillStyle = 'rgba(255,230,180,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    positions.forEach(({ size, fruitName, x, hangY }) => {
      ctx.font = `bold ${Math.round(size * 0.22)}px "PingFang SC", Arial, sans-serif`;
      ctx.fillText(fruitName || '', x, hangY + size * 2 + 10);
    });
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
