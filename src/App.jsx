import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { usePosts } from "./hooks/usePosts";
import { useIsMobile } from "./hooks/useMediaQuery";
import { POST_TYPES } from "./data/mockData";
import { OnboardingScreen } from "./components/Onboarding";
import { PostCard } from "./components/PostCard";
import { PostDetail } from "./components/PostDetail";
import { Sidebar } from "./components/Sidebar";
import { NewPostModal } from "./components/NewPostModal";
import { UserProfile } from "./components/UserProfile";
import { ActivityBell } from "./components/ActivityFeed";
import { Avatar } from "./components/common";

export default function App() {
  const { user, profile, loading, isDemo, isAuthenticated, needsOnboarding, signInWithGoogle, signOut, saveProfile } = useAuth();
  const { posts, users, sortedPosts, addPost, toggleLike, toggleSave, toggleEndorse, togglePriority, updateStatus, addComment } = usePosts(profile);
  const isMobile = useIsMobile();

  const [view, setView] = useState("feed");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [feedFilter, setFeedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appReady, setAppReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setTimeout(() => setAppReady(true), 100);
  }, [isAuthenticated]);

  // Close sidebar drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) setShowSidebar(false);
  }, [isMobile]);

  const handleOpenPost = (id) => {
    setSelectedPostId(id);
    setView("post");
  };

  const handleOpenProfile = (userId) => {
    setSelectedUserId(userId);
    setView("profile");
  };

  const handleNewPost = (data) => {
    addPost(data);
    setShowNewPost(false);
  };

  // Loading auth state
  if (loading) return null;

  // Not authenticated or needs to complete onboarding profile
  if (!isAuthenticated || needsOnboarding) {
    return (
      <OnboardingScreen
        onComplete={saveProfile}
        onGoogleSignIn={!isDemo ? signInWithGoogle : null}
        isDemo={isDemo}
        userName={user?.displayName || ""}
        skipWelcome={needsOnboarding && !isDemo}
      />
    );
  }

  const feed = sortedPosts(feedFilter === "saved" ? "all" : feedFilter).filter((p) => {
    // Saved filter
    if (feedFilter === "saved") {
      const uid = profile?.uid || "demo-user";
      if (!p.saved && !p.savedBy?.includes(uid)) return false;
    }
    // Search filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.body?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.conditions?.some((c) => c.toLowerCase().includes(q)) ||
      p.authorName?.toLowerCase().includes(q)
    );
  });
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
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 32px",
          height: isMobile ? 56 : 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, cursor: "pointer" }}
            onClick={() => setView("feed")}
          >
            <span style={{ fontSize: isMobile ? 16 : 20, color: "#c5a24d", opacity: 0.4 }}>◇</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? 18 : 22,
              fontWeight: 600,
              color: "#1a2332",
              letterSpacing: "-0.01em",
            }}>
              NeuroConnect
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
            {!isMobile && isDemo && (
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#9a9488", padding: "4px 12px", borderRadius: 20, background: "#f4f2ef" }}>
                Demo Mode
              </span>
            )}
            {!isMobile && profile?.role === "aan" && (
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
                padding: isMobile ? "8px 14px" : "9px 22px",
                borderRadius: 50,
                background: "#1a2332",
                color: "#fff",
                fontSize: isMobile ? 13 : 13.5,
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
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              {!isMobile && " New Post"}
            </button>
            <ActivityBell
              posts={posts}
              currentUser={profile}
              users={users}
              onOpenPost={handleOpenPost}
              compact={isMobile}
            />
            <div
              onClick={() => isMobile ? setShowSidebar(true) : handleOpenProfile("self")}
              style={{ cursor: "pointer" }}
            >
              <Avatar initials={userInitials} role={profile?.role} size={isMobile ? 32 : 34} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <>
          <div className={`sidebar-overlay ${showSidebar ? "open" : ""}`} onClick={() => setShowSidebar(false)} />
          <div className={`sidebar-drawer ${showSidebar ? "open" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#1a2332" }}>
                Profile & Insights
              </span>
              <button
                onClick={() => setShowSidebar(false)}
                style={{ background: "none", border: "none", fontSize: 20, color: "#9a9488", cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>
            <Sidebar user={profile} posts={posts} onSignOut={signOut} onOpenProfile={(id) => { setShowSidebar(false); handleOpenProfile(id); }} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "16px" : "28px 32px",
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
              {/* Search Bar */}
              <div style={{ marginBottom: isMobile ? 12 : 16, position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  color: "#9a9488",
                  pointerEvents: "none",
                }}>
                  🔍
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, conditions, locations..."
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 14px 10px 38px" : "11px 16px 11px 40px",
                    borderRadius: 14,
                    border: "1px solid #e8e4df",
                    fontSize: isMobile ? 13 : 14,
                    fontFamily: "'Manrope', sans-serif",
                    background: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c5a24d")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8e4df")}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      fontSize: 14,
                      color: "#9a9488",
                      cursor: "pointer",
                      padding: 2,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Bar */}
              <div className="filter-scroll">
                {[{ key: "all", label: "All Posts" }, ...Object.entries(POST_TYPES).map(([k, v]) => ({ key: k, label: v.label })), { key: "saved", label: "⊹ Saved" }].map(
                  (f) => (
                    <button
                      key={f.key}
                      onClick={() => setFeedFilter(f.key)}
                      style={{
                        padding: isMobile ? "6px 14px" : "7px 18px",
                        borderRadius: 50,
                        border: feedFilter === f.key ? "2px solid #1a2332" : "1px solid #e8e4df",
                        background: feedFilter === f.key ? "#1a2332" : "#fff",
                        color: feedFilter === f.key ? "#fff" : "#7a746b",
                        fontSize: isMobile ? 12.5 : 13,
                        fontWeight: 600,
                        fontFamily: "'Manrope', sans-serif",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
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
                  borderRadius: isMobile ? 14 : 18,
                  padding: isMobile ? "16px 18px" : "22px 28px",
                  marginBottom: isMobile ? 16 : 24,
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 12 : 18,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 36 : 44,
                    height: isMobile ? 36 : 44,
                    borderRadius: isMobile ? 10 : 14,
                    background: "#c5a24d20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 18 : 22,
                    color: "#c5a24d",
                    flexShrink: 0,
                  }}
                >
                  ✦
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: isMobile ? 13 : 14.5,
                    color: "#e8e4dfcc",
                    margin: "0 0 2px",
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#fff", fontWeight: 600 }}>Personalized for you</span> — Your feed prioritizes{" "}
                    {(profile?.conditions || []).slice(0, 2).join(" & ")} content in {profile?.region}.
                  </p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: isMobile ? 11.5 : 12.5, color: "#c5a24d", margin: 0 }}>
                    AI adapts as you engage · {feed.length} posts in your feed
                  </p>
                </div>
              </div>

              {/* Posts */}
              {feed.length === 0 && feedFilter === "saved" && !searchQuery && (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  fontFamily: "'Manrope', sans-serif",
                  color: "#9a9488",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>⊹</div>
                  <p style={{ fontSize: 15, marginBottom: 4 }}>No saved posts yet</p>
                  <p style={{ fontSize: 13 }}>Tap the save button on any post to bookmark it here.</p>
                </div>
              )}
              {feed.length === 0 && searchQuery && (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  fontFamily: "'Manrope', sans-serif",
                  color: "#9a9488",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                  <p style={{ fontSize: 15, marginBottom: 4 }}>No posts match "{searchQuery}"</p>
                  <p style={{ fontSize: 13 }}>Try different keywords or clear the filter.</p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
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
                      onUpdateStatus={updateStatus}
                      onOpenPost={handleOpenPost}
                      onOpenProfile={handleOpenProfile}
                      compact={isMobile}
                    />
                  </div>
                ))}
              </div>
            </div>

            {!isMobile && <Sidebar user={profile} posts={posts} onSignOut={signOut} onOpenProfile={handleOpenProfile} />}
          </>
        ) : (
          view === "post" && selectedPost ? (
            <PostDetail
              post={selectedPost}
              users={users}
              allPosts={posts}
              currentUser={profile}
              onBack={() => setView("feed")}
              onLike={toggleLike}
              onSave={toggleSave}
              onEndorse={toggleEndorse}
              onFlagPriority={togglePriority}
              onUpdateStatus={updateStatus}
              onAddComment={addComment}
              onOpenProfile={handleOpenProfile}
              onOpenPost={handleOpenPost}
              compact={isMobile}
            />
          ) : view === "profile" && (
            <UserProfile
              userId={selectedUserId}
              users={users}
              posts={posts}
              currentUser={profile}
              onBack={() => setView("feed")}
              onOpenPost={handleOpenPost}
              compact={isMobile}
            />
          )
        )}
      </div>

      {showNewPost && <NewPostModal user={profile} onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} fullScreen={isMobile} />}
    </div>
  );
}
