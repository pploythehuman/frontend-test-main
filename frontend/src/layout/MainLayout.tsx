import { useParams, useNavigate } from "react-router-dom";
import ChatInterface from "../feature/chat/ChatInterface";
import { chatService } from "../services";

function MainLayout() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!chatId) {
      try {
        const response = await chatService.createChat();
        navigate(`/chat/${response.chat_id}`);
      } catch (error) {
        console.error("Failed to create new chat:", error);
      }
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-md">
      <ChatInterface chatId={chatId} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default MainLayout;
