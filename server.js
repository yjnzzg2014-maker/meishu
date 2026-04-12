const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

const students = new Map();
const teachers = new Set();

let summaryInterval = null;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // --- Student events ---

  socket.on('register_student', (data) => {
    const studentState = {
      shapes: [],
      faceParts: [],
      sunSkin: (data && data.sunSkin) || 'cartoon',
      name: (data && data.name) || 'Student',
      canvasRadius: 400,
      _dirty: false
    };
    students.set(socket.id, studentState);
    console.log(`Student registered: ${socket.id} (total: ${students.size})`);

    socket.emit('init_state', {
      mode: globalMode,
      locked: locked,
      state: studentState
    });

    broadcastToTeachers('student_joined', {
      id: socket.id,
      name: studentState.name,
      sunSkin: studentState.sunSkin
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
      studentList.push({ id, ...state });
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

  socket.on('broadcast_display', (data) => {
    // data: { studentId, studentName, state }
    // 转发给所有学生（包括发送者）
    io.emit('display_broadcast', data);
  });

  socket.on('display_closed', () => {
    io.emit('display_closed_by_teacher');
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
      list.push({ id, name: state.name, sunSkin: state.sunSkin });
    });
    socket.emit('student_list', list);
  });

  // --- Disconnect ---

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (students.has(socket.id)) {
      students.delete(socket.id);
      broadcastToTeachers('student_left', { id: socket.id });
      broadcastStudentCount();
      console.log(`Student removed (remaining: ${students.size})`);
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

function broadcastStudentCount() {
  const count = students.size;
  io.emit('student_count', { count });
}

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
