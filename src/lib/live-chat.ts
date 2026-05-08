// Sistema de Chat ao Vivo
// Em produção, usar Socket.io ou Firebase Realtime Database

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent';
  message: string;
  timestamp: string;
  read: boolean;
};

export type ChatSession = {
  id: string;
  userId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'closed';
  messages: ChatMessage[];
  startedAt: string;
  endedAt?: string;
};

export class LiveChatService {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private messageHandlers: Array<(message: ChatMessage) => void> = [];
  private statusHandlers: Array<(status: string) => void> = [];

  constructor() {
    // Em produção, conectar ao servidor WebSocket
    // this.connect();
  }

  connect() {
    // Simular conexão WebSocket
    // Em produção: const ws = new WebSocket('wss://api.planocerto.com.br/chat');
    
    console.log('Live chat connected (simulated)');
    
    // Simular eventos
    setTimeout(() => {
      this.notifyStatus('connected');
    }, 1000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.notifyStatus('disconnected');
  }

  async startSession(userId: string, userName: string): Promise<string> {
    // Em produção, fazer requisição ao servidor
    this.sessionId = Math.random().toString(36).substr(2, 9);
    
    const session: ChatSession = {
      id: this.sessionId,
      userId,
      status: 'waiting',
      messages: [],
      startedAt: new Date().toISOString(),
    };

    // Salvar localmente (em produção, enviar ao servidor)
    localStorage.setItem(`chat-session-${this.sessionId}`, JSON.stringify(session));
    
    // Simular mensagem de boas-vindas do agente
    setTimeout(() => {
      this.receiveMessage({
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'agent-1',
        senderName: 'Atendente',
        senderType: 'agent',
        message: 'Olá! Sou um atendente humano. Como posso ajudar?',
        timestamp: new Date().toISOString(),
        read: false,
      });
      this.notifyStatus('active');
    }, 2000);

    return this.sessionId;
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const chatMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'current-user',
      senderName: 'Você',
      senderType: 'user',
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Em produção, enviar via WebSocket
    // this.socket?.send(JSON.stringify(chatMessage));

    // Salvar localmente
    this.saveMessage(chatMessage);

    // Simular resposta do agente
    setTimeout(() => {
      this.simulateAgentResponse(message);
    }, 1000 + Math.random() * 2000);
  }

  private simulateAgentResponse(userMessage: string) {
    const responses = [
      'Entendo sua dúvida. Deixe-me verificar isso para você.',
      'Ótima pergunta! Vou te ajudar com isso.',
      'Claro! Posso te explicar melhor sobre isso.',
      'Vou buscar essas informações para você.',
      'Perfeito! Vou te passar os detalhes.',
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    this.receiveMessage({
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'agent-1',
      senderName: 'Atendente',
      senderType: 'agent',
      message: response,
      timestamp: new Date().toISOString(),
      read: false,
    });
  }

  private receiveMessage(message: ChatMessage) {
    this.saveMessage(message);
    this.messageHandlers.forEach(handler => handler(message));
  }

  private saveMessage(message: ChatMessage) {
    if (!this.sessionId) return;

    const sessionKey = `chat-session-${this.sessionId}`;
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      const session: ChatSession = JSON.parse(stored);
      session.messages.push(message);
      localStorage.setItem(sessionKey, JSON.stringify(session));
    }
  }

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
  }

  onStatusChange(handler: (status: string) => void) {
    this.statusHandlers.push(handler);
  }

  private notifyStatus(status: string) {
    this.statusHandlers.forEach(handler => handler(status));
  }

  async endSession() {
    if (!this.sessionId) return;

    const sessionKey = `chat-session-${this.sessionId}`;
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      const session: ChatSession = JSON.parse(stored);
      session.status = 'closed';
      session.endedAt = new Date().toISOString();
      localStorage.setItem(sessionKey, JSON.stringify(session));
    }

    this.sessionId = null;
    this.notifyStatus('closed');
  }

  getSessionHistory(sessionId: string): ChatSession | null {
    const stored = localStorage.getItem(`chat-session-${sessionId}`);
    return stored ? JSON.parse(stored) : null;
  }
}

export const liveChat = new LiveChatService();
