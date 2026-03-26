import { useState, useCallback, useEffect } from "react";

import AuthScreen from "@/components/AuthScreen";
import Sidebar    from "@/components/Sidebar";
import ChatView   from "@/components/ChatView"; 

import { useAuth }       from "@/hooks/useAuth";
import { useChats }      from "@/hooks/useChats";
import { useActiveChat } from "@/hooks/useActiveChat";

const BG = {
  background: "#000",
  backgroundImage: [
    "radial-gradient(ellipse 90% 50% at 50% -8%,  rgba(201,168,76,0.08) 0%, transparent 62%)",
    "radial-gradient(ellipse 55% 55% at 96% 96%,  rgba(41, 32, 27, 0.1)   0%, transparent 58%)",
    "radial-gradient(ellipse 40% 45% at 2%  60%,  rgba(50,0,80,0.08)    0%, transparent 52%)",
    "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.006) 2px,rgba(255,255,255,0.006) 4px)",
  ].join(","),
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user, authLoading, login, register, logout } = useAuth();

  const {
    sortedChats,
    loadChats,
    deleteChat,
    refreshChat,
    addChat,
  } = useChats();

  const {
    messages,
    activeChatId,
    loading,
    showSuggestions,
    ragInfo,
    inputRef,
    bottomRef,
    openChat,
    startNewChat,
    sendMessage,
  } = useActiveChat({
    onChatCreated: (chat) => addChat(chat),
    onChatUpdated: (chatId, fields) => refreshChat(chatId, fields),
  });

  // Load chats & open most recent when user logs in
  useEffect(() => {
    if (!user) return;
    loadChats().then((list) => {
      if (list.length > 0) {
        openChat(list[0]);
      } else {
        startNewChat({ name: user.username });
      }
    });
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    logout();
    startNewChat();
  };

  const handleNewChat = useCallback(() => {
    startNewChat();
  }, [startNewChat]);

  const handleSelectChat = useCallback((chat) => {
    openChat(chat);
    if (window.innerWidth < 680) setSidebarOpen(false);
  }, [openChat]);

  const handleDeleteChat = useCallback(async (chatId) => {
    await deleteChat(chatId);
    if (chatId === activeChatId) {
      const remaining = sortedChats.filter((c) => c.id !== chatId);
      if (remaining.length > 0) openChat(remaining[0]);
      else startNewChat({ name: user?.username });
    }
  }, [activeChatId, sortedChats, deleteChat, openChat, startNewChat, user]);

  if (authLoading) {
    return (
      <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#000" }}>
        <div style={{ color:"rgba(201,168,76,0.5)", fontFamily:"'DM Sans',sans-serif", fontSize:13, letterSpacing:"0.1em" }}>
          LOADING…
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={login} onRegister={register} />;
  }

  const activeChatTitle = sortedChats.find((c) => c.id === activeChatId)?.title || "New Conversation";

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", ...BG, fontFamily:"'DM Sans',sans-serif", color:"#e8e0d0" }}>
      <Sidebar
        isOpen={sidebarOpen}
        user={user}
        sortedChats={sortedChats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
      />
      <ChatView
        activeChatTitle={activeChatTitle}
        messages={messages}
        loading={loading}
        showSuggestions={showSuggestions}
        ragInfo={ragInfo}
        inputRef={inputRef}
        bottomRef={bottomRef}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
