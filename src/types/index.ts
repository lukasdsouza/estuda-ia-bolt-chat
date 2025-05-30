
export interface Curso {
  id: string;
  nome: string;
  descricao: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  cursoId: string;
  googleDriveFolderId: string;
  descricaoBreve: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
}
