export interface ChatSummary {
  chat_id: string;
  message_count: number;
  first_question?: string;
  last_message_time?: string;
}

export interface AllChatsResponse {
  chats: ChatSummary[];
  total_sessions: number;
  total_messages: number;
}

export interface ChatResponse {
  answer: string;
  source: string;
  id: string;
  timestamp: string;
  chat_id: string;
}

export interface CreateChatResponse {
  chat_id: string;
  message: string;
}

export interface ResetResponse {
  message: string;
  session_id: string;
  chat_id?: string;
}

export interface StatusResponse {
  has_memory: boolean;
  session_id: string;
  uploaded_files_count: number;
  chat_history_count: number;
  chat_sessions_count: number;
}

export interface UploadResponse {
  message: string;
  files: Array<{
    filename: string;
    size: number;
    upload_time: string;
    id: string;
  }>;
}

export interface FilesResponse {
  files: Array<{
    filename: string;
    size: number;
    upload_time: string;
    id: string;
  }>;
  total_files: number;
  total_size_bytes: number;
} 