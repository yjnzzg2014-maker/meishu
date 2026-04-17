// Socket client for per-student architecture
class SocketClient {
  constructor() {
    this.socket = null;
    this.callbacks = {};
    this.sessionId = null;
    this._registered = false;
  }

  connect() {
    // If socket already exists and is connected, don't create new one
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return this;
    }

    // If socket exists but disconnected, try to reconnect
    if (this.socket && !this.socket.connected) {
      console.log('Socket exists but disconnected, attempting reconnect...');
      this.socket.connect();
      return this;
    }

    // Create new socket connection
    this._initializeSocket();
    this.socket.connect();
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

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  forceReconnect() {
    console.log('Force reconnect called');
    console.log('  Current socket state:', this.socket?.connected, this.socket?.id);

    // Remove all listeners and disconnect
    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (e) {
        console.error('Error disconnecting socket:', e);
      }
      this.socket = null;
    }

    console.log('  Creating new socket...');
    // Create new socket
    this._initializeSocket();
    console.log('  Calling connect()...');
    this.socket.connect();
    console.log('  connect() called, socket.id will be:', this.socket.id);
  }

  _initializeSocket() {
    console.log('  _initializeSocket creating new socket');
    this.socket = io({
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      timeout: 5000
    });

    // Reconnection events
    this.socket.on('connect', () => {
      console.log('  New socket CONNECTED, id:', this.socket.id, 'sessionId:', this.sessionId);
      // Wait a tiny bit for socket to be fully ready
      setTimeout(() => {
        // Only register if we haven't registered yet
        if (this.sessionId && !this._registered) {
          console.log('  Calling registerStudent with sessionId:', this.sessionId);
          this._registered = true;
          this.socket.emit('register_student', { sunSkin: this.sunSkin, sessionId: this.sessionId });
          console.log('  register_student event sent');
        } else if (this._registered) {
          console.log('  Already registered, skipping registerStudent');
        } else {
          console.log('  No sessionId, skipping registerStudent');
        }
      }, 50);
    });

    this.socket.on('reconnect', () => {
      console.log('Socket reconnected, sessionId:', this.sessionId);
      this.trigger('reconnect', { sessionId: this.sessionId });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnect attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnect error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connect error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this._registered = false; // Reset so we can register again on reconnect
      this.trigger('disconnect', { reason });
    });

    const events = [
      'init_state', 'mode_changed', 'lock_changed', 'student_count',
      // Teacher-specific events
      'teacher_init', 'student_joined', 'student_left', 'student_disconnected',
      'student_updated', 'student_state', 'student_list',
      'students_summary',
      // Asset sync
      'assets_updated',
      // Showcase & Gallery
      'showcase_start', 'showcase_update', 'showcase_end',
      'gallery_start', 'gallery_end',
      'showcase_status', 'gallery_status',
      'force_reset', 'all_students_cleared'
    ];

    events.forEach(event => {
      this.socket.on(event, (data) => {
        console.log('  Event received:', event);
        this.trigger(event, data);
      });
    });
  }

  // Student methods
  registerStudent(data) {
    const payload = { ...data, sessionId: this.sessionId };
    this.socket.emit('register_student', payload);
  }

  updateState(state) {
    this.socket.emit('update_state', state);
  }

  changeSkin(skinId) {
    this.socket.emit('change_skin', { skinId });
  }

  // Teacher methods
  registerTeacher() {
    this.socket.emit('register_teacher');
  }

  changeMode(mode) {
    this.socket.emit('change_mode', { mode });
  }

  toggleLock(locked) {
    this.socket.emit('toggle_lock', { locked });
  }

  getStudentState(studentId) {
    this.socket.emit('get_student_state', { studentId });
  }

  getStudentList() {
    this.socket.emit('get_student_list');
  }

  startShowcase(studentId, freezeStudent) {
    this.socket.emit('start_showcase', { studentId, freezeStudent });
  }

  stopShowcase() {
    this.socket.emit('stop_showcase');
  }

  startGallery(studentIds) {
    this.socket.emit('start_gallery', { studentIds });
  }

  stopGallery() {
    this.socket.emit('stop_gallery');
  }

  clearAllStudents() {
    this.socket.emit('clear_all_students');
  }
}
