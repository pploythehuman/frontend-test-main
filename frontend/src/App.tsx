import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AppSideBar from "./layout/AppSideBar";
import MainLayout from "./layout/MainLayout";
import { useChats } from "./hooks";

function AppContent() {
  const navigate = useNavigate();
  const { 
    chats, 
    loading, 
    error, 
    createNewChat, 
    resetChat,
  } = useChats();

  const handleNewChat = async () => {
    console.log("Creating new chat...");
    const newChatId = await createNewChat();
    if (newChatId) {
      console.log("New chat created:", newChatId);
      navigate("/");
    }
  };

  const handleClearHistory = async () => {
    console.log("Clearing chat history...");
    await resetChat();
  };

  const handleChatSelect = (chatId: string) => {
    console.log("Selected chat:", chatId);
    navigate(`/chat/${chatId}`);
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
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/chat/:chatId" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
