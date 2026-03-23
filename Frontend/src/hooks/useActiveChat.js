import { useState, useRef, useEffect, useCallback } from "react";
import { chats as chatsApi } from "@/lib/api";

const WELCOME = (name) =>
  `🎬 Welcome back, ${name}!\n\nWhat are we watching tonight? Tell me your mood, a genre, or a film you love — I'll find your next obsession.`;

const WELCOME_NEW = "🎬 New session — what are you in the mood for tonight?";

export function useActiveChat({ onChatCreated, onChatUpdated }) {
  const [messages,        setMessages]        = useState([]);
  const [activeChatId,    setActiveChatId]    = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [ragInfo,         setRagInfo]         = useState(null);

  const inputRef  = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const openChat = useCallback(async (chat) => {
    setActiveChatId(chat.id);
    setShowSuggestions(false);
    setMessages([]);           // show blank while loading
    try {
      const { messages: history } = await chatsApi.messages(chat.id);
      setMessages(history.map((m) => ({ role: m.role, content: m.content })));
    } catch {
      setMessages([{ role: "assistant", content: "Could not load this conversation." }]);
    }
  }, []);

  const startNewChat = useCallback(({ name = "" } = {}) => {
    setActiveChatId(null);
    setMessages([{ role: "assistant", content: name ? WELCOME(name) : WELCOME_NEW }]);
    setShowSuggestions(true);
    setRagInfo(null);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    setShowSuggestions(false);
    const userMsg = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { chatId, reply, model, ragUsed, sources } = await chatsApi.send(
        activeChatId,
        content
      );

      // If this was a new chat, register it
      if (!activeChatId) {
        setActiveChatId(chatId);
        onChatCreated?.({ id: chatId, title: content.slice(0, 45), updated_at: Math.floor(Date.now() / 1000) });
      } else {
        onChatUpdated?.(chatId, { title: content.slice(0, 45) });
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setRagInfo({ model, ragUsed, sources });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `The projection booth went dark.\n\n_${err.message}_` },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [activeChatId, loading, onChatCreated, onChatUpdated]);

  return {
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
  };
}
