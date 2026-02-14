import { useState } from "react";
import { SEED_USERS } from "../data/mockData";
import { Avatar, TypeBadge, AanBadge, PriorityBadge, ActionButton, AanToolButton } from "./common";

export function PostDetail({ post, users, currentUser, onBack, onLike, onSave, onEndorse, onFlagPriority, onAddComment }) {
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
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
          fontSize: 14,
          fontFamily: "'Manrope', sans-serif",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        ← Back to feed
      </button>

      <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", border: "1px solid #e8e4df", boxShadow: "0 2px 12px #1a233208" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Avatar initials={author.avatar} role={author.role} size={50} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 700, color: "#1a2332" }}>{author.name}</span>
              {author.role === "aan" && <span style={{ fontSize: 11, color: "#c5a24d", fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>AAN</span>}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#9a9488" }}>
              {author.title} · {post.location} · {post.time}
            </div>
          </div>
          <TypeBadge type={post.type} />
        </div>

        {(post.aanEndorsed || post.aanPriority) && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            {post.aanEndorsed && <AanBadge />}
            {post.aanPriority && <PriorityBadge />}
            {endorser && (
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>
                Endorsed by {endorser.name}
              </span>
            )}
          </div>
        )}

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: "#1a2332", margin: "0 0 16px", lineHeight: 1.25 }}>
          {post.title}
        </h1>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15.5, color: "#4a4540", lineHeight: 1.75, margin: "0 0 24px" }}>
          {post.body}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#7a746b", background: "#f4f2ef", padding: "4px 12px", borderRadius: 20 }}>
            📍 {post.location}
          </span>
          {post.conditions?.map((c) => (
            <span key={c} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#7a746b", background: "#f4f2ef", padding: "4px 12px", borderRadius: 20 }}>
              {c}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, borderTop: "1px solid #f0ece7", paddingTop: 16, marginBottom: 8 }}>
          <ActionButton icon="♡" label={post.likes} active={post.liked} onClick={() => onLike(post.id)} />
          <ActionButton icon="⊹" label={post.saves} active={post.saved} onClick={() => onSave(post.id)} />
          <div style={{ flex: 1 }} />
          {currentUser?.role === "aan" && (
            <div style={{ display: "flex", gap: 4 }}>
              <AanToolButton label="Endorse" icon="✦" active={post.aanEndorsed} onClick={() => onEndorse(post.id)} color="#c5a24d" />
              <AanToolButton label="Flag Priority" icon="◈" active={post.aanPriority} onClick={() => onFlagPriority(post.id)} color="#d4764e" />
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#1a2332", marginBottom: 16 }}>
          Discussion ({post.comments?.length || 0})
        </h3>

        {post.comments?.map((comment) => {
          const commentAuthor = allUsers.find((u) => u.id === comment.authorId) || {
            name: comment.authorName || "Unknown",
            avatar: comment.authorAvatar || "??",
            role: comment.authorRole || "community",
          };
          return (
            <div key={comment.id} style={{ display: "flex", gap: 12, marginBottom: 16, padding: "18px 22px", background: "#fff", borderRadius: 16, border: "1px solid #edeae5" }}>
              <Avatar initials={commentAuthor.avatar} role={commentAuthor.role} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#1a2332" }}>{commentAuthor.name}</span>
                  {commentAuthor.role === "aan" && <span style={{ fontSize: 10, color: "#c5a24d", fontWeight: 700 }}>AAN</span>}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>· {comment.time}</span>
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#4a4540", lineHeight: 1.6, margin: 0 }}>{comment.body}</p>
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 12, padding: "18px 22px", background: "#fff", borderRadius: 16, border: "1px solid #edeae5", marginTop: 8 }}>
          <Avatar initials={userInitials} role={currentUser?.role} size={36} />
          <div style={{ flex: 1, display: "flex", gap: 8 }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add to the discussion..."
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #e8e4df",
                fontSize: 14,
                fontFamily: "'Manrope', sans-serif",
                background: "#faf9f7",
                outline: "none",
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
                padding: "10px 20px",
                borderRadius: 12,
                background: "#1a2332",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
