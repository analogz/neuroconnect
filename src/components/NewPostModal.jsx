import { useState } from "react";
import { CONDITIONS, POST_TYPES } from "../data/mockData";

export function NewPostModal({ user, onClose, onSubmit, fullScreen }) {
  const [type, setType] = useState("need");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [location, setLocation] = useState(user?.location || "");

  const toggleCondition = (c) =>
    setSelectedConditions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    onSubmit({ type, title, body, conditions: selectedConditions, location });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #e8e4df",
    fontSize: 14,
    fontFamily: "'Manrope', sans-serif",
    background: "#faf9f7",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: fullScreen ? "#fff" : "#1a233260",
        backdropFilter: fullScreen ? "none" : "blur(8px)",
        display: "flex",
        alignItems: fullScreen ? "stretch" : "center",
        justifyContent: "center",
        zIndex: 100,
        padding: fullScreen ? 0 : 24,
      }}
      onClick={fullScreen ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: fullScreen ? 0 : 24,
          padding: fullScreen ? "16px 20px" : "32px 36px",
          maxWidth: fullScreen ? "100%" : 580,
          width: "100%",
          maxHeight: fullScreen ? "100%" : "85vh",
          overflow: "auto",
          boxShadow: fullScreen ? "none" : "0 24px 64px #1a233230",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: fullScreen ? 16 : 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: fullScreen ? 22 : 26, fontWeight: 600, color: "#1a2332", margin: 0 }}>New Post</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#9a9488", cursor: "pointer", padding: 4 }}>✕</button>
        </div>

        <div style={{ marginBottom: fullScreen ? 14 : 20 }}>
          <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>Post Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(POST_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                style={{
                  padding: fullScreen ? "7px 14px" : "8px 16px",
                  borderRadius: 50,
                  border: type === key ? `2px solid ${val.color}` : "1px solid #e8e4df",
                  background: type === key ? val.color + "12" : "#fff",
                  color: type === key ? val.color : "#7a746b",
                  fontSize: fullScreen ? 12.5 : 13,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {val.icon} {val.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A clear, descriptive title" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#c5a24d")} onBlur={(e) => (e.target.style.borderColor = "#e8e4df")} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>Details</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the need, initiative, or resource in detail..." rows={fullScreen ? 4 : 5} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#c5a24d")} onBlur={(e) => (e.target.style.borderColor = "#e8e4df")} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State or Region" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#c5a24d")} onBlur={(e) => (e.target.style.borderColor = "#e8e4df")} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>Related Conditions</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 50,
                  border: selectedConditions.includes(c) ? "2px solid #1a2332" : "1px solid #d4cfc8",
                  background: selectedConditions.includes(c) ? "#1a2332" : "#fff",
                  color: selectedConditions.includes(c) ? "#fff" : "#7a746b",
                  fontSize: 12.5,
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            background: title.trim() && body.trim() ? "#1a2332" : "#d4cfc8",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Manrope', sans-serif",
            border: "none",
            cursor: title.trim() && body.trim() ? "pointer" : "default",
            transition: "background 0.2s",
            marginTop: "auto",
          }}
        >
          Publish Post
        </button>
      </div>
    </div>
  );
}
