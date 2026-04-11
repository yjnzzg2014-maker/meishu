class SocketClient {
  constructor() {
    this.socket = null;
    this.state = { shapes: [], mode: 'axisymmetric' };
    this.callbacks = {};
  }

  connect() {
    this.socket = io();

    this.socket.on('sync_state', (state) => {
      this.state = state;
      this.trigger('sync', state);
    });

    this.socket.on('broadcast', (data) => {
      this.handleBroadcast(data.action, data.payload);
    });

    this.socket.on('mode_changed', (data) => {
      this.state.mode = data.mode;
      this.trigger('modeChanged', data.mode);
    });

    return this;
  }

  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
    return this;
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  handleBroadcast(action, payload) {
    switch (action) {
      case 'add_shape':
        this.state.shapes.push(payload);
        break;
      case 'move_shape':
        const moveShape = this.state.shapes.find(s => s.id === payload.id);
        if (moveShape) { moveShape.x = payload.x; moveShape.y = payload.y; }
        break;
      case 'rotate_shape':
        const rotateShape = this.state.shapes.find(s => s.id === payload.id);
        if (rotateShape) rotateShape.angle = payload.angle;
        break;
      case 'delete_shape':
        this.state.shapes = this.state.shapes.filter(s => s.id !== payload.id);
        break;
    }
    this.trigger('broadcast', { action, payload });
  }

  addShape(shape) {
    this.state.shapes.push(shape);
    this.socket.emit('add_shape', shape);
  }

  moveShape(id, x, y) {
    const shape = this.state.shapes.find(s => s.id === id);
    if (shape) { shape.x = x; shape.y = y; }
    this.socket.emit('move_shape', { id, x, y });
  }

  rotateShape(id, angle) {
    const shape = this.state.shapes.find(s => s.id === id);
    if (shape) shape.angle = angle;
    this.socket.emit('rotate_shape', { id, angle });
  }

  deleteShape(id) {
    this.state.shapes = this.state.shapes.filter(s => s.id !== id);
    this.socket.emit('delete_shape', { id });
  }

  changeMode(mode) {
    this.state.mode = mode;
    this.socket.emit('change_mode', { mode });
  }
}
