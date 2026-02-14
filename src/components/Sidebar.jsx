import { Avatar } from "./common";
import { AI_SUGGESTIONS } from "../data/mockData";

function AiSuggestionCard({ suggestion, user }) {
  const text = suggestion.text
    .replace("{condition}", user.conditions?.[0] || "neurologic care")
    .replace("{region}", user.region || "your region")
    .replace("{location}", user.location || "your area");

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #1a233208, #c5a24d08)",
        border: "1px solid #c5a24d20",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #1a233212, #c5a24d12)")}
      onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #1a233208, #c5a24d08)")}
    >
      <span style={{ fontSize: 16, color: "#c5a24d", marginTop: 1 }}>{suggestion.icon}</span>
      <div>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5, color: "#3a3428", lineHeight: 1.5, margin: 0 }}>
          {text}
        </p>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#c5a24d", fontWeight: 600, marginTop: 4, display: "inline-block" }}>
          AI Insight →
        </span>
      </div>
    </div>
  );
}

export function Sidebar({ user, posts }) {
  const trendingConditions = [...new Set(posts.flatMap((p) => p.conditions || []))].slice(0, 5);
  const priorityCount = posts.filter((p) => p.aanPriority).length;
  const endorsedCount = posts.filter((p) => p.aanEndorsed).length;
  const userInitials = user.name?.split(" ").map((n) => n[0]).join("") || "AM";

  return (
    <div style={{ width: 300, flexShrink: 0 }}>
      {/* Profile Card */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "24px", border: "1px solid #e8e4df", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Avatar initials={userInitials} role={user.role} size={46} />
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#1a2332" }}>{user.name}</div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>
              {user.role === "aan" ? "AAN Member" : "Community Member"} · {user.location}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(user.conditions || []).map((c) => (
            <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: "#7a746b", background: "#f4f2ef", padding: "3px 10px", borderRadius: 20 }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", border: "1px solid #e8e4df", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ color: "#c5a24d", fontSize: 14 }}>✦</span>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700, color: "#1a2332", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
            Suggested for You
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_SUGGESTIONS.map((s) => (
            <AiSuggestionCard key={s.id} suggestion={s} user={user} />
          ))}
        </div>
      </div>

      {/* Community Pulse */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", border: "1px solid #e8e4df" }}>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700, color: "#1a2332", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 14px" }}>
          Community Pulse
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#7a746b" }}>Priority Needs</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#d4764e" }}>{priorityCount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#7a746b" }}>AAN Endorsed</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#c5a24d" }}>{endorsedCount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#7a746b" }}>Active Posts</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700, color: "#1a2332" }}>{posts.length}</span>
          </div>
          <div style={{ borderTop: "1px solid #f0ece7", paddingTop: 12, marginTop: 4 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>
              Trending Conditions
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {trendingConditions.map((c) => (
                <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.5, color: "#5b7fb8", background: "#5b7fb812", padding: "3px 10px", borderRadius: 20 }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
