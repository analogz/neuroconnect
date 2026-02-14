import { Avatar, Icon } from "./common";
import { AI_SUGGESTIONS } from "../data/mockData";
import { LogOut, Sparkles } from "lucide-react";

function AiSuggestionCard({ suggestion, user }) {
  const text = suggestion.text
    .replace("{condition}", user.conditions?.[0] || "neurologic care")
    .replace("{region}", user.region || "your region")
    .replace("{location}", user.location || "your area");

  return (
    <div
      className="card-interactive"
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #1a233208, #c5a24d08)",
        border: "1px solid #c5a24d20",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        boxShadow: "none",
      }}
    >
      <Icon name={suggestion.icon} size={16} style={{ color: "var(--color-gold)", marginTop: 1, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 14, color: "#3a3428", lineHeight: 1.5, margin: 0 }}>
          {text}
        </p>
        <span style={{ fontSize: 11, color: "var(--color-gold)", fontWeight: 600, marginTop: 4, display: "inline-block" }}>
          AI Insight →
        </span>
      </div>
    </div>
  );
}

export function Sidebar({ user, posts, onSignOut, onOpenProfile }) {
  const trendingConditions = [...new Set(posts.flatMap((p) => p.conditions || []))].slice(0, 5);
  const priorityCount = posts.filter((p) => p.aanPriority).length;
  const endorsedCount = posts.filter((p) => p.aanEndorsed).length;
  const needPosts = posts.filter((p) => p.type === "need");
  const openNeeds = needPosts.filter((p) => p.status === "open").length;
  const inProgressNeeds = needPosts.filter((p) => p.status === "in_progress").length;
  const resolvedNeeds = needPosts.filter((p) => p.status === "resolved").length;
  const resolutionRate = needPosts.length > 0 ? Math.round((resolvedNeeds / needPosts.length) * 100) : 0;
  const userInitials = user.name?.split(" ").map((n) => n[0]).join("") || "AM";

  return (
    <div style={{ width: "100%", maxWidth: 300, flexShrink: 0 }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: "24px", marginBottom: 16 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, cursor: onOpenProfile ? "pointer" : "default" }}
          onClick={() => onOpenProfile?.("self")}
        >
          <Avatar initials={userInitials} role={user.role} size={46} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-faint)" }}>
              {user.role === "aan" ? "AAN Member" : "Community Member"} · {user.location}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: onSignOut ? 16 : 0 }}>
          {(user.conditions || []).map((c) => (
            <span key={c} className="chip" style={{ fontSize: 12 }}>
              {c}
            </span>
          ))}
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-text-faint)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        )}
      </div>

      {/* AI Suggestions */}
      <div className="card" style={{ padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <Sparkles size={14} style={{ color: "var(--color-gold)" }} />
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
            Suggested for You
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_SUGGESTIONS.map((s) => (
            <AiSuggestionCard key={s.id} suggestion={s} user={user} />
          ))}
        </div>
      </div>

      {/* Impact Dashboard */}
      <div className="card" style={{ padding: "20px 22px" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 14px" }}>
          Community Impact
        </h3>

        {/* Needs Pipeline */}
        {needPosts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 4, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 10, background: "var(--color-bg-muted)" }}>
              {resolvedNeeds > 0 && <div style={{ flex: resolvedNeeds, background: "var(--color-green)", borderRadius: 3, transition: "flex 0.5s" }} />}
              {inProgressNeeds > 0 && <div style={{ flex: inProgressNeeds, background: "var(--color-gold)", borderRadius: 3, transition: "flex 0.5s" }} />}
              {openNeeds > 0 && <div style={{ flex: openNeeds, background: "var(--color-orange)", borderRadius: 3, transition: "flex 0.5s" }} />}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--color-orange)", fontWeight: 600 }}>{openNeeds} Open</span>
              <span style={{ color: "var(--color-gold)", fontWeight: 600 }}>{inProgressNeeds} In Progress</span>
              <span style={{ color: "var(--color-green)", fontWeight: 600 }}>{resolvedNeeds} Resolved</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="stat-row">
            <span className="stat-label">Needs Identified</span>
            <span className="stat-value" style={{ color: "var(--color-text)" }}>{needPosts.length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Resolution Rate</span>
            <span className="stat-value" style={{ color: "var(--color-green)" }}>{resolutionRate}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Priority Flagged</span>
            <span className="stat-value" style={{ color: "var(--color-orange)" }}>{priorityCount}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">AAN Endorsed</span>
            <span className="stat-value" style={{ color: "var(--color-gold)" }}>{endorsedCount}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Posts</span>
            <span className="stat-value" style={{ color: "var(--color-text)" }}>{posts.length}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: 12, marginTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#5a5347", marginBottom: 8, display: "block" }}>
            Trending Conditions
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {trendingConditions.map((c) => (
              <span key={c} style={{ fontSize: 12, color: "var(--color-blue)", background: "#5b7fb812", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
