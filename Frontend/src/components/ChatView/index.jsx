import { useState } from "react";
import { FilmIcon, MenuIcon, SendIcon } from "@/components/Icons";
import MessageBubble from "@/components/MessageBubble";
import TypingDots    from "@/components/TypingDots";
import { SUGGESTED_PROMPTS } from "@/constants/prompts";

const ChatView = ({
  activeChatTitle, messages, loading, showSuggestions,
  ragInfo, inputRef, bottomRef, onToggleSidebar, onSendMessage,
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Topbar */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:11, flexShrink:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(16px)" }}>
        <button className="toggle-btn" onClick={onToggleSidebar}><MenuIcon/></button>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ color:"#c9a84c", opacity:0.75 }}><FilmIcon size={18}/></div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#c9a84c", letterSpacing:"0.03em", maxWidth:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {activeChatTitle}
          </span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          {/* RAG badge */}
          {ragInfo?.ragUsed && (
            <span style={{ fontSize:10, background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.25)", color:"rgba(201,168,76,0.7)", padding:"3px 8px", borderRadius:10, letterSpacing:"0.06em" }}>
              RAG
            </span>
          )}
          {ragInfo?.model && (
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {ragInfo.model}
            </span>
          )}
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }}/>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg}/>)}

          {loading && (
            <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#c9a84c", flexShrink:0 }}>
                <FilmIcon size={16}/>
              </div>
              <div style={{ padding:"11px 15px", borderRadius:"16px 16px 16px 3px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <TypingDots/>
              </div>
            </div>
          )}

          {showSuggestions && messages.length <= 1 && (
            <div className="fade-up-delayed" style={{ marginTop:18 }}>
              <p style={{ fontSize:10.5, color:"rgba(201,168,76,0.32)", letterSpacing:"0.1em", marginBottom:10 }}>TRY ASKING</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {SUGGESTED_PROMPTS.map((s) => (
                  <button key={s} className="chip-btn" onClick={() => onSendMessage(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{ padding:"12px 16px 15px", borderTop:"1px solid rgba(255,255,255,0.05)", background:"rgba(0,0,0,0.4)", backdropFilter:"blur(16px)", flexShrink:0 }}>
        <div style={{ maxWidth:780, margin:"0 auto", display:"flex", gap:9, alignItems:"flex-end" }}>
          <textarea
            ref={inputRef} rows={1} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleSend(); }}}
            placeholder="Ask for a film, a mood, or a genre…"
            style={{ flex:1, padding:"11px 14px", borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"#e8e0d0", fontSize:14, fontFamily:"'DM Sans',sans-serif", resize:"none", lineHeight:1.55, minHeight:44, maxHeight:120, overflowY:"auto", transition:"border-color 0.2s" }}
            onFocus={(e) => (e.target.style.borderColor="rgba(201,168,76,0.32)")}
            onBlur={(e)  => (e.target.style.borderColor="rgba(255,255,255,0.07)")}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading||!input.trim()}>
            <SendIcon/>
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:7, fontSize:10.5, color:"rgba(255,255,255,0.11)" }}>
          Powered by Llama 3 · Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatView;
