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

let state = {
  shapes: [],
  mode: 'axisymmetric' // 'axisymmetric' | 'quad'
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current state to new client
  socket.emit('sync_state', state);

  socket.on('add_shape', (data) => {
    state.shapes.push(data);
    socket.broadcast.emit('broadcast', { action: 'add_shape', payload: data });
  });

  socket.on('move_shape', (data) => {
    const shape = state.shapes.find(s => s.id === data.id);
    if (shape) {
      shape.x = data.x;
      shape.y = data.y;
    }
    socket.broadcast.emit('broadcast', { action: 'move_shape', payload: data });
  });

  socket.on('rotate_shape', (data) => {
    const shape = state.shapes.find(s => s.id === data.id);
    if (shape) {
      shape.angle = data.angle;
    }
    socket.broadcast.emit('broadcast', { action: 'rotate_shape', payload: data });
  });

  socket.on('delete_shape', (data) => {
    state.shapes = state.shapes.filter(s => s.id !== data.id);
    socket.broadcast.emit('broadcast', { action: 'delete_shape', payload: data });
  });

  socket.on('change_mode', (data) => {
    state.mode = data.mode;
    io.emit('mode_changed', { mode: data.mode });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sun Decorator server running on http://localhost:${PORT}`);
});
