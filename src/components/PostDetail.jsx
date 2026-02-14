import { useState } from "react";
import { SEED_USERS } from "../data/mockData";
import { Avatar, TypeBadge, AanBadge, PriorityBadge, StatusBadge, StatusSelector, ActionButton, AanToolButton } from "./common";
import { Heart, Bookmark, Star, AlertTriangle, ArrowLeft, MapPin } from "lucide-react";

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
        className="back-link"
        style={{ marginBottom: compact ? 12 : 20, fontSize: compact ? 13 : 14 }}
      >
        <ArrowLeft size={16} /> Back to feed
      </button>

      <div className="card" style={{
        borderRadius: compact ? 16 : 20,
        padding: compact ? "20px" : "32px 36px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14, marginBottom: compact ? 14 : 20 }}>
          <Avatar initials={author.avatar} role={author.role} size={compact ? 40 : 50} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                onClick={() => onOpenProfile?.(post.authorId)}
                className="link-hover"
                style={{ fontSize: compact ? 15 : 16, fontWeight: 700, color: "var(--color-text)", cursor: "pointer" }}
              >{author.name}</span>
              {author.role === "aan" && <span style={{ fontSize: 11, color: "var(--color-gold)", fontWeight: 700 }}>AAN</span>}
            </div>
            <div style={{ fontSize: compact ? 12 : 13, color: "var(--color-text-faint)" }}>
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
              <span style={{ fontSize: 12, color: "var(--color-text-faint)" }}>
                Endorsed by {endorser.name}
              </span>
            )}
          </div>
        )}

        <h1 className="heading" style={{
          fontSize: compact ? 24 : 30,
          margin: compact ? "0 0 12px" : "0 0 16px",
          lineHeight: 1.25,
        }}>
          {post.title}
        </h1>
        <p style={{
          fontSize: compact ? 15 : 16,
          color: "var(--color-text-secondary)",
          lineHeight: 1.75,
          margin: compact ? "0 0 18px" : "0 0 24px",
        }}>
          {post.body}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: compact ? 14 : 20, flexWrap: "wrap" }}>
          <span className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <MapPin size={12} /> {post.location}
          </span>
          {post.conditions?.map((c) => (
            <span key={c} className="chip" style={{ fontSize: 13 }}>
              {c}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, borderTop: "1px solid var(--color-border-light)", paddingTop: compact ? 12 : 16, marginBottom: 8, flexWrap: "wrap" }}>
          <ActionButton icon={<Heart size={14} />} label={post.likes} active={post.liked} onClick={() => onLike(post.id)} />
          <ActionButton icon={<Bookmark size={14} />} label={post.saves} active={post.saved} onClick={() => onSave(post.id)} />
          <div style={{ flex: 1 }} />
          {currentUser?.role === "aan" && (
            <div style={{ display: "flex", gap: 4 }}>
              <AanToolButton label={compact ? "" : "Endorse"} icon={<Star size={10} />} active={post.aanEndorsed} onClick={() => onEndorse(post.id)} color="#c5a24d" />
              <AanToolButton label={compact ? "" : "Flag Priority"} icon={<AlertTriangle size={10} />} active={post.aanPriority} onClick={() => onFlagPriority(post.id)} color="#d4764e" />
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: compact ? 16 : 24 }}>
        <h3 className="heading" style={{ fontSize: compact ? 18 : 20, marginBottom: compact ? 12 : 16 }}>
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
              background: "var(--color-surface)",
              borderRadius: compact ? 12 : 16,
              border: "1px solid #edeae5",
            }}>
              <Avatar initials={commentAuthor.avatar} role={commentAuthor.role} size={compact ? 30 : 36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: "var(--color-text)" }}>{commentAuthor.name}</span>
                  {commentAuthor.role === "aan" && <span style={{ fontSize: 10, color: "var(--color-gold)", fontWeight: 700 }}>AAN</span>}
                  <span style={{ fontSize: compact ? 11 : 12, color: "var(--color-text-faint)" }}>· {comment.time}</span>
                </div>
                <p style={{ fontSize: compact ? 13 : 14, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{comment.body}</p>
              </div>
            </div>
          );
        })}

        <div style={{
          display: "flex",
          gap: compact ? 8 : 12,
          padding: compact ? "12px 14px" : "18px 22px",
          background: "var(--color-surface)",
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
              className="input"
              style={{ flex: 1, padding: compact ? "10px 14px" : "10px 16px", minWidth: 0 }}
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
              className="btn btn-primary"
              style={{
                padding: compact ? "10px 14px" : "10px 20px",
                borderRadius: 12,
                fontSize: 13,
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
            <h3 className="heading" style={{ fontSize: compact ? 18 : 20, marginBottom: compact ? 12 : 16 }}>
              Related Posts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
              {related.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => { window.scrollTo(0, 0); onOpenPost?.(rp.id); }}
                  className="card-interactive"
                  style={{
                    borderRadius: compact ? 12 : 14,
                    padding: compact ? "12px 14px" : "16px 20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <TypeBadge type={rp.type} small />
                    {rp.type === "need" && rp.status && <StatusBadge status={rp.status} />}
                    <span style={{ fontSize: 12, color: "var(--color-text-faint)", marginLeft: "auto" }}>
                      {rp.time}
                    </span>
                  </div>
                  <h4 className="heading" style={{
                    fontSize: compact ? 16 : 18,
                    margin: "0 0 4px",
                  }}>
                    {rp.title}
                  </h4>
                  <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--color-text-faint)" }}>
                    {rp.conditions?.filter((c) => post.conditions?.includes(c)).map((c) => (
                      <span key={c} style={{ color: "var(--color-blue)" }}>{c}</span>
                    ))}
                    {rp.region === post.region && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={10} /> {rp.region}</span>
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
