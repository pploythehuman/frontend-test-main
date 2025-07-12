import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  ArchiveBoxIcon,
  Bars3Icon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { ChatSummary } from "../types";
import FileUpload from "../feature/upload/FileUpload";
import FilesList from "../feature/upload/FilesList";
import SessionManager from "../feature/session/SessionManager";

interface AppSideBarProps {
  chats: ChatSummary[];
  loading: boolean;
  error: string | null;
  onNewChat: () => void;
  onClearHistory: () => void;
  onChatSelect: (chatId: string) => void;
}

export default function AppSideBar({
  chats,
  loading,
  error,
  onNewChat,
  onClearHistory,
  onChatSelect,
}: AppSideBarProps) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [filesRefreshTrigger, setFilesRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setFilesRefreshTrigger((prev) => prev + 1);
    setFileError(null);
  };

  const handleUploadError = (error: string) => {
    setFileError(error);
    setFileError(null)
  };

  const mainActions = [
    {
      icon: PlusIcon,
      label: "New Chat",
      onClick: onNewChat,
    },
    {
      icon: TrashIcon,
      label: "Clear Chat History",
      onClick: onClearHistory,
    },
  ];

  const formatChatTitle = (chat: ChatSummary): string => {
    if (chat.first_question) {
      return chat.first_question.length > 30
        ? chat.first_question.substring(0, 30) + "..."
        : chat.first_question;
    }
    return `Chat ${chat.chat_id.substring(0, 8)}...`;
  };

  return (
    <div className="flex h-full w-[250px] flex-col bg-neutral-100">
      <div className="flex items-center justify-between border-b border-neutral-200 p-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 rounded-full" />
          <span className="text-text-primary text-sm font-medium">ChatApp</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-tertiary hover:text-text-primary h-8 w-8 p-0 hover:bg-neutral-200"
        >
          <Bars3Icon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col border-b border-neutral-200 p-3">
        {mainActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={action.onClick}
            className="text-text-secondary hover:text-text-primary h-10 w-full justify-start gap-3 rounded-md px-3 hover:bg-neutral-200"
          >
            <action.icon className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}

        <div className="mt-2 border-t border-neutral-200 pt-2">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
          <FilesList
            onError={handleUploadError}
            refreshTrigger={filesRefreshTrigger}
          />
        </div>

        {fileError && (
          <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">
            {fileError}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase tracking-wider">
            Recent Chats
          </h3>

          {loading && (
            <div className="text-text-tertiary text-sm">Loading chats...</div>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}

          {!loading && !error && chats.length === 0 && (
            <div className="text-text-tertiary text-sm">No recent chats</div>
          )}

          {!loading && !error && chats.length > 0 && (
            <div className="space-y-4">
              {chats.map((chat) => (
                <Button
                  key={chat.chat_id}
                  variant="ghost"
                  onClick={() => onChatSelect(chat.chat_id)}
                  className="text-text-secondary hover:text-text-primary h-10 w-full justify-start rounded-md px-3 text-left hover:bg-neutral-200"
                >
                  <div className="flex w-full items-center gap-3">
                    <ChatBubbleLeftIcon className="text-text-tertiary h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {formatChatTitle(chat)}
                      </span>
                      <span className="text-text-tertiary text-xs">
                        {chat.message_count} message
                        {chat.message_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SessionManager />
    </div>
  );
}
