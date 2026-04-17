class TeacherApp {
  constructor() {
    this.client = new SocketClient();
    this.students = new Map();
    this.mode = 'symmetric';
    this.locked = false;
    this.breathPhase = 0;
    this.animationId = null;
    this.zoomedStudentId = null;
    this.selectedStudentId = null;
    this.sunAnimation = null;

    // Drawing tool
    this.drawTool = null;

    // Face import state
    this.faceImportData = null;

    // Shape import state
    this.shapeImportData = null;

    // Gallery selection state
    this.gallerySelectMode = false;
    this.gallerySelectedIds = new Set();

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable animation if user prefers reduced motion
    if (this.prefersReducedMotion) {
      this.breathPhase = Math.PI; // Use middle point for breathing
    }

    this.init();
  }

  async init() {
    await AssetLoader.loadAll();
    document.getElementById('loader')?.remove();

    this.setupControls();
    this.setupAssetManagement();
    this.connectSocket();
    this.startAnimation();
    this.renderCustomAssets();
    this.initStudentCardObserver();
  }

  setupControls() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.setMode(mode);
      });
    });

    // Lock button
    const lockBtn = document.getElementById('btn-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        this.locked = !this.locked;
        this.client.toggleLock(this.locked);
        lockBtn.classList.toggle('active', this.locked);
        lockBtn.textContent = this.locked ? '已锁定' : '锁定操作';
      });
    }

    // Close zoom button
    const closeZoom = document.getElementById('close-zoom');
    if (closeZoom) {
      closeZoom.addEventListener('click', () => this.closeZoom());
    }

    // Clear all students
    document.getElementById('btn-clear-all')?.addEventListener('click', () => {
      if (!confirm('确定清除所有学生？学生端将断开连接、清空画板并重新加入。')) return;
      this.client.clearAllStudents();
    });

    // Showcase controls
    const showcaseBtn = document.getElementById('btn-showcase');
    const stopShowcaseBtn = document.getElementById('btn-stop-showcase');
    const showcaseDialog = document.getElementById('showcase-dialog');

    if (showcaseBtn) {
      showcaseBtn.addEventListener('click', () => {
        if (this.selectedStudentId) {
          showcaseDialog?.classList.add('visible');
        }
      });
    }
    document.getElementById('showcase-dialog-close')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
    });
    document.getElementById('btn-showcase-frozen')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
      if (this.selectedStudentId) this.client.startShowcase(this.selectedStudentId, true);
    });
    document.getElementById('btn-showcase-live')?.addEventListener('click', () => {
      showcaseDialog?.classList.remove('visible');
      if (this.selectedStudentId) this.client.startShowcase(this.selectedStudentId, false);
    });
    if (stopShowcaseBtn) {
      stopShowcaseBtn.addEventListener('click', () => this.client.stopShowcase());
    }

    // Gallery controls
    const gallerySelectBtn = document.getElementById('btn-gallery-select');
    const startGalleryBtn = document.getElementById('btn-start-gallery');
    const stopGalleryBtn = document.getElementById('btn-stop-gallery');

    if (gallerySelectBtn) {
      gallerySelectBtn.addEventListener('click', () => {
        this.gallerySelectMode = !this.gallerySelectMode;
        gallerySelectBtn.classList.toggle('active', this.gallerySelectMode);
        if (!this.gallerySelectMode) {
          this.gallerySelectedIds.clear();
          document.querySelectorAll('.student-card.gallery-selected').forEach(c => c.classList.remove('gallery-selected'));
          if (startGalleryBtn) startGalleryBtn.hidden = true;
        }
      });
    }
    if (startGalleryBtn) {
      startGalleryBtn.addEventListener('click', () => {
        const ids = [...this.gallerySelectedIds];
        if (ids.length > 0) this.client.startGallery(ids);
      });
    }
    if (stopGalleryBtn) {
      stopGalleryBtn.addEventListener('click', () => this.client.stopGallery());
    }
  }

  setupAssetManagement() {
    // --- Drawing Tool ---
    this.drawTool = new DrawTool(async (data) => {
      try {
        const res = await fetch('/api/shapes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to save shape:', e);
      }
    });

    const drawBtn = document.getElementById('btn-draw-shape');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => this.drawTool.show());
    }

    // --- Face Import ---
    const importBtn = document.getElementById('btn-import-face');
    const fileInput = document.getElementById('face-file-input');
    const faceModal = document.getElementById('face-import-modal');

    if (importBtn) {
      importBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.faceImportData = ev.target.result;
          // Show preview
          const previewArea = document.getElementById('face-preview-area');
          if (previewArea) {
            previewArea.innerHTML = '';
            const img = document.createElement('img');
            img.src = this.faceImportData;
            img.style.maxWidth = '120px';
            img.style.maxHeight = '120px';
            previewArea.appendChild(img);
          }
          // Show modal
          if (faceModal) faceModal.classList.add('visible');
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
      });
    }

    // Face modal controls
    document.getElementById('face-modal-close')?.addEventListener('click', () => {
      faceModal?.classList.remove('visible');
    });
    document.getElementById('face-modal-cancel')?.addEventListener('click', () => {
      faceModal?.classList.remove('visible');
    });

    // Face category buttons
    document.querySelectorAll('.face-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.face-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Face save
    document.getElementById('face-modal-save')?.addEventListener('click', async () => {
      const name = document.getElementById('face-import-name')?.value.trim();
      if (!name) { alert('请输入五官名称'); return; }
      if (!this.faceImportData) { alert('请选择图片'); return; }

      const activeCat = document.querySelector('.face-cat-btn.active');
      const category = activeCat ? activeCat.dataset.cat : 'eyes';

      try {
        const res = await fetch('/api/faces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, imageData: this.faceImportData })
        });
        if (res.ok) {
          faceModal?.classList.remove('visible');
          document.getElementById('face-import-name').value = '';
          this.faceImportData = null;
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to import face:', e);
      }
    });

    // --- Shape Import ---
    const shapeImportBtn = document.getElementById('btn-import-shape');
    const shapeFileInput = document.getElementById('shape-file-input');
    const shapeModal = document.getElementById('shape-import-modal');

    if (shapeImportBtn) {
      shapeImportBtn.addEventListener('click', () => shapeFileInput.click());
    }

    if (shapeFileInput) {
      shapeFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.shapeImportData = ev.target.result;
          const previewArea = document.getElementById('shape-preview-area');
          if (previewArea) {
            previewArea.innerHTML = '';
            const img = document.createElement('img');
            img.src = this.shapeImportData;
            img.style.maxWidth = '120px';
            img.style.maxHeight = '120px';
            previewArea.appendChild(img);
          }
          if (shapeModal) shapeModal.classList.add('visible');
        };
        reader.readAsDataURL(file);
        shapeFileInput.value = '';
      });
    }

    // Shape modal controls
    document.getElementById('shape-modal-close')?.addEventListener('click', () => {
      shapeModal?.classList.remove('visible');
    });
    document.getElementById('shape-modal-cancel')?.addEventListener('click', () => {
      shapeModal?.classList.remove('visible');
    });

    // Shape category buttons
    document.querySelectorAll('.shape-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shape-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Shape save
    document.getElementById('shape-modal-save')?.addEventListener('click', async () => {
      const name = document.getElementById('shape-import-name')?.value.trim();
      if (!name) { alert('请输入素材名称'); return; }
      if (!this.shapeImportData) { alert('请选择图片'); return; }

      const activeCat = document.querySelector('.shape-cat-btn.active');
      const category = activeCat ? activeCat.dataset.cat : 'dots';

      try {
        const res = await fetch('/api/shapes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, imageData: this.shapeImportData })
        });
        if (res.ok) {
          shapeModal?.classList.remove('visible');
          document.getElementById('shape-import-name').value = '';
          this.shapeImportData = null;
          await AssetLoader.reloadCustomAssets();
          this.renderCustomAssets();
        }
      } catch (e) {
        console.error('Failed to import shape:', e);
      }
    });
  }

  renderCustomAssets() {
    // Render custom shapes
    const shapesGrid = document.getElementById('custom-shapes-grid');
    const noShapes = document.getElementById('no-custom-shapes');
    if (shapesGrid) {
      shapesGrid.innerHTML = '';
      const customShapes = SHAPES.filter(s => s.custom);
      if (noShapes) noShapes.style.display = customShapes.length ? 'none' : 'block';

      customShapes.forEach(shape => {
        const card = document.createElement('div');
        card.className = 'asset-card';

        const img = AssetLoader.get(`shape_${shape.id}`);
        if (img) {
          const preview = document.createElement('canvas');
          preview.width = 60;
          preview.height = 60;
          const pctx = preview.getContext('2d');
          pctx.drawImage(img, 5, 5, 50, 50);
          card.appendChild(preview);
        }

        const info = document.createElement('div');
        info.className = 'asset-info';
        info.innerHTML = `<span class="asset-name">${shape.name}</span><span class="asset-cat">${shape.category === 'dots' ? '点' : '线'}</span>`;
        card.appendChild(info);

        const delBtn = document.createElement('button');
        delBtn.className = 'asset-del-btn';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', async () => {
          if (!confirm(`确定删除素材"${shape.name}"？`)) return;
          try {
            await fetch(`/api/shapes/${shape.id}`, { method: 'DELETE' });
            await AssetLoader.reloadCustomAssets();
            this.renderCustomAssets();
          } catch (e) { console.error(e); }
        });
        card.appendChild(delBtn);

        shapesGrid.appendChild(card);
      });
    }

    // Render custom faces
    const facesGrid = document.getElementById('custom-faces-grid');
    const noFaces = document.getElementById('no-custom-faces');
    if (facesGrid) {
      facesGrid.innerHTML = '';
      const catNames = { eyes: '眼睛', noses: '鼻子', mouths: '嘴巴', extras: '其他' };
      let customFaceCount = 0;

      for (const catId of Object.keys(FACE_PARTS)) {
        FACE_PARTS[catId].filter(f => f.custom).forEach(face => {
          customFaceCount++;
          const card = document.createElement('div');
          card.className = 'asset-card';

          const img = AssetLoader.get(`face_${face.id}`);
          if (img) {
            const preview = document.createElement('canvas');
            preview.width = 60;
            preview.height = 60;
            const pctx = preview.getContext('2d');
            pctx.drawImage(img, 5, 5, 50, 50);
            card.appendChild(preview);
          }

          const info = document.createElement('div');
          info.className = 'asset-info';
          info.innerHTML = `<span class="asset-name">${face.name}</span><span class="asset-cat">${catNames[catId] || catId}</span>`;
          card.appendChild(info);

          const delBtn = document.createElement('button');
          delBtn.className = 'asset-del-btn';
          delBtn.textContent = '删除';
          delBtn.addEventListener('click', async () => {
            if (!confirm(`确定删除五官"${face.name}"？`)) return;
            try {
              await fetch(`/api/faces/${face.id}`, { method: 'DELETE' });
              await AssetLoader.reloadCustomAssets();
              this.renderCustomAssets();
            } catch (e) { console.error(e); }
          });
          card.appendChild(delBtn);

          facesGrid.appendChild(card);
        });
      }

      if (noFaces) noFaces.style.display = customFaceCount ? 'none' : 'block';
    }
  }

  initStudentCardObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const studentId = entry.target.dataset.studentId;
          this.renderStudentCanvas(studentId);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.student-card').forEach(card => {
      observer.observe(card);
    });
  }

  setMode(mode) {
    this.mode = mode;
    this.client.changeMode(mode);
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  connectSocket() {
    this.client.connect();
    this.client.registerTeacher();

    this.client.on('teacher_init', (data) => {
      this.mode = data.mode;
      this.locked = data.locked;

      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === this.mode);
      });

      const lockBtn = document.getElementById('btn-lock');
      if (lockBtn) {
        lockBtn.classList.toggle('active', this.locked);
        lockBtn.textContent = this.locked ? '已锁定' : '锁定操作';
      }

      if (data.students) {
        data.students.forEach(s => {
          this.addStudentEntry(s.id || s.socketId, s);
        });
      }
      this.updateStudentCount();
    });

    this.client.on('student_joined', (data) => {
      // If this is a reconnect (student came back), find by sessionId and update
      if (data.isReconnect && data.sessionId) {
        // Find existing student by sessionId
        let existingEntry = null;
        let existingId = null;
        this.students.forEach((entry, id) => {
          if (entry.sessionId === data.sessionId) {
            existingEntry = entry;
            existingId = id;
          }
        });
        if (existingEntry && existingId !== data.id) {
          // Remove old entry and re-add with new id
          this.students.delete(existingId);
          existingEntry.disconnected = false;
          existingEntry.name = data.name;
          existingEntry.sunSkin = data.sunSkin;
          if (data.fruitName) existingEntry.fruitName = data.fruitName;
          this.students.set(data.id, existingEntry);
          // Update the card's studentId
          if (existingEntry.card) {
            existingEntry.card.dataset.studentId = data.id;
          }
          this.updateStudentCard(data.id);
          console.log(`Teacher: Student reconnected, updated entry from ${existingId} to ${data.id}`);
          this.updateStudentCount();
          return;
        }
      }

      // If student already exists (reconnect), just mark as online
      const existing = this.students.get(data.id);
      if (existing) {
        existing.disconnected = false;
        existing.name = data.name;
        existing.sunSkin = data.sunSkin;
        if (data.fruitName) existing.fruitName = data.fruitName;
        this.updateStudentCard(data.id);
      } else {
        this.addStudentEntry(data.id, { shapes: [], faceParts: [], sunSkin: data.sunSkin, name: data.name, disconnected: false, sessionId: data.sessionId, fruitName: data.fruitName || null });
      }
      this.updateStudentCount();
    });

    this.client.on('student_left', (data) => {
      // Try to find by socket.id first, then by sessionId
      let idToRemove = data.id;
      if (data.sessionId) {
        this.students.forEach((entry, id) => {
          if (entry.sessionId === data.sessionId) {
            idToRemove = id;
          }
        });
      }
      this.removeStudentEntry(idToRemove);
      this.updateStudentCount();
      if (this.zoomedStudentId === idToRemove) {
        this.closeZoom();
      }
    });

    this.client.on('student_disconnected', (data) => {
      // Try to find by socket.id first, then by sessionId
      let entry = this.students.get(data.id);
      if (!entry && data.sessionId) {
        this.students.forEach((e, id) => {
          if (e.sessionId === data.sessionId) {
            entry = e;
            data.id = id; // Update the id to the actual key
          }
        });
      }
      if (entry) {
        entry.disconnected = true;
        this.updateStudentCard(data.id);
      }
      this.updateStudentCount();
    });

    this.client.on('student_updated', (data) => {
      const entry = this.students.get(data.id);
      if (entry) {
        entry.state = data.state;
      }
    });

    this.client.on('student_count', (data) => {
      this.updateStudentCountDisplay(data.count);
    });

    this.client.on('mode_changed', (data) => {
      this.mode = data.mode;
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === this.mode);
      });
    });

    this.client.on('students_summary', (summaries) => {
      this.updateStudentCountDisplay(summaries.length);
    });

    // Reload custom assets when updated
    this.client.on('assets_updated', async () => {
      await AssetLoader.reloadCustomAssets();
      this.renderCustomAssets();
    });

    // Handle student state response for zoom view
    this.client.on('student_state', (data) => {
      const entry = this.students.get(data.id);
      if (entry) entry.state = data.state;
    });

    this.client.on('showcase_status', (data) => {
      const showcaseBtn = document.getElementById('btn-showcase');
      const stopBtn = document.getElementById('btn-stop-showcase');
      if (data.active) {
        if (showcaseBtn) showcaseBtn.hidden = true;
        if (stopBtn) stopBtn.hidden = false;
      } else {
        if (showcaseBtn) { showcaseBtn.hidden = false; }
        if (stopBtn) stopBtn.hidden = true;
      }
    });

    this.client.on('gallery_status', (data) => {
      const startBtn = document.getElementById('btn-start-gallery');
      const stopBtn = document.getElementById('btn-stop-gallery');
      const selectBtn = document.getElementById('btn-gallery-select');
      if (data.active) {
        if (startBtn) startBtn.hidden = true;
        if (stopBtn) stopBtn.hidden = false;
        if (selectBtn) selectBtn.hidden = true;
      } else {
        if (stopBtn) stopBtn.hidden = true;
        if (startBtn) startBtn.hidden = true;
        if (selectBtn) selectBtn.hidden = false;
        this.gallerySelectMode = false;
        this.gallerySelectedIds.clear();
        document.querySelectorAll('.student-card.gallery-selected').forEach(c => c.classList.remove('gallery-selected'));
        selectBtn?.classList.remove('active');
      }
    });

    this.client.on('all_students_cleared', () => {
      // Remove all student cards from UI
      this.students.forEach((entry) => {
        if (entry.card) entry.card.remove();
      });
      this.students.clear();
      this.selectedStudentId = null;
      this.zoomedStudentId = null;
      this.gallerySelectedIds.clear();
      this.gallerySelectMode = false;
      this.closeZoom();
      this.updateStudentCount();
      const showcaseBtn = document.getElementById('btn-showcase');
      if (showcaseBtn) showcaseBtn.disabled = true;
    });
  }

  addStudentEntry(id, state) {
    if (this.students.has(id)) {
      this.students.get(id).state = state;
      return;
    }

    const grid = document.getElementById('student-grid');
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.studentId = id;

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    canvas.className = 'student-thumb';
    card.appendChild(canvas);

    const label = document.createElement('div');
    label.className = 'student-label';
    label.textContent = state.fruitName || state.name || 'Student';
    card.appendChild(label);

    card.addEventListener('click', () => {
      if (this.gallerySelectMode) {
        if (this.gallerySelectedIds.has(id)) {
          this.gallerySelectedIds.delete(id);
          card.classList.remove('gallery-selected');
        } else {
          this.gallerySelectedIds.add(id);
          card.classList.add('gallery-selected');
        }
        const startBtn = document.getElementById('btn-start-gallery');
        if (startBtn) startBtn.hidden = this.gallerySelectedIds.size === 0;
        return;
      }

      if (this.selectedStudentId === id) {
        // 取消选中并关闭放大
        this.selectedStudentId = null;
        this.zoomedStudentId = null;
        card.classList.remove('selected');
        this.closeZoom();
        const showcaseBtn = document.getElementById('btn-showcase');
        if (showcaseBtn) showcaseBtn.disabled = true;
      } else {
        // 选中并放大
        if (this.selectedStudentId) {
          const prev = document.querySelector('.student-card.selected');
          if (prev) prev.classList.remove('selected');
        }
        this.selectedStudentId = id;
        card.classList.add('selected');
        this.zoomStudent(id);
        const showcaseBtn = document.getElementById('btn-showcase');
        if (showcaseBtn) showcaseBtn.disabled = false;
      }
    });

    grid.appendChild(card);

    this.students.set(id, {
      state: state,
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      card: card,
      sessionId: state.sessionId || null,
      fruitName: state.fruitName || null
    });
  }

  removeStudentEntry(id) {
    const entry = this.students.get(id);
    if (entry && entry.card) {
      entry.card.remove();
    }
    this.students.delete(id);
  }

  updateStudentCard(id) {
    const entry = this.students.get(id);
    if (entry && entry.card) {
      entry.card.classList.toggle('disconnected', !!entry.disconnected);
    }
  }

  updateStudentCount() {
    this.updateStudentCountDisplay(this.students.size);
  }

  updateStudentCountDisplay(count) {
    const el = document.getElementById('student-count');
    if (el) el.textContent = `${count} 位学生在线`;

    const empty = document.getElementById('empty-state');
    if (empty) empty.style.display = this.students.size === 0 ? 'block' : 'none';
  }

  zoomStudent(id) {
    this.zoomedStudentId = id;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.add('visible');

    // HD canvas support
    const canvas = document.getElementById('zoom-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 500 * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = '500px';
      canvas.style.height = '500px';
      ctx.scale(dpr, dpr);
    }

    this.client.getStudentState(id);
  }

  closeZoom() {
    this.zoomedStudentId = null;
    const zoomView = document.getElementById('zoom-view');
    if (zoomView) zoomView.classList.remove('visible');
  }

  startAnimation() {
    const animate = () => {
      this.breathPhase += SUN_CONFIG.breathingSpeed;
      if (this.breathPhase > Math.PI * 2) this.breathPhase = 0;

      const breathScale = SUN_CONFIG.breathingMin +
        (SUN_CONFIG.breathingMax - SUN_CONFIG.breathingMin) *
        (Math.sin(this.breathPhase) + 1) / 2;

      this.renderAll(breathScale);
      this.animationId = requestAnimationFrame(animate);
    };

    // Disable animation if user prefers reduced motion
    if (this.prefersReducedMotion && this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      return;
    }

    animate();
  }

  renderAll(breathScale) {
    this.students.forEach((entry, id) => {
      this.renderStudentCanvas(entry, breathScale);
    });

    if (this.zoomedStudentId) {
      this.renderZoomView(breathScale);
    }
  }

  renderStudentCanvas(entry, breathScale) {
    const ctx = entry.ctx;
    const w = entry.canvas.width;
    const h = entry.canvas.height;
    const cx = w / 2, cy = h / 2, r = w / 2 - 5;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale, this.mode);

    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];
    const studentCanvasRadius = (entry.state && entry.state.canvasRadius) || 400;
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r, this.mode);
      faceParts.forEach(part => {
        const scaledPart = {
          ...part,
          offsetX: part.offsetX * scaleFactor,
          offsetY: part.offsetY * scaleFactor
        };
        drawFacePart(ctx, scaledPart, cx, cy, sunR);
      });
    }

    ctx.restore();
  }

  scaleShapeForThumb(shape, scaleFactor, thumbCX, thumbCY, studentCanvasRadius) {
    const dx = shape.x - studentCanvasRadius;
    const dy = shape.y - studentCanvasRadius;
    return {
      ...shape,
      x: thumbCX + dx * scaleFactor,
      y: thumbCY + dy * scaleFactor,
      size: shape.size * scaleFactor,
      scale: shape.scale || 1
    };
  }

  renderZoomView(breathScale) {
    const canvas = document.getElementById('zoom-canvas');
    if (!canvas) return;

    const entry = this.students.get(this.zoomedStudentId);
    if (!entry) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2, cy = h / 2, r = w / 2 - 5;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    const skinId = (entry.state && entry.state.sunSkin) || 'cartoon';
    drawSun(ctx, cx, cy, r, skinId, breathScale, this.mode);

    const shapes = (entry.state && entry.state.shapes) || [];
    const faceParts = (entry.state && entry.state.faceParts) || [];
    const studentCanvasRadius = (entry.state && entry.state.canvasRadius) || 400;
    const scaleFactor = r / studentCanvasRadius;

    if (this.mode === 'symmetric' || this.mode === 'free') {
      shapes.forEach(shape => {
        const scaled = this.scaleShapeForThumb(shape, scaleFactor, cx, cy, studentCanvasRadius);
        drawShape(ctx, scaled, scaled.size);
      });
    }

    if (this.mode === 'personify' || this.mode === 'free') {
      const sunR = getSunRadius(r, this.mode);
      faceParts.forEach(part => {
        const scaledPart = {
          ...part,
          offsetX: part.offsetX * scaleFactor,
          offsetY: part.offsetY * scaleFactor
        };
        drawFacePart(ctx, scaledPart, cx, cy, sunR);
      });
    }

    if (this.mode === 'symmetric' || this.mode === 'free') {
      ctx.strokeStyle = 'rgba(255, 180, 100, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TeacherApp();
});
