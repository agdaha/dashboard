import { ref } from 'vue';

const url = import.meta.env.VITE_BASE_WS_URL;

export const isOnline = ref(false);

class WebSocketService {
  constructor() {
    if (WebSocketService._instance) {
      return WebSocketService._instance;
    }

    this.url = url;
    this.socket = null;
    this.listeners = new Map();

    WebSocketService._instance = this;
    return this;
  }

  connect() {
    const value = localStorage.getItem('user');
    let url = this.url;
    if (value) {
      url = this.url + '?token=' + JSON.parse(value).token;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      isOnline.value = true;
      this.dispatchEvent('open', null);
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'log': {
          this.dispatchEvent('log', message.data);
          break;
        }
        case 'cpu': {
          this.dispatchEvent('cpu', message.data);
          break;
        }
        case 'remove': {
          this.dispatchEvent('remove', message.data);
          break;
        }
        case 'response': {
          this.dispatchEvent('response', message.data);
          break;
        }
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      isOnline.value = false;
      this.dispatchEvent('close', null);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.dispatchEvent('error', error);
    };
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      console.log('WebSocket message sent:', JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter((cb) => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }

  dispatchEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }
}

export default new WebSocketService();
