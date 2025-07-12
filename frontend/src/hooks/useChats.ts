import { useState, useEffect, useCallback } from "react";
import { ChatSummary, AllChatsResponse } from "../types";
import { chatService } from "../services";

interface UseChatState {
  chats: ChatSummary[];
  loading: boolean;
  error: string | null;
  totalSessions: number;
  totalMessages: number;
}

interface UseChatActions {
  refreshChats: () => Promise<void>;
  createNewChat: () => Promise<string | null>;
  resetChat: (chatId?: string) => Promise<void>;
}

type UseChatsReturn = UseChatState & UseChatActions;

export const useChats = (): UseChatsReturn => {
  const [state, setState] = useState<UseChatState>({
    chats: [],
    loading: true,
    error: null,
    totalSessions: 0,
    totalMessages: 0,
  });

  const fetchChats = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data: AllChatsResponse = await chatService.getAllChats();
      
      setState(prev => ({
        ...prev,
        chats: data.chats,
        totalSessions: data.total_sessions,
        totalMessages: data.total_messages,
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setState(prev => ({
        ...prev,
        error: "Failed to load chat history",
        loading: false,
      }));
    }
  }, []);

  const refreshChats = useCallback(async () => {
    await fetchChats();
  }, [fetchChats]);

  const createNewChat = useCallback(async (): Promise<string | null> => {
    try {
      const response = await chatService.createChat();
      await refreshChats(); // Refresh the list after creating
      return response.chat_id;
    } catch (err) {
      console.error("Failed to create new chat:", err);
      setState(prev => ({
        ...prev,
        error: "Failed to create new chat",
      }));
      return null;
    }
  }, [refreshChats]);

  const resetChat = useCallback(async (chatId?: string): Promise<void> => {
    try {
      await chatService.resetChat(chatId);
      await refreshChats(); // Refresh the list after reset
    } catch (err) {
      console.error("Failed to reset chat:", err);
      setState(prev => ({
        ...prev,
        error: "Failed to reset chat",
      }));
    }
  }, [refreshChats]);

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    ...state,
    refreshChats,
    createNewChat,
    resetChat,
  };
}; 