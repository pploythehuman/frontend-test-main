import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AppSideBar from "./layout/AppSideBar";
import MainLayout from "./layout/MainLayout";
import { useChats } from "./hooks";
import { chatService } from "./services";

function AppContent() {
  const navigate = useNavigate();
  const { chats, loading, error, createNewChat, refreshChats } = useChats();

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
    }
  };

  const handleClearHistory = async () => {
    await chatService.resetChat();
    await refreshChats();
    navigate("/");
  };

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
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
