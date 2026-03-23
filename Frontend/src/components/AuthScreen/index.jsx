import { useState } from "react";
import { FilmIcon, EyeIcon } from "@/components/Icons";

const AuthScreen = ({ onLogin, onRegister }) => {
  const [mode,     setMode]     = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    setBusy(true);
    try {
      if (mode === "signup") await onRegister(username.trim(), password);
      else await onLogin(username.trim(), password);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    width:"100%", borderRadius:10, background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.09)", color:"#e8e0d0", fontSize:14,
    fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color 0.2s",
    boxSizing:"border-box",
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#000", overflow:"hidden", position:"relative", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 55% at 50% -5%, rgba(201,168,76,0.09) 0%, transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 55% at 95% 95%, rgba(130,50,0,0.11) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 40% 40% at 0% 55%, rgba(50,0,80,0.08) 0%, transparent 55%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.007) 2px,rgba(255,255,255,0.007) 4px)", pointerEvents:"none" }}/>

      <div className="fade-up" style={{ width:"100%", maxWidth:380, padding:"0 20px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:34 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8 }}>
            <div style={{ color:"#c9a84c" }}><FilmIcon size={22}/></div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:600, color:"#c9a84c", letterSpacing:"0.04em" }}>CineAI</span>
          </div>
          <p style={{ color:"rgba(201,168,76,0.4)", fontSize:11, letterSpacing:"0.14em" }}>YOUR PERSONAL FILM ORACLE</p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"28px 26px 24px", backdropFilter:"blur(20px)" }}>
          <div style={{ display:"flex", background:"rgba(0,0,0,0.45)", borderRadius:10, padding:3, marginBottom:22 }}>
            {["login","signup"].map((m) => (
              <button key={m} className={`auth-tab ${mode===m?"active":"inactive"}`} onClick={() => { setMode(m); setError(""); }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, color:"rgba(201,168,76,0.45)", letterSpacing:"0.1em", marginBottom:6 }}>USERNAME</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&handleSubmit()} type="text" placeholder="your_username" autoComplete="username"
              style={{ ...inputStyle, padding:"11px 13px" }}
              onFocus={(e)=>(e.target.style.borderColor="rgba(201,168,76,0.4)")}
              onBlur={(e)=>(e.target.style.borderColor="rgba(255,255,255,0.09)")}
            />
          </div>

          <div style={{ marginBottom:8, position:"relative" }}>
            <label style={{ display:"block", fontSize:11, color:"rgba(201,168,76,0.45)", letterSpacing:"0.1em", marginBottom:6 }}>PASSWORD</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&handleSubmit()} type={showPw?"text":"password"} placeholder="••••••••" autoComplete={mode==="signup"?"new-password":"current-password"}
              style={{ ...inputStyle, padding:"11px 40px 11px 13px" }}
              onFocus={(e)=>(e.target.style.borderColor="rgba(201,168,76,0.4)")}
              onBlur={(e)=>(e.target.style.borderColor="rgba(255,255,255,0.09)")}
            />
            <button onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:12, top:34, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", padding:0, display:"flex", alignItems:"center" }}>
              <EyeIcon visible={showPw}/>
            </button>
          </div>

          {error && <p style={{ color:"#f87171", fontSize:12.5, margin:"6px 0 2px", textAlign:"center" }}>{error}</p>}

          <button onClick={handleSubmit} disabled={busy}
            style={{ width:"100%", marginTop:16, padding:"12px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#c9a84c,#8b6914)", cursor:busy?"not-allowed":"pointer", color:"#0a0800", fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em", opacity:busy?0.6:1, transition:"all 0.18s" }}
            onMouseEnter={(e)=>!busy&&(e.target.style.transform="translateY(-1px)")}
            onMouseLeave={(e)=>(e.target.style.transform="translateY(0)")}
          >
            {busy ? "Please wait…" : mode==="login" ? "Enter the Cinema" : "Start Watching"}
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:14, fontSize:11, color:"rgba(255,255,255,0.15)" }}>
          Accounts stored securely on the server with hashed passwords.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
