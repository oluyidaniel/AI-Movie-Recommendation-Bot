import { FilmIcon, PlusIcon, HistoryIcon, TrashIcon, LogoutIcon } from "@/components/Icons";

const Sidebar = ({
  isOpen, user, sortedChats, activeChatId,
  onNewChat, onSelectChat, onDeleteChat, onLogout,
}) => (
  <div style={{
    width: isOpen ? 256 : 0, minWidth: isOpen ? 256 : 0,
    overflow: "hidden",
    transition: "width 0.24s ease, min-width 0.24s ease",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex", flexDirection: "column",
    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(24px)",
    position: "relative", zIndex: 5, flexShrink: 0,
  }}>
    {/* Header */}
    <div style={{ padding: "16px 12px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13 }}>
        <div style={{ color: "#c9a84c", opacity: 0.85 }}><FilmIcon size={18} /></div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: "#c9a84c", letterSpacing: "0.04em" }}>CineAI</span>
      </div>
      <button className="new-chat-btn" onClick={onNewChat}>
        <PlusIcon /> New Chat
      </button>
    </div>

    {/* Chat list */}
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
      <div style={{ fontSize: 10, color: "rgba(201,168,76,0.32)", letterSpacing: "0.11em", padding: "4px 8px 8px", display: "flex", alignItems: "center", gap: 5 }}>
        <HistoryIcon /> HISTORY
      </div>

      {sortedChats.length === 0 && (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", padding: "6px 10px" }}>No chats yet.</p>
      )}

      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          className={`sidebar-chat-item${chat.id === activeChatId ? " active" : ""}`}
          onClick={() => onSelectChat(chat)}
        >
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 12.5, color: chat.id === activeChatId ? "#c9a84c" : "#bdb5a0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {chat.title || "Untitled"}
            </div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.18)", marginTop: 1 }}>
              {new Date((chat.updated_at || 0) * 1000).toLocaleDateString([], { month: "short", day: "numeric" })}
            </div>
          </div>
          <button
            className="delete-btn"
            onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,80,80,0.4)", padding: 3, display: "flex", borderRadius: 5, transition: "color 0.14s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,80,80,0.4)")}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>

    {/* User footer */}
    <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 29, height: 29, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#c9a84c", flexShrink: 0 }}>
        {user.username[0].toUpperCase()}
      </div>
      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {user.username}
      </span>
      <button
        onClick={onLogout}
        title="Sign out"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.22)", display: "flex", padding: 4, borderRadius: 5, transition: "color 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
      >
        <LogoutIcon />
      </button>
    </div>
  </div>
);

export default Sidebar;
