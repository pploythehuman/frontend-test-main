import React, { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { chatService } from "../services";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: string;
}

interface ChatInterfaceProps {
  chatId?: string;
  onSendMessage?: (message: string) => void;
}

export default function ChatInterface({
  chatId,
  onSendMessage,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatId) {
      loadChatHistory(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  const loadChatHistory = async (chatId: string) => {
    try {
      const history = await chatService.getChatHistory(chatId);
      if (history.messages && Array.isArray(history.messages)) {
        const formattedMessages: Message[] = history.messages
          .map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            role: "user", 
            content: msg.question,
            timestamp: msg.timestamp,
          }))
          .concat(
            history.messages.map((msg: any) => ({
              id: msg.id + "_answer",
              role: "assistant",
              content: msg.answer,
              timestamp: msg.timestamp,
              source: msg.source,
            })),
          )
          .sort(
            (a: Message, b: Message) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(messageText, chatId);

      const assistantMessage: Message = {
        id: response.id,
        role: "assistant",
        content: response.answer,
        timestamp: response.timestamp,
        source: response.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (onSendMessage) {
        await onSendMessage(messageText);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <ChatBubbleLeftRightIcon className="text-text-secondary h-16 w-16" />
              </div>
              <h2 className="text-text-secondary mb-2 text-xl font-normal">
                How can I help you today?
              </h2>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "text-text-primary bg-neutral-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </p>
                  {message.source && (
                    <p className="text-text-tertiary mt-1 text-xs">
                      Source: {message.source}
                    </p>
                  )}
                  <p
                    className={`mt-1 text-xs ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-text-tertiary"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-neutral-100 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-400"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-400 delay-100"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-400 delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyPress}
            onKeyDown={handleKeyPress}
            placeholder="How can I help you today?"
            disabled={isLoading}
            className="flex-1 bg-stone-100 border-neutral-200" 
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
