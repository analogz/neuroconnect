import { useState } from "react";
import { SEED_USERS } from "../data/mockData";
import { Avatar, TypeBadge, AanBadge, PriorityBadge, StatusBadge, ActionButton, AanToolButton } from "./common";

export function PostCard({ post, users, currentUser, onLike, onSave, onEndorse, onFlagPriority, onUpdateStatus, onOpenPost, onOpenProfile, compact }) {
  const allUsers = [...SEED_USERS, ...(users || [])];
  const author = allUsers.find((u) => u.id === post.authorId) || {
    name: post.authorName || "Unknown",
    avatar: post.authorAvatar || "??",
    role: post.authorRole || "community",
    title: post.authorRole === "aan" ? "AAN Member" : "Community Member",
  };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onOpenPost(post.id)}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: compact ? 14 : 18,
        padding: compact ? "16px 18px" : "24px 28px",
        border: "1px solid #e8e4df",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: hovered ? "0 8px 32px #1a233212" : "0 1px 3px #1a233208",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {post.aiReason && (
        <div
          style={{
            marginBottom: compact ? 10 : 14,
            padding: compact ? "6px 10px" : "8px 14px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #c5a24d08, #c5a24d04)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#c5a24d", fontSize: 12 }}>✦</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 11.5 : 12.5, color: "#8b7d5e", fontStyle: "italic" }}>
            {post.aiReason}
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 12, marginBottom: compact ? 10 : 14 }}>
        <Avatar initials={author.avatar} role={author.role} size={compact ? 36 : 42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              onClick={(e) => { e.stopPropagation(); onOpenProfile?.(post.authorId); }}
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 13.5 : 14.5, fontWeight: 700, color: "#1a2332", cursor: "pointer" }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              {author.name}
            </span>
            {author.role === "aan" && (
              <span style={{ fontSize: 10, color: "#c5a24d", fontWeight: 700, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.06em" }}>
                AAN
              </span>
            )}
          </div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 11.5 : 12.5, color: "#9a9488", display: "flex", alignItems: "center", gap: 6 }}>
            <span>{author.title}</span>
            <span>·</span>
            <span>{post.time}</span>
          </div>
        </div>
        <TypeBadge type={post.type} small={compact} />
      </div>

      {(post.aanEndorsed || post.aanPriority || (post.type === "need" && post.status)) && (
        <div style={{ display: "flex", gap: 8, marginBottom: compact ? 8 : 12, flexWrap: "wrap", alignItems: "center" }}>
          {post.type === "need" && post.status && <StatusBadge status={post.status} />}
          {post.aanEndorsed && <AanBadge />}
          {post.aanPriority && <PriorityBadge />}
        </div>
      )}

      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: compact ? 19 : 22,
          fontWeight: 600,
          color: "#1a2332",
          margin: "0 0 6px",
          lineHeight: 1.3,
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: compact ? 13.5 : 14.5,
          color: "#4a4540",
          lineHeight: 1.65,
          margin: compact ? "0 0 12px" : "0 0 16px",
          display: "-webkit-box",
          WebkitLineClamp: compact ? 2 : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.body}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: compact ? 12 : 16, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 11 : 12, color: "#7a746b", background: "#f4f2ef", padding: "3px 10px", borderRadius: 20 }}>
          📍 {post.location}
        </span>
        {post.conditions?.map((c) => (
          <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 11 : 12, color: "#7a746b", background: "#f4f2ef", padding: "3px 10px", borderRadius: 20 }}>
            {c}
          </span>
        ))}
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: compact ? 2 : 4, borderTop: "1px solid #f0ece7", paddingTop: compact ? 10 : 14, flexWrap: "wrap" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ActionButton icon="♡" label={post.likes} active={post.liked} onClick={() => onLike(post.id)} />
        <ActionButton icon="💬" label={post.comments?.length || 0} onClick={() => onOpenPost(post.id)} />
        <ActionButton icon="⊹" label={post.saves} active={post.saved} onClick={() => onSave(post.id)} />
        <div style={{ flex: 1 }} />
        {currentUser?.role === "aan" && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <AanToolButton label={compact ? "" : "Endorse"} icon="✦" active={post.aanEndorsed} onClick={() => onEndorse(post.id)} color="#c5a24d" />
            <AanToolButton label={compact ? "" : "Priority"} icon="◈" active={post.aanPriority} onClick={() => onFlagPriority(post.id)} color="#d4764e" />
          </div>
        )}
      </div>
    </div>
  );
}
