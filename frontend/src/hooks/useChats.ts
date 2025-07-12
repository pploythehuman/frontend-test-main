import { useState, useEffect, useCallback } from "react";
import { ChatSummary, AllChatsResponse } from "../types";
import { chatService } from "../services";
import { useSessionStore } from "../store/sessionStore";

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

  const { fetchStatus } = useSessionStore();

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

      fetchStatus();
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setState(prev => ({
        ...prev,
        error: "Failed to load chat history",
        loading: false,
      }));
    }
  }, [fetchStatus]);

  const refreshChats = useCallback(async () => {
    await fetchChats();
  }, [fetchChats]);

  const createNewChat = useCallback(async (): Promise<string | null> => {
    try {
      const response = await chatService.createChat();
      await refreshChats();
      fetchStatus();
      return response.chat_id;
    } catch (err) {
      console.error("Failed to create new chat:", err);
      setState(prev => ({
        ...prev,
        error: "Failed to create new chat",
      }));
      return null;
    }
  }, [refreshChats, fetchStatus]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    ...state,
    refreshChats,
    createNewChat,
  };
}; 