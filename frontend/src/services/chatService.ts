import {
  AllChatsResponse,
  ChatResponse,
  CreateChatResponse,
  ResetResponse,
  StatusResponse,
  UploadResponse,
  FilesResponse,
} from "../types/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

class ChatService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }

  async getAllChats(): Promise<AllChatsResponse> {
    return this.request<AllChatsResponse>("/api/chat");
  }

  async getChatHistory(chatId: string): Promise<any> {
    return this.request(`/api/chat/${chatId}`);
  }

  async createChat(): Promise<CreateChatResponse> {
    return this.request<CreateChatResponse>("/api/chat/create", {
      method: "POST",
    });
  }

  async sendMessage(question: string, chatId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question, chat_id: chatId }),
    });
  }

  async resetChat(chatId?: string): Promise<ResetResponse> {
    return this.request<ResetResponse>("/api/reset", {
      method: "POST",
      body: JSON.stringify({ chat_id: chatId }),
    });
  }

  async uploadFiles(files: FileList): Promise<UploadResponse> {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getFiles(): Promise<FilesResponse> {
    return this.request<FilesResponse>("/api/files");
  }

  async getStatus(): Promise<StatusResponse> {
    return this.request<StatusResponse>("/api/status");
  }

  async healthCheck(): Promise<any> {
    return this.request("/health");
  }
}

export const chatService = new ChatService();
export default chatService;
