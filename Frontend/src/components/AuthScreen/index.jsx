import { useState } from "react";
import { FilmIcon, EyeIcon } from "@/components/Icons";

const AuthScreen = ({ onLogin, onRegister }) => {
  const [mode,     setMode]     = useState("login");


  const [showPw,   setShowPw]   = useState(false);

  
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
          
          {/* MODE SWITCH (STILL WORKS - UI ONLY) */}
          <div style={{ display:"flex", background:"rgba(0,0,0,0.45)", borderRadius:10, padding:3, marginBottom:22 }}>
            {["login","signup"].map((m) => (
              <button key={m} className={`auth-tab ${mode===m?"active":"inactive"}`} onClick={() => { setMode(m); /* setError(""); */ }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* USERNAME INPUT (DISABLED STATE) */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, color:"rgba(201,168,76,0.45)", letterSpacing:"0.1em", marginBottom:6 }}>USERNAME</label>
            <input
              
              type="text"
              placeholder="your_username"
              autoComplete="username"
              style={{ ...inputStyle, padding:"11px 13px" }}
            />
          </div>

          {/* PASSWORD INPUT (VISIBILITY TOGGLE STILL WORKS) */}
          <div style={{ marginBottom:8, position:"relative" }}>
            <label style={{ display:"block", fontSize:11, color:"rgba(201,168,76,0.45)", letterSpacing:"0.1em", marginBottom:6 }}>PASSWORD</label>
            <input
              
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ ...inputStyle, padding:"11px 40px 11px 13px" }}
            />
            <button
              onClick={()=>setShowPw(v=>!v)}
              style={{ position:"absolute", right:12, top:34, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", padding:0, display:"flex", alignItems:"center" }}
            >
              <EyeIcon visible={showPw}/>
            </button>
          </div>

          {/* ERROR DISPLAY (DISABLED) */}
          

          {/* SUBMIT BUTTON (NO ACTION) */}
          <button
           
            style={{ width:"100%", marginTop:16, padding:"12px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#c9a84c,#8b6914)", cursor:"pointer", color:"#0a0800", fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em" }}
          >
           
            {mode==="login" ? "Enter the Cinema" : "Start Watching"}
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