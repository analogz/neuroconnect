import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { usePosts } from "./hooks/usePosts";
import { POST_TYPES } from "./data/mockData";
import { OnboardingScreen } from "./components/Onboarding";
import { PostCard } from "./components/PostCard";
import { PostDetail } from "./components/PostDetail";
import { Sidebar } from "./components/Sidebar";
import { NewPostModal } from "./components/NewPostModal";
import { Avatar } from "./components/common";

export default function App() {
  const { profile, isDemo, isAuthenticated, signInWithGoogle, signOut, saveProfile } = useAuth();
  const { posts, users, sortedPosts, addPost, toggleLike, toggleSave, toggleEndorse, togglePriority, addComment } = usePosts(profile);

  const [view, setView] = useState("feed");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [feedFilter, setFeedFilter] = useState("all");
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setTimeout(() => setAppReady(true), 100);
  }, [isAuthenticated]);

  const handleOpenPost = (id) => {
    setSelectedPostId(id);
    setView("post");
  };

  const handleNewPost = (data) => {
    addPost(data);
    setShowNewPost(false);
  };

  // Not authenticated or needs onboarding
  if (!isAuthenticated) {
    return (
      <OnboardingScreen
        onComplete={saveProfile}
        onGoogleSignIn={!isDemo ? signInWithGoogle : null}
        isDemo={isDemo}
      />
    );
  }

  const feed = sortedPosts(feedFilter);
  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const userInitials = profile?.name?.split(" ").map((n) => n[0]).join("") || "AM";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", fontFamily: "'Manrope', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e4df", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => setView("feed")}
          >
            <span style={{ fontSize: 20, color: "#c5a24d", opacity: 0.4 }}>◇</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#1a2332", letterSpacing: "-0.01em" }}>
              NeuroConnect
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {isDemo && (
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#9a9488", padding: "4px 12px", borderRadius: 20, background: "#f4f2ef" }}>
                Demo Mode
              </span>
            )}
            {profile?.role === "aan" && (
              <span
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
                  color: "#b8932e",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                  letterSpacing: "0.04em",
                  border: "1px solid #c5a24d33",
                }}
              >
                ✦ AAN OVERSIGHT
              </span>
            )}
            <button
              onClick={() => setShowNewPost(true)}
              style={{
                padding: "9px 22px",
                borderRadius: 50,
                background: "#1a2332",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "transform 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "")}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Post
            </button>
            <Avatar initials={userInitials} role={profile?.role} size={34} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 32px",
          display: "flex",
          gap: 28,
          opacity: appReady ? 1 : 0,
          transform: appReady ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s ease",
        }}
      >
        {view === "feed" ? (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Filter Bar */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                {[{ key: "all", label: "All Posts" }, ...Object.entries(POST_TYPES).map(([k, v]) => ({ key: k, label: v.label }))].map(
                  (f) => (
                    <button
                      key={f.key}
                      onClick={() => setFeedFilter(f.key)}
                      style={{
                        padding: "7px 18px",
                        borderRadius: 50,
                        border: feedFilter === f.key ? "2px solid #1a2332" : "1px solid #e8e4df",
                        background: feedFilter === f.key ? "#1a2332" : "#fff",
                        color: feedFilter === f.key ? "#fff" : "#7a746b",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "'Manrope', sans-serif",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {f.label}
                    </button>
                  )
                )}
              </div>

              {/* AI Welcome Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1a2332, #2a3a52)",
                  borderRadius: 18,
                  padding: "22px 28px",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "#c5a24d20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: "#c5a24d",
                    flexShrink: 0,
                  }}
                >
                  ✦
                </div>
                <div>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14.5, color: "#e8e4dfcc", margin: "0 0 2px", lineHeight: 1.5 }}>
                    <span style={{ color: "#fff", fontWeight: 600 }}>Personalized for you</span> — Your feed prioritizes{" "}
                    {(profile?.conditions || []).slice(0, 2).join(" & ")} content in {profile?.region}.
                  </p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12.5, color: "#c5a24d", margin: 0 }}>
                    AI adapts as you engage · {feed.length} posts in your feed
                  </p>
                </div>
              </div>

              {/* Posts */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {feed.map((post, i) => (
                  <div
                    key={post.id}
                    style={{
                      opacity: appReady ? 1 : 0,
                      transform: appReady ? "translateY(0)" : "translateY(20px)",
                      transition: `all 0.4s ease ${i * 0.06}s`,
                    }}
                  >
                    <PostCard
                      post={post}
                      users={users}
                      currentUser={profile}
                      onLike={toggleLike}
                      onSave={toggleSave}
                      onEndorse={toggleEndorse}
                      onFlagPriority={togglePriority}
                      onOpenPost={handleOpenPost}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Sidebar user={profile} posts={posts} />
          </>
        ) : (
          selectedPost && (
            <PostDetail
              post={selectedPost}
              users={users}
              currentUser={profile}
              onBack={() => setView("feed")}
              onLike={toggleLike}
              onSave={toggleSave}
              onEndorse={toggleEndorse}
              onFlagPriority={togglePriority}
              onAddComment={addComment}
            />
          )
        )}
      </div>

      {showNewPost && <NewPostModal user={profile} onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} />}
    </div>
  );
}
