import { FilmIcon } from "@/components/Icons";

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 14,
      }}
    >
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          marginRight: 9, marginTop: 2,
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#c9a84c",
        }}>
          <FilmIcon size={16} />
        </div>
      )}
      <div style={{
        maxWidth: "72%", padding: "11px 15px",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        fontSize: 14, lineHeight: 1.72,
        fontFamily: "'EB Garamond', Georgia, serif",
        borderRadius: isUser ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
        background: isUser
          ? "linear-gradient(135deg, #c9a84c 0%, #8b6914 100%)"
          : "rgba(255,255,255,0.04)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
        color: isUser ? "#0a0800" : "#ddd5c0",
        boxShadow: isUser
          ? "0 4px 24px rgba(201,168,76,0.18)"
          : "0 2px 10px rgba(0,0,0,0.4)",
      }}>
        {msg.content}
      </div>
    </div>
  );
};

export default MessageBubble;
