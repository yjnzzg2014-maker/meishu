// Socket client for per-student architecture
class SocketClient {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect() {
    this.socket = io();

    const events = [
      'init_state', 'mode_changed', 'lock_changed', 'student_count',
      // Teacher-specific events
      'teacher_init', 'student_joined', 'student_left',
      'student_updated', 'student_state', 'student_list',
      'students_summary',
      // Asset sync
      'assets_updated'
    ];

    events.forEach(event => {
      this.socket.on(event, (data) => this.trigger(event, data));
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

  // Student methods
  registerStudent(data) {
    this.socket.emit('register_student', data);
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
}
