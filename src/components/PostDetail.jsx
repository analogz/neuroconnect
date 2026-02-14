import { useState } from "react";
import { SEED_USERS } from "../data/mockData";
import { Avatar, TypeBadge, AanBadge, PriorityBadge, StatusBadge, StatusSelector, ActionButton, AanToolButton } from "./common";

export function PostDetail({ post, users, allPosts, currentUser, onBack, onLike, onSave, onEndorse, onFlagPriority, onUpdateStatus, onAddComment, onOpenProfile, onOpenPost, compact }) {
  const allUsers = [...SEED_USERS, ...(users || [])];
  const author = allUsers.find((u) => u.id === post.authorId) || {
    name: post.authorName || "Unknown",
    avatar: post.authorAvatar || "??",
    role: post.authorRole || "community",
    title: "Member",
  };
  const endorser = post.aanEndorsedBy ? allUsers.find((u) => u.id === post.aanEndorsedBy) : null;
  const [commentText, setCommentText] = useState("");

  const userInitials = currentUser?.name?.split(" ").map((n) => n[0]).join("") || "AM";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 0",
          background: "none",
          border: "none",
          color: "#7a746b",
          fontSize: compact ? 13 : 14,
          fontFamily: "'Manrope', sans-serif",
          cursor: "pointer",
          marginBottom: compact ? 12 : 20,
        }}
      >
        ← Back to feed
      </button>

      <div style={{
        background: "#fff",
        borderRadius: compact ? 16 : 20,
        padding: compact ? "20px" : "32px 36px",
        border: "1px solid #e8e4df",
        boxShadow: "0 2px 12px #1a233208",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14, marginBottom: compact ? 14 : 20 }}>
          <Avatar initials={author.avatar} role={author.role} size={compact ? 40 : 50} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                onClick={() => onOpenProfile?.(post.authorId)}
                style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 14.5 : 16, fontWeight: 700, color: "#1a2332", cursor: "pointer" }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >{author.name}</span>
              {author.role === "aan" && <span style={{ fontSize: 11, color: "#c5a24d", fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>AAN</span>}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 12 : 13, color: "#9a9488" }}>
              {author.title} · {post.location} · {post.time}
            </div>
          </div>
          <TypeBadge type={post.type} small={compact} />
        </div>

        {(post.aanEndorsed || post.aanPriority || (post.type === "need" && post.status)) && (
          <div style={{ display: "flex", gap: 8, marginBottom: compact ? 12 : 16, flexWrap: "wrap", alignItems: "center" }}>
            {post.type === "need" && post.status && (
              currentUser?.role === "aan"
                ? <StatusSelector currentStatus={post.status} onChangeStatus={(s) => onUpdateStatus(post.id, s)} />
                : <StatusBadge status={post.status} />
            )}
            {post.aanEndorsed && <AanBadge />}
            {post.aanPriority && <PriorityBadge />}
            {endorser && (
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>
                Endorsed by {endorser.name}
              </span>
            )}
          </div>
        )}

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: compact ? 24 : 30,
          fontWeight: 600,
          color: "#1a2332",
          margin: compact ? "0 0 12px" : "0 0 16px",
          lineHeight: 1.25,
        }}>
          {post.title}
        </h1>
        <p style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: compact ? 14.5 : 15.5,
          color: "#4a4540",
          lineHeight: 1.75,
          margin: compact ? "0 0 18px" : "0 0 24px",
        }}>
          {post.body}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: compact ? 14 : 20, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#7a746b", background: "#f4f2ef", padding: "4px 12px", borderRadius: 20 }}>
            📍 {post.location}
          </span>
          {post.conditions?.map((c) => (
            <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#7a746b", background: "#f4f2ef", padding: "4px 12px", borderRadius: 20 }}>
              {c}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, borderTop: "1px solid #f0ece7", paddingTop: compact ? 12 : 16, marginBottom: 8, flexWrap: "wrap" }}>
          <ActionButton icon="♡" label={post.likes} active={post.liked} onClick={() => onLike(post.id)} />
          <ActionButton icon="⊹" label={post.saves} active={post.saved} onClick={() => onSave(post.id)} />
          <div style={{ flex: 1 }} />
          {currentUser?.role === "aan" && (
            <div style={{ display: "flex", gap: 4 }}>
              <AanToolButton label={compact ? "" : "Endorse"} icon="✦" active={post.aanEndorsed} onClick={() => onEndorse(post.id)} color="#c5a24d" />
              <AanToolButton label={compact ? "" : "Flag Priority"} icon="◈" active={post.aanPriority} onClick={() => onFlagPriority(post.id)} color="#d4764e" />
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: compact ? 16 : 24 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: compact ? 18 : 20, fontWeight: 600, color: "#1a2332", marginBottom: compact ? 12 : 16 }}>
          Discussion ({post.comments?.length || 0})
        </h3>

        {post.comments?.map((comment) => {
          const commentAuthor = allUsers.find((u) => u.id === comment.authorId) || {
            name: comment.authorName || "Unknown",
            avatar: comment.authorAvatar || "??",
            role: comment.authorRole || "community",
          };
          return (
            <div key={comment.id} style={{
              display: "flex",
              gap: compact ? 10 : 12,
              marginBottom: compact ? 10 : 16,
              padding: compact ? "14px 16px" : "18px 22px",
              background: "#fff",
              borderRadius: compact ? 12 : 16,
              border: "1px solid #edeae5",
            }}>
              <Avatar initials={commentAuthor.avatar} role={commentAuthor.role} size={compact ? 30 : 36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 12.5 : 13.5, fontWeight: 700, color: "#1a2332" }}>{commentAuthor.name}</span>
                  {commentAuthor.role === "aan" && <span style={{ fontSize: 10, color: "#c5a24d", fontWeight: 700 }}>AAN</span>}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 11 : 12, color: "#9a9488" }}>· {comment.time}</span>
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: compact ? 13 : 14, color: "#4a4540", lineHeight: 1.6, margin: 0 }}>{comment.body}</p>
              </div>
            </div>
          );
        })}

        <div style={{
          display: "flex",
          gap: compact ? 8 : 12,
          padding: compact ? "12px 14px" : "18px 22px",
          background: "#fff",
          borderRadius: compact ? 12 : 16,
          border: "1px solid #edeae5",
          marginTop: 8,
        }}>
          {!compact && <Avatar initials={userInitials} role={currentUser?.role} size={36} />}
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add to the discussion..."
              style={{
                flex: 1,
                padding: compact ? "10px 14px" : "10px 16px",
                borderRadius: 12,
                border: "1px solid #e8e4df",
                fontSize: compact ? 13 : 14,
                fontFamily: "'Manrope', sans-serif",
                background: "#faf9f7",
                outline: "none",
                minWidth: 0,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c5a24d")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e4df")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim()) {
                  onAddComment(post.id, commentText);
                  setCommentText("");
                }
              }}
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  onAddComment(post.id, commentText);
                  setCommentText("");
                }
              }}
              style={{
                padding: compact ? "10px 14px" : "10px 20px",
                borderRadius: 12,
                background: "#1a2332",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {allPosts && (() => {
        const related = allPosts
          .filter((p) => p.id !== post.id)
          .map((p) => {
            let score = 0;
            if (p.conditions?.some((c) => post.conditions?.includes(c))) score += 3;
            if (p.region === post.region) score += 2;
            if (p.type === post.type) score += 1;
            return { ...p, _score: score };
          })
          .filter((p) => p._score > 0)
          .sort((a, b) => b._score - a._score)
          .slice(0, 3);

        if (related.length === 0) return null;

        return (
          <div style={{ marginTop: compact ? 20 : 28 }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: compact ? 18 : 20,
              fontWeight: 600,
              color: "#1a2332",
              marginBottom: compact ? 12 : 16,
            }}>
              Related Posts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
              {related.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => { window.scrollTo(0, 0); onOpenPost?.(rp.id); }}
                  style={{
                    background: "#fff",
                    borderRadius: compact ? 12 : 14,
                    padding: compact ? "12px 14px" : "16px 20px",
                    border: "1px solid #e8e4df",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px #1a233210")}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <TypeBadge type={rp.type} small />
                    {rp.type === "need" && rp.status && <StatusBadge status={rp.status} />}
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488", marginLeft: "auto" }}>
                      {rp.time}
                    </span>
                  </div>
                  <h4 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: compact ? 16 : 18,
                    fontWeight: 600,
                    color: "#1a2332",
                    margin: "0 0 4px",
                    lineHeight: 1.3,
                  }}>
                    {rp.title}
                  </h4>
                  <div style={{ display: "flex", gap: 8, fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>
                    {rp.conditions?.filter((c) => post.conditions?.includes(c)).map((c) => (
                      <span key={c} style={{ color: "#5b7fb8" }}>{c}</span>
                    ))}
                    {rp.region === post.region && (
                      <span>📍 {rp.region}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
