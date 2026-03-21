import { useState, useCallback } from "react";

export function useChats() {
  const [chats,   setChats]   = useState([]);
  const [loading, setLoading] = useState(false);

  const loadChats = useCallback(async () => {
    setLoading(true);
    try {
      setChats(list);
      return list;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteChat = useCallback(async (chatId) => {
    await chatsApi.delete(chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
  }, []);

  // Called after a reply comes back so title refreshes in sidebar
  const refreshChat = useCallback((chatId, updatedFields) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, ...updatedFields, updated_at: Math.floor(Date.now() / 1000) } : c
      )
    );
  }, []);

  const addChat = useCallback((chat) => {
    setChats((prev) => {
      const exists = prev.some((c) => c.id === chat.id);
      return exists ? prev : [chat, ...prev];
    });
  }, []);

  const sortedChats = [...chats].sort((a, b) => b.updated_at - a.updated_at);

  return { chats, sortedChats, loading, loadChats, deleteChat, refreshChat, addChat };
}
