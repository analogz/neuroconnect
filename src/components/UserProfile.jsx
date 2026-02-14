import { Avatar, TypeBadge, StatusBadge } from "./common";
import { SEED_USERS } from "../data/mockData";

export function UserProfile({ userId, users, posts, onBack, onOpenPost, compact }) {
  const allUsers = [...SEED_USERS, ...(users || [])];
  const user = allUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", background: "none", border: "none", color: "#7a746b", fontSize: 14, fontFamily: "'Manrope', sans-serif", cursor: "pointer", marginBottom: 20 }}
        >
          ← Back
        </button>
        <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9a9488" }}>User not found.</p>
      </div>
    );
  }

  const userPosts = posts.filter((p) => p.authorId === userId);
  const endorsedPosts = posts.filter((p) => p.aanEndorsedBy === userId);
  const initials = user.avatar || user.name?.split(" ").map((n) => n[0]).join("") || "??";

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
        ← Back
      </button>

      {/* Profile Header */}
      <div style={{
        background: "#fff",
        borderRadius: compact ? 16 : 20,
        padding: compact ? "24px 20px" : "32px 36px",
        border: "1px solid #e8e4df",
        boxShadow: "0 2px 12px #1a233208",
        marginBottom: compact ? 16 : 24,
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Avatar initials={initials} role={user.role} size={compact ? 64 : 80} />
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: compact ? 24 : 30,
          fontWeight: 600,
          color: "#1a2332",
          margin: "0 0 4px",
        }}>
          {user.name}
        </h1>
        <p style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: compact ? 13 : 14,
          color: "#9a9488",
          margin: "0 0 12px",
        }}>
          {user.title} · {user.location}
        </p>
        {user.role === "aan" && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 14px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
              color: "#b8932e",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "'Manrope', sans-serif",
              border: "1px solid #c5a24d33",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 10 }}>✦</span> AAN Member
          </span>
        )}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {(user.conditions || []).map((c) => (
            <span key={c} style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 12,
              color: "#7a746b",
              background: "#f4f2ef",
              padding: "4px 12px",
              borderRadius: 20,
            }}>
              {c}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: compact ? 24 : 40,
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid #f0ece7",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "#1a2332" }}>
              {userPosts.length}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>Posts</div>
          </div>
          {user.role === "aan" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "#c5a24d" }}>
                {endorsedPosts.length}
              </div>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>Endorsed</div>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "#1a2332" }}>
              {userPosts.reduce((sum, p) => sum + (p.likes || 0), 0)}
            </div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488" }}>Likes</div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      {userPosts.length > 0 && (
        <>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: compact ? 18 : 20,
            fontWeight: 600,
            color: "#1a2332",
            marginBottom: compact ? 12 : 16,
          }}>
            Posts by {user.name.split(" ")[0]}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onOpenPost(post.id)}
                style={{
                  background: "#fff",
                  borderRadius: compact ? 12 : 16,
                  padding: compact ? "14px 16px" : "18px 22px",
                  border: "1px solid #e8e4df",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px #1a233210")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TypeBadge type={post.type} small />
                  {post.type === "need" && post.status && <StatusBadge status={post.status} />}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#9a9488", marginLeft: "auto" }}>
                    {post.time}
                  </span>
                </div>
                <h4 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: compact ? 17 : 19,
                  fontWeight: 600,
                  color: "#1a2332",
                  margin: "0 0 4px",
                  lineHeight: 1.3,
                }}>
                  {post.title}
                </h4>
                <div style={{ display: "flex", gap: 12, fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#9a9488" }}>
                  <span>♡ {post.likes}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Endorsed Posts (AAN only) */}
      {user.role === "aan" && endorsedPosts.length > 0 && (
        <>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: compact ? 18 : 20,
            fontWeight: 600,
            color: "#1a2332",
            marginTop: compact ? 20 : 28,
            marginBottom: compact ? 12 : 16,
          }}>
            Endorsed by {user.name.split(" ")[0]}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
            {endorsedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onOpenPost(post.id)}
                style={{
                  background: "#fff",
                  borderRadius: compact ? 12 : 16,
                  padding: compact ? "14px 16px" : "18px 22px",
                  border: "1px solid #e8e4df",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderLeft: "3px solid #c5a24d",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px #1a233210")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TypeBadge type={post.type} small />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#c5a24d", fontWeight: 600 }}>
                    ✦ Endorsed
                  </span>
                </div>
                <h4 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: compact ? 17 : 19,
                  fontWeight: 600,
                  color: "#1a2332",
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {post.title}
                </h4>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
