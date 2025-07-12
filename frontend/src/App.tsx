import { useState } from "react";
import AppSideBar from "./layout/AppSideBar";
import MainLayout from "./layout/MainLayout";
import { useChats } from "./hooks";

function App() {
  const { 
    chats, 
    loading, 
    error, 
    createNewChat, 
    resetChat,
    refreshChats 
  } = useChats();

  const handleNewChat = async () => {
    console.log("Creating new chat...");
    const newChatId = await createNewChat();
    if (newChatId) {
      console.log("New chat created:", newChatId);
      // TODO: Create a new chat + navigate
    }
  };

  const handleClearHistory = async () => {
    console.log("Clearing chat history...");
    await resetChat();
  };

  const handleChatSelect = (chatId: string) => {
    console.log("Selected chat:", chatId);
    // TODO: Navigate to chat
  };

  const handleArtifacts = () => {
    console.log("Opening artifacts...");
    // TODO: Navigate to artifacts
  };

  return (
    <div className="flex h-screen gap-4 bg-neutral-100 p-4">
      <AppSideBar 
        chats={chats}
        loading={loading}
        error={error}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onChatSelect={handleChatSelect}
        onArtifacts={handleArtifacts}
      />
      <MainLayout />
    </div>
  );
}

export default App;
