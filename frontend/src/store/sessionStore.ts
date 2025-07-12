import { create } from 'zustand';
import { chatService } from '../services/chatService';

interface SessionState {
  hasMemory: boolean;
  sessionId: string | null;
  uploadedFilesCount: number;
  chatHistoryCount: number;
  chatSessionsCount: number;
  loading: boolean;
  error: string | null;
}

interface SessionActions {
  fetchStatus: () => Promise<void>;
  clearError: () => void;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>((set, get) => ({
  hasMemory: false,
  sessionId: null,
  uploadedFilesCount: 0,
  chatHistoryCount: 0,
  chatSessionsCount: 0,
  loading: false,
  error: null,

  fetchStatus: async () => {
    try {
      set({ loading: true, error: null });
      const response = await chatService.getStatus();
      set({
        hasMemory: response.has_memory,
        sessionId: response.session_id,
        uploadedFilesCount: response.uploaded_files_count,
        chatHistoryCount: response.chat_history_count,
        chatSessionsCount: response.chat_sessions_count,
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
})); 