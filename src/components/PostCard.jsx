import { SEED_USERS } from "../data/mockData";
import { Avatar, TypeBadge, AanBadge, PriorityBadge, StatusBadge, ActionButton, AanToolButton, Icon } from "./common";
import { Heart, MessageSquare, Bookmark, Star, AlertTriangle, MapPin, Sparkles } from "lucide-react";

export function PostCard({ post, users, currentUser, onLike, onSave, onEndorse, onFlagPriority, onUpdateStatus, onOpenPost, onOpenProfile, compact }) {
  const allUsers = [...SEED_USERS, ...(users || [])];
  const author = allUsers.find((u) => u.id === post.authorId) || {
    name: post.authorName || "Unknown",
    avatar: post.authorAvatar || "??",
    role: post.authorRole || "community",
    title: post.authorRole === "aan" ? "AAN Member" : "Community Member",
  };

  return (
    <div
      onClick={() => onOpenPost(post.id)}
      className="card-interactive"
      style={{
        padding: compact ? "16px 18px" : "24px 28px",
        borderRadius: compact ? 14 : 18,
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
          <Sparkles size={12} style={{ color: "var(--color-gold)" }} />
          <span style={{ fontSize: compact ? 12 : 13, color: "#8b7d5e", fontStyle: "italic" }}>
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
              className="link-hover"
              style={{ fontSize: compact ? 14 : 15, fontWeight: 700, color: "var(--color-text)", cursor: "pointer" }}
            >
              {author.name}
            </span>
            {author.role === "aan" && (
              <span style={{ fontSize: 10, color: "var(--color-gold)", fontWeight: 700, letterSpacing: "0.06em" }}>
                AAN
              </span>
            )}
          </div>
          <div style={{ fontSize: compact ? 12 : 13, color: "var(--color-text-faint)", display: "flex", alignItems: "center", gap: 6 }}>
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
        className="heading"
        style={{
          fontSize: compact ? 19 : 22,
          margin: "0 0 6px",
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          fontSize: compact ? 14 : 15,
          color: "var(--color-text-secondary)",
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
        <span className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: compact ? 11 : 12 }}>
          <MapPin size={11} /> {post.location}
        </span>
        {post.conditions?.map((c) => (
          <span key={c} className="chip" style={{ fontSize: compact ? 11 : 12 }}>
            {c}
          </span>
        ))}
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: compact ? 2 : 4, borderTop: "1px solid var(--color-border-light)", paddingTop: compact ? 10 : 14, flexWrap: "wrap" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ActionButton icon={<Heart size={14} />} label={post.likes} active={post.liked} onClick={() => onLike(post.id)} />
        <ActionButton icon={<MessageSquare size={14} />} label={post.comments?.length || 0} onClick={() => onOpenPost(post.id)} />
        <ActionButton icon={<Bookmark size={14} />} label={post.saves} active={post.saved} onClick={() => onSave(post.id)} />
        <div style={{ flex: 1 }} />
        {currentUser?.role === "aan" && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <AanToolButton label={compact ? "" : "Endorse"} icon={<Star size={10} />} active={post.aanEndorsed} onClick={() => onEndorse(post.id)} color="#c5a24d" />
            <AanToolButton label={compact ? "" : "Priority"} icon={<AlertTriangle size={10} />} active={post.aanPriority} onClick={() => onFlagPriority(post.id)} color="#d4764e" />
          </div>
        )}
      </div>
    </div>
  );
}
