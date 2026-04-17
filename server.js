const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 10000,  // 10s - faster disconnect detection
  pingInterval: 5000   // 5s - more frequent pings
});

// --- Data persistence paths ---
const DATA_DIR = path.join(__dirname, 'data');
const CUSTOM_SHAPES_FILE = path.join(DATA_DIR, 'custom-shapes.json');
const CUSTOM_FACES_FILE = path.join(DATA_DIR, 'custom-faces.json');
const CUSTOM_SHAPES_DIR = path.join(__dirname, 'public/assets/custom/shapes');
const CUSTOM_FACES_DIR = path.join(__dirname, 'public/assets/custom/faces');

// Ensure directories exist
[DATA_DIR, CUSTOM_SHAPES_DIR, CUSTOM_FACES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load/save helpers
function loadJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) { console.error(`Error loading ${filePath}:`, e.message); }
  return fallback;
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Load custom assets on startup
let customShapes = loadJSON(CUSTOM_SHAPES_FILE, []);
let customFaces = loadJSON(CUSTOM_FACES_FILE, []);

// --- Express setup ---
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/student.html');
});

// --- Custom Assets API ---

// Get all custom assets
app.get('/api/custom-assets', (req, res) => {
  res.json({ shapes: customShapes, faces: customFaces });
});

// Add custom shape
app.post('/api/shapes', (req, res) => {
  const { name, category, imageData } = req.body;
  if (!name || !category || !imageData) {
    return res.status(400).json({ error: 'Missing name, category, or imageData' });
  }

  const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const filename = id + '.png';
  const filePath = path.join(CUSTOM_SHAPES_DIR, filename);

  // Save PNG file (imageData is base64 data URL)
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

  const entry = {
    id,
    name,
    category,
    src: `assets/custom/shapes/${filename}`,
    custom: true
  };
  customShapes.push(entry);
  saveJSON(CUSTOM_SHAPES_FILE, customShapes);

  // Notify all clients
  io.emit('assets_updated');
  res.json(entry);
});

// Delete custom shape
app.delete('/api/shapes/:id', (req, res) => {
  const id = req.params.id;
  const idx = customShapes.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const entry = customShapes[idx];
  const filePath = path.join(__dirname, 'public', entry.src);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  customShapes.splice(idx, 1);
  saveJSON(CUSTOM_SHAPES_FILE, customShapes);

  io.emit('assets_updated');
  res.json({ ok: true });
});

// Add custom face part
app.post('/api/faces', (req, res) => {
  const { name, category, imageData } = req.body;
  if (!name || !category || !imageData) {
    return res.status(400).json({ error: 'Missing name, category, or imageData' });
  }

  const id = 'custom_face_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const filename = id + '.png';
  const filePath = path.join(CUSTOM_FACES_DIR, filename);

  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

  const entry = {
    id,
    name,
    category,
    src: `assets/custom/faces/${filename}`,
    custom: true
  };
  customFaces.push(entry);
  saveJSON(CUSTOM_FACES_FILE, customFaces);

  io.emit('assets_updated');
  res.json(entry);
});

// Delete custom face part
app.delete('/api/faces/:id', (req, res) => {
  const id = req.params.id;
  const idx = customFaces.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const entry = customFaces[idx];
  const filePath = path.join(__dirname, 'public', entry.src);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  customFaces.splice(idx, 1);
  saveJSON(CUSTOM_FACES_FILE, customFaces);

  io.emit('assets_updated');
  res.json({ ok: true });
});

// --- Per-student state architecture ---

let globalMode = 'symmetric';
let locked = false;
let showcaseState = null; // { studentId, freezeStudent }
let showcaseThrottleTimer = null;
let galleryState = null;

const students = new Map(); // socket.id -> { sessionId, shapes, faceParts, sunSkin, name, canvasRadius, _dirty, disconnected, disconnectedAt }
const teachers = new Set();

const FRUIT_NAMES = [
  '苹果','香蕉','橙子','葡萄','西瓜','草莓','芒果','菠萝','樱桃','桃子',
  '梨子','蓝莓','柠檬','椰子','荔枝','龙眼','火龙果','百香果','杨梅','枇杷',
  '柚子','橘子','金桔','木瓜','榴莲','山竹','番石榴','莲雾','杨桃','无花果',
  '红毛丹','人参果','奇异果','蔓越莓','覆盆子','黑莓','桑椹','枸杞','柿子','山楂',
  '哈密瓜','杏子','李子','石榴','牛油果','酸枣','马蹄','枣子','菠萝蜜','雪梨'
];
const usedFruitNames = new Set();
const sessionFruitMap = new Map(); // sessionId -> fruitName

function assignFruitName(sessionId) {
  if (sessionFruitMap.has(sessionId)) return sessionFruitMap.get(sessionId);
  let name = FRUIT_NAMES.find(n => !usedFruitNames.has(n));
  if (!name) {
    let i = 2;
    while (usedFruitNames.has(FRUIT_NAMES[0] + i)) i++;
    name = FRUIT_NAMES[0] + i;
  }
  usedFruitNames.add(name);
  sessionFruitMap.set(sessionId, name);
  return name;
}

let summaryInterval = null;
let cleanupInterval = null;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // --- Student events ---

  socket.on('register_student', (data) => {
    const sessionId = (data && data.sessionId) || null;
    let studentState = null;
    let isReconnect = false;

    console.log(`=== register_student ===`);
    console.log(`  socket.id: ${socket.id}`);
    console.log(`  sessionId: ${sessionId}`);
    console.log(`  students map size: ${students.size}`);

    // Debug: list all students
    students.forEach((state, sockId) => {
      console.log(`  [DEBUG] student: sockId=${sockId}, sessionId=${state.sessionId}, disconnected=${state.disconnected}`);
    });

    // Check for race condition: new socket arrived before old one disconnected
    if (sessionId) {
      for (const [sockId, state] of students.entries()) {
        if (state.sessionId === sessionId && !state.disconnected && sockId !== socket.id) {
          studentState = state;
          isReconnect = true;
          if (state._disconnectTimer) {
            clearTimeout(state._disconnectTimer);
            state._disconnectTimer = null;
          }
          students.delete(sockId);
          students.set(socket.id, studentState);
          console.log(`Student REFRESH-RECONNECTED (race): socket.id=${socket.id}, sessionId=${sessionId}`);
          break;
        }
      }
    }

    // Check if this is a reconnection - find existing state by sessionId with disconnected=true
    if (!studentState && sessionId) {
      for (const [sockId, state] of students.entries()) {
        if (state.sessionId === sessionId && state.disconnected) {
          studentState = state;
          isReconnect = true;
          if (state._disconnectTimer) {
            clearTimeout(state._disconnectTimer);
            state._disconnectTimer = null;
          }
          students.delete(sockId);
          students.set(socket.id, studentState);
          console.log(`Student RECONNECTED: socket.id=${socket.id}, sessionId=${sessionId}`);
          break;
        }
      }
    }

    // If no reconnected state found, create new state
    if (!studentState) {
      const newSessionId = sessionId || ('sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
      studentState = {
        sessionId: newSessionId,
        shapes: [],
        faceParts: [],
        sunSkin: (data && data.sunSkin) || 'clay',
        name: (data && data.name) || 'Student',
        canvasRadius: 400,
        _dirty: false,
        disconnected: false,
        disconnectedAt: null
      };
      studentState.fruitName = assignFruitName(studentState.sessionId);
      students.set(socket.id, studentState);
      console.log(`Student registered: ${socket.id} (sessionId: ${studentState.sessionId}, fruitName: ${studentState.fruitName}, total: ${students.size})`);
    } else {
      // Restore disconnected flag and ensure fruitName is set
      studentState.disconnected = false;
      studentState.disconnectedAt = null;
      studentState.fruitName = assignFruitName(studentState.sessionId);
    }

    socket.emit('init_state', {
      mode: globalMode,
      locked: locked,
      state: {
        shapes: studentState.shapes,
        faceParts: studentState.faceParts,
        sunSkin: studentState.sunSkin,
        canvasRadius: studentState.canvasRadius
      },
      sessionId: studentState.sessionId,
      isReconnect: isReconnect,
      fruitName: studentState.fruitName
    });
    console.log(`Sent init_state to ${socket.id}: isReconnect=${isReconnect}, shapes=${studentState.shapes.length}, fruitName=${studentState.fruitName}`);

    broadcastToTeachers('student_joined', {
      id: socket.id,
      sessionId: studentState.sessionId,
      name: studentState.name,
      sunSkin: studentState.sunSkin,
      disconnected: false,
      isReconnect: isReconnect,
      fruitName: studentState.fruitName
    });
    broadcastStudentCount();
  });

  socket.on('update_state', (data) => {
    const student = students.get(socket.id);
    if (!student || locked) return;

    if (data.shapes !== undefined) student.shapes = data.shapes;
    if (data.faceParts !== undefined) student.faceParts = data.faceParts;
    if (data.sunSkin !== undefined) student.sunSkin = data.sunSkin;
    if (data.canvasRadius !== undefined) student.canvasRadius = data.canvasRadius;

    student._dirty = true;

    // Broadcast live showcase update
    if (showcaseState && showcaseState.studentId === socket.id && !showcaseState.freezeStudent) {
      if (!showcaseThrottleTimer) {
        showcaseThrottleTimer = setTimeout(() => {
          showcaseThrottleTimer = null;
          if (showcaseState && showcaseState.studentId === socket.id) {
            const s = students.get(socket.id);
            if (s) {
              io.emit('showcase_update', {
                state: { shapes: s.shapes, faceParts: s.faceParts, sunSkin: s.sunSkin, canvasRadius: s.canvasRadius }
              });
            }
          }
        }, 200);
      }
    }
  });

  socket.on('change_skin', (data) => {
    const student = students.get(socket.id);
    if (!student) return;
    student.sunSkin = data.skinId;
    student._dirty = true;
  });

  // --- Teacher events ---

  socket.on('register_teacher', () => {
    teachers.add(socket.id);
    console.log(`Teacher registered: ${socket.id}`);

    const studentList = [];
    students.forEach((state, id) => {
      studentList.push({
        id,
        sessionId: state.sessionId,
        name: state.name,
        sunSkin: state.sunSkin,
        disconnected: !!state.disconnected,
        fruitName: state.fruitName || null
      });
    });

    socket.emit('teacher_init', {
      mode: globalMode,
      locked: locked,
      students: studentList
    });
  });

  socket.on('change_mode', (data) => {
    if (!teachers.has(socket.id)) return;
    globalMode = data.mode;
    console.log(`Mode changed to: ${globalMode}`);
    io.emit('mode_changed', { mode: globalMode });
  });

  socket.on('toggle_lock', (data) => {
    if (!teachers.has(socket.id)) return;
    locked = data.locked;
    console.log(`Lock state: ${locked}`);
    io.emit('lock_changed', { locked });
  });

  socket.on('get_student_state', (data) => {
    if (!teachers.has(socket.id)) return;
    const student = students.get(data.studentId);
    if (student) {
      socket.emit('student_state', {
        id: data.studentId,
        state: student
      });
    }
  });

  socket.on('get_student_list', () => {
    if (!teachers.has(socket.id)) return;
    const list = [];
    students.forEach((state, id) => {
      list.push({ id, sessionId: state.sessionId, name: state.name, sunSkin: state.sunSkin, disconnected: !!state.disconnected });
    });
    socket.emit('student_list', list);
  });

  socket.on('start_showcase', (data) => {
    if (!teachers.has(socket.id)) return;
    if (galleryState) {
      galleryState = null;
      io.emit('gallery_end');
    }
    const { studentId, freezeStudent } = data;
    const student = students.get(studentId);
    if (!student) return;
    showcaseState = { studentId, freezeStudent };
    io.emit('showcase_start', {
      studentId,
      fruitName: student.fruitName || student.name,
      state: {
        shapes: student.shapes,
        faceParts: student.faceParts,
        sunSkin: student.sunSkin,
        canvasRadius: student.canvasRadius
      },
      freezeStudent
    });
    broadcastToTeachers('showcase_status', { active: true, studentId, freezeStudent });
  });

  socket.on('stop_showcase', () => {
    if (!teachers.has(socket.id)) return;
    showcaseState = null;
    io.emit('showcase_end');
    broadcastToTeachers('showcase_status', { active: false });
  });

  socket.on('clear_all_students', () => {
    if (!teachers.has(socket.id)) return;
    // Stop any active showcase/gallery
    if (showcaseState) { showcaseState = null; io.emit('showcase_end'); broadcastToTeachers('showcase_status', { active: false }); }
    if (galleryState)  { galleryState  = null; io.emit('gallery_end');  broadcastToTeachers('gallery_status',  { active: false }); }
    // Notify all students to reset
    io.emit('force_reset');
    // Clear server-side student state
    students.forEach((state) => {
      if (state._disconnectTimer) clearTimeout(state._disconnectTimer);
    });
    students.clear();
    usedFruitNames.clear();
    sessionFruitMap.clear();
    broadcastToTeachers('all_students_cleared');
    broadcastStudentCount();
    console.log('All students cleared by teacher');
  });

  socket.on('start_gallery', (data) => {
    if (!teachers.has(socket.id)) return;
    if (showcaseState) {
      showcaseState = null;
      io.emit('showcase_end');
      broadcastToTeachers('showcase_status', { active: false });
    }
    const { studentIds } = data;
    const artworks = [];
    (studentIds || []).forEach(sid => {
      const student = students.get(sid);
      if (student) {
        artworks.push({
          studentId: sid,
          fruitName: student.fruitName || student.name,
          state: {
            shapes: student.shapes,
            faceParts: student.faceParts,
            sunSkin: student.sunSkin,
            canvasRadius: student.canvasRadius
          }
        });
      }
    });
    galleryState = { studentIds };
    io.emit('gallery_start', { artworks });
    broadcastToTeachers('gallery_status', { active: true });
  });

  socket.on('stop_gallery', () => {
    if (!teachers.has(socket.id)) return;
    galleryState = null;
    io.emit('gallery_end');
    broadcastToTeachers('gallery_status', { active: false });
  });

  // --- Disconnect ---

  socket.on('disconnect', (reason) => {
    console.log(`Client DISCONNECTED: ${socket.id}, reason: ${reason}`);

    if (students.has(socket.id)) {
      const student = students.get(socket.id);
      student._disconnectTimer = setTimeout(() => {
        student.disconnected = true;
        student.disconnectedAt = Date.now();
        student._disconnectTimer = null;
        broadcastToTeachers('student_disconnected', { id: socket.id, sessionId: student.sessionId });
        console.log(`Student marked disconnected: ${socket.id}`);
      }, 2000);
    }

    if (teachers.has(socket.id)) {
      teachers.delete(socket.id);
      console.log(`Teacher removed`);
    }
  });
});

function broadcastToTeachers(event, data) {
  teachers.forEach(teacherId => {
    const teacherSocket = io.sockets.sockets.get(teacherId);
    if (teacherSocket) {
      teacherSocket.emit(event, data);
    }
  });
}

function getActiveStudentCount() {
  let count = 0;
  students.forEach(state => {
    if (!state.disconnected) count++;
  });
  return count;
}

function broadcastStudentCount() {
  const count = getActiveStudentCount();
  io.emit('student_count', { count });
}

// Cleanup disconnected students older than 30 minutes
const DISCONNECTED_CLEANUP_MS = 30 * 60 * 1000;
cleanupInterval = setInterval(() => {
  const now = Date.now();
  const toDelete = [];
  students.forEach((state, socketId) => {
    if (state.disconnected && state.disconnectedAt && (now - state.disconnectedAt > DISCONNECTED_CLEANUP_MS)) {
      toDelete.push(socketId);
    }
  });
  toDelete.forEach(socketId => {
    const state = students.get(socketId);
    if (state) {
      const fn = state.fruitName;
      if (fn) {
        usedFruitNames.delete(fn);
        sessionFruitMap.delete(state.sessionId);
      }
    }
    students.delete(socketId);
    console.log(`Cleaned up disconnected student: ${socketId}`);
  });
  if (toDelete.length > 0) {
    broadcastStudentCount();
  }
}, 60 * 1000); // Run every minute

// Periodic batch push to teachers (every 2 seconds)
summaryInterval = setInterval(() => {
  if (teachers.size === 0) return;

  students.forEach((state, id) => {
    if (state._dirty) {
      broadcastToTeachers('student_updated', { id, state });
      state._dirty = false;
    }
  });

  const summaries = [];
  students.forEach((state, id) => {
    summaries.push({
      id,
      name: state.name,
      sunSkin: state.sunSkin,
      shapeCount: state.shapes.length,
      facePartCount: state.faceParts.length
    });
  });

  broadcastToTeachers('students_summary', summaries);
}, 2000);

const PORT = process.env.PORT || 2500;
server.listen(PORT, () => {
  console.log(`Sun Decorator server running on http://localhost:${PORT}`);
});
