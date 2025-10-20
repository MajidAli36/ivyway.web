import { io } from 'socket.io-client';

class NotificationSocket {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    if (this.socket && this.connected) {
      return;
    }

    try {
      this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to connect to notification socket:', error);
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to notification socket');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from notification socket:', reason);
      this.connected = false;
      this.emit('disconnected', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connected = false;
      this.emit('error', error);
      this.handleReconnect();
    });

    // Notification events
    this.socket.on('notification:new', (data) => {
      console.log('New notification received:', data);
      this.emit('notification:new', data);
    });

    this.socket.on('notification:updated', (data) => {
      console.log('Notification updated:', data);
      this.emit('notification:updated', data);
    });

    this.socket.on('notification:deleted', (data) => {
      console.log('Notification deleted:', data);
      this.emit('notification:deleted', data);
    });

    this.socket.on('notification:read', (data) => {
      console.log('Notification marked as read:', data);
      this.emit('notification:read', data);
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.emit('reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.connected) {
        this.socket?.connect();
      }
    }, delay);
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in notification event handler for ${event}:`, error);
      }
    });
  }

  // Send events to server
  markAsRead(notificationId) {
    if (this.socket && this.connected) {
      this.socket.emit('notification:mark_read', { notificationId });
    }
  }

  markAllAsRead() {
    if (this.socket && this.connected) {
      this.socket.emit('notification:mark_all_read');
    }
  }

  deleteNotification(notificationId) {
    if (this.socket && this.connected) {
      this.socket.emit('notification:delete', { notificationId });
    }
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    };
  }
}

// Create singleton instance
const notificationSocket = new NotificationSocket();

export default notificationSocket;
