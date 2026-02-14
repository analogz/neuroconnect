import { Avatar, TypeBadge, StatusBadge } from "./common";
import { SEED_USERS } from "../data/mockData";
import { ArrowLeft, Star, Heart, MessageSquare } from "lucide-react";

export function UserProfile({ userId, users, posts, currentUser, onBack, onOpenPost, compact }) {
  const allUsers = [...SEED_USERS, ...(users || [])];
  let user = allUsers.find((u) => u.id === userId);

  const currentUid = currentUser?.uid || "demo-user";
  if (!user && currentUser && (userId === currentUid || userId === "self")) {
    user = {
      id: currentUser.uid || "demo-user",
      name: currentUser.name,
      role: currentUser.role,
      avatar: currentUser.name?.split(" ").map((n) => n[0]).join("") || "??",
      location: currentUser.location,
      region: currentUser.region,
      conditions: currentUser.conditions,
      title: currentUser.role === "aan" ? "AAN Member" : "Community Member",
    };
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <p style={{ color: "var(--color-text-faint)" }}>User not found.</p>
      </div>
    );
  }

  const matchId = user.id;
  const userPosts = posts.filter((p) => p.authorId === matchId);
  const endorsedPosts = posts.filter((p) => p.aanEndorsedBy === matchId);
  const initials = user.avatar || user.name?.split(" ").map((n) => n[0]).join("") || "??";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <button
        onClick={onBack}
        className="back-link"
        style={{ marginBottom: compact ? 12 : 20, fontSize: compact ? 13 : 14 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile Header */}
      <div className="card" style={{
        borderRadius: compact ? 16 : 20,
        padding: compact ? "24px 20px" : "32px 36px",
        marginBottom: compact ? 16 : 24,
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Avatar initials={initials} role={user.role} size={compact ? 64 : 80} />
        </div>
        <h1 className="heading" style={{
          fontSize: compact ? 24 : 30,
          margin: "0 0 4px",
        }}>
          {user.name}
        </h1>
        <p style={{
          fontSize: compact ? 13 : 14,
          color: "var(--color-text-faint)",
          margin: "0 0 12px",
        }}>
          {user.title} · {user.location}
        </p>
        {user.role === "aan" && (
          <span
            className="badge"
            style={{
              background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
              color: "var(--color-gold-dark)",
              border: "1px solid #c5a24d33",
              padding: "4px 14px",
              marginBottom: 16,
            }}
          >
            <Star size={10} /> AAN Member
          </span>
        )}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {(user.conditions || []).map((c) => (
            <span key={c} className="chip" style={{ fontSize: 12, padding: "4px 12px" }}>
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
          borderTop: "1px solid var(--color-border-light)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)" }}>
              {userPosts.length}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-faint)" }}>Posts</div>
          </div>
          {user.role === "aan" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-gold)" }}>
                {endorsedPosts.length}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-faint)" }}>Endorsed</div>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)" }}>
              {userPosts.reduce((sum, p) => sum + (p.likes || 0), 0)}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-faint)" }}>Likes</div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      {userPosts.length > 0 && (
        <>
          <h3 className="heading" style={{
            fontSize: compact ? 18 : 20,
            marginBottom: compact ? 12 : 16,
          }}>
            Posts by {user.name.split(" ")[0]}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onOpenPost(post.id)}
                className="card-interactive"
                style={{
                  borderRadius: compact ? 12 : 16,
                  padding: compact ? "14px 16px" : "18px 22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TypeBadge type={post.type} small />
                  {post.type === "need" && post.status && <StatusBadge status={post.status} />}
                  <span style={{ fontSize: 12, color: "var(--color-text-faint)", marginLeft: "auto" }}>
                    {post.time}
                  </span>
                </div>
                <h4 className="heading" style={{
                  fontSize: compact ? 17 : 19,
                  margin: "0 0 4px",
                }}>
                  {post.title}
                </h4>
                <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--color-text-faint)", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Heart size={12} /> {post.likes}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> {post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Endorsed Posts (AAN only) */}
      {user.role === "aan" && endorsedPosts.length > 0 && (
        <>
          <h3 className="heading" style={{
            fontSize: compact ? 18 : 20,
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
                className="card-interactive"
                style={{
                  borderRadius: compact ? 12 : 16,
                  padding: compact ? "14px 16px" : "18px 22px",
                  borderLeft: "3px solid var(--color-gold)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TypeBadge type={post.type} small />
                  <span style={{ fontSize: 11, color: "var(--color-gold)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Star size={10} /> Endorsed
                  </span>
                </div>
                <h4 className="heading" style={{
                  fontSize: compact ? 17 : 19,
                  margin: 0,
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
