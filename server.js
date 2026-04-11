const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/student.html');
});

// --- Per-student state architecture ---

// Global mode controlled by teacher
let globalMode = 'symmetric'; // 'symmetric' | 'personify' | 'free'
let locked = false;

// Per-student state: Map<socketId, { shapes[], faceParts[], sunSkin, name }>
const students = new Map();

// Track teacher sockets
const teachers = new Set();

// Periodic summary interval
let summaryInterval = null;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // --- Student events ---

  socket.on('register_student', (data) => {
    const studentState = {
      shapes: [],
      faceParts: [],
      sunSkin: (data && data.sunSkin) || 'cartoon',
      name: (data && data.name) || 'Student'
    };
    students.set(socket.id, studentState);
    console.log(`Student registered: ${socket.id} (total: ${students.size})`);

    // Send initial state
    socket.emit('init_state', {
      mode: globalMode,
      locked: locked,
      state: studentState
    });

    // Notify teachers of new student
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

    // Notify any subscribing teacher
    broadcastToTeachers('student_updated', {
      id: socket.id,
      state: student
    });
  });

  socket.on('change_skin', (data) => {
    const student = students.get(socket.id);
    if (!student) return;
    student.sunSkin = data.skinId;

    broadcastToTeachers('student_updated', {
      id: socket.id,
      state: student
    });
  });

  // --- Teacher events ---

  socket.on('register_teacher', () => {
    teachers.add(socket.id);
    console.log(`Teacher registered: ${socket.id}`);

    // Send current state
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

    // Broadcast to ALL clients (students + teachers)
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

// Periodic summary push to teachers (every 2 seconds)
summaryInterval = setInterval(() => {
  if (teachers.size === 0) return;

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
