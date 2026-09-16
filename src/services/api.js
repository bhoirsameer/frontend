// src/services/api.js

class ApiService {
  constructor() {
    // Read API base URL from environment variable VITE_API_BASE_URL (configured in .env)
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8005';
    this.sessionId = localStorage.getItem('chatbot_session_id') || null;
    this.onSessionRotatedCallback = null;
  }

  setSessionId(id) {
    this.sessionId = id;
    if (id) {
      localStorage.setItem('chatbot_session_id', id);
    } else {
      localStorage.removeItem('chatbot_session_id');
    }
  }

  getSessionId() {
    return this.sessionId;
  }

  setOnSessionRotated(callback) {
    this.onSessionRotatedCallback = callback;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    }

    try {
      const response = await fetch(url, { ...options, headers });

      const returnedSessionId = response.headers.get('X-Session-ID');
      const wasRotated = response.headers.get('X-Session-Rotated') === 'true';

      if (returnedSessionId && returnedSessionId !== this.sessionId) {
        this.setSessionId(returnedSessionId);
        if (wasRotated && this.onSessionRotatedCallback) {
          this.onSessionRotatedCallback(returnedSessionId);
        }
      }

      if (response.status === 401) {
        this.setSessionId(null);
        const err = await response.json().catch(() => ({ detail: 'Unauthorized' }));
        throw new Error(err.detail || 'Session expired');
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Error' }));
        throw new Error(err.detail || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async register(username, password) {
    const data = await this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data?.session?.session_id) {
      this.setSessionId(data.session.session_id);
    }
    return data;
  }

  async login(username, password) {
    const data = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data?.session?.session_id) {
      this.setSessionId(data.session.session_id);
    }
    return data;
  }

  async logout() {
    try {
      await this.request('/api/logout', { method: 'POST' });
    } catch (e) {}
    this.setSessionId(null);
  }

  async getCurrentUser() {
    if (!this.sessionId) return null;
    return await this.request('/api/me', { method: 'GET' });
  }

  async sendMessage(message, chatId = null) {
    const body = { message };
    if (chatId) body.chat_id = chatId;
    return await this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Streaming version of sendMessage: instead of resolving once with the full
  // reply, it calls back as the reply is generated so the UI can render it
  // token-by-token. Server-Sent Events, so parsed by hand rather than
  // response.json() (fetch/EventSource don't support this natively here
  // because we need a POST body and a custom X-Session-ID header).
  async sendMessageStream(message, chatId, { onStart, onToken, onDone, onError } = {}) {
    const url = `${this.baseUrl}/api/chat/stream`;
    const headers = { 'Content-Type': 'application/json' };
    if (this.sessionId) headers['X-Session-ID'] = this.sessionId;

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(chatId ? { message, chat_id: chatId } : { message })
      });
    } catch (err) {
      onError && onError(err);
      return;
    }

    // Keep session-id / rotation handling consistent with request().
    const returnedSessionId = response.headers.get('X-Session-ID');
    const wasRotated = response.headers.get('X-Session-Rotated') === 'true';
    if (returnedSessionId && returnedSessionId !== this.sessionId) {
      this.setSessionId(returnedSessionId);
      if (wasRotated && this.onSessionRotatedCallback) {
        this.onSessionRotatedCallback(returnedSessionId);
      }
    }

    if (response.status === 401) {
      this.setSessionId(null);
      onError && onError(new Error('Session expired'));
      return;
    }

    if (!response.ok || !response.body) {
      const err = await response.json().catch(() => ({ detail: 'Request failed' }));
      onError && onError(new Error(err.detail || 'Request failed'));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE messages are separated by a blank line.
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        let eventType = 'message';
        let dataLine = '';
        for (const line of rawEvent.split('\n')) {
          if (line.startsWith('event: ')) eventType = line.slice(7).trim();
          else if (line.startsWith('data: ')) dataLine = line.slice(6);
        }
        if (!dataLine) continue;

        const data = JSON.parse(dataLine);
        if (eventType === 'start') onStart && onStart(data);
        else if (eventType === 'token') onToken && onToken(data.content);
        else if (eventType === 'error') onError && onError(new Error(data.detail));
        else if (eventType === 'done') onDone && onDone(data);
      }
    }
  }

  async getHistory(chatId = null) {
    const query = chatId ? `?chat_id=${encodeURIComponent(chatId)}` : '';
    return await this.request(`/api/history${query}`, { method: 'GET' });
  }

  async getThreads() {
    return await this.request('/api/threads', { method: 'GET' });
  }

  async deleteThread(chatId) {
    return await this.request('/api/delete-thread', {
      method: 'POST',
      body: JSON.stringify({ chat_id: chatId })
    });
  }

  async testRotateSession() {
    return await this.request('/api/rotate-session-test', { method: 'POST' });
  }
}


export const api = new ApiService();
