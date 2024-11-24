class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:3002');
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data);
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 1000);
    };
  }

  subscribe(endpoint, callback) {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set());
    }
    this.subscribers.get(endpoint).add(callback);
    return () => this.subscribers.get(endpoint).delete(callback);
  }

  notifySubscribers(data) {
    const { endpoint, type } = data;
    const subscribers = this.subscribers.get(endpoint);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }
}

export const wsService = new WebSocketService(); 