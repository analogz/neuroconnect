import { useState, useEffect, useCallback } from "react";
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
import { Diamond, Plus, Star, Search, X, Bookmark } from "lucide-react";
import { Sparkles } from "lucide-react";

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

  useEffect(() => {
    if (!isMobile) setShowSidebar(false);
  }, [isMobile]);

  const navigate = useCallback((newView, params = {}) => {
    const state = { view: newView, ...params };
    history.pushState(state, "", null);
    setView(newView);
    if (params.postId !== undefined) setSelectedPostId(params.postId);
    if (params.userId !== undefined) setSelectedUserId(params.userId);
  }, []);

  useEffect(() => {
    history.replaceState({ view: "feed" }, "", null);
    const onPopState = (e) => {
      const state = e.state || { view: "feed" };
      setView(state.view || "feed");
      if (state.postId !== undefined) setSelectedPostId(state.postId);
      if (state.userId !== undefined) setSelectedUserId(state.userId);
      setShowNewPost(false);
      setShowSidebar(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleOpenPost = (id) => navigate("post", { postId: id });
  const handleOpenProfile = (userId) => navigate("profile", { userId });
  const handleBack = () => history.back();
  const handleNewPost = (data) => { addPost(data); setShowNewPost(false); };

  if (loading) return null;

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
    if (feedFilter === "saved") {
      const uid = profile?.uid || "demo-user";
      if (!p.saved && !p.savedBy?.includes(uid)) return false;
    }
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
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Header */}
      <header style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", position: "sticky", top: 0, zIndex: 50 }}>
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
            onClick={() => { if (view !== "feed") navigate("feed"); }}
          >
            <Diamond size={isMobile ? 16 : 20} style={{ color: "var(--color-gold)", opacity: 0.4 }} />
            <span className="heading" style={{ fontSize: isMobile ? 18 : 22, letterSpacing: "-0.01em" }}>
              NeuroConnect
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
            {!isMobile && isDemo && (
              <span className="chip" style={{ fontSize: 11, padding: "4px 12px" }}>
                Demo Mode
              </span>
            )}
            {!isMobile && profile?.role === "aan" && (
              <span
                className="badge"
                style={{
                  padding: "5px 14px",
                  background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
                  color: "var(--color-gold-dark)",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  border: "1px solid #c5a24d33",
                }}
              >
                <Star size={10} /> AAN OVERSIGHT
              </span>
            )}
            <button
              onClick={() => setShowNewPost(true)}
              className="btn btn-primary"
              style={{
                padding: isMobile ? "8px 14px" : "9px 22px",
                fontSize: isMobile ? 13 : 14,
              }}
            >
              <Plus size={16} />
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
              <span className="heading" style={{ fontSize: 18 }}>
                Profile & Insights
              </span>
              <button
                onClick={() => setShowSidebar(false)}
                style={{ background: "none", border: "none", color: "var(--color-text-faint)", cursor: "pointer", padding: 4 }}
              >
                <X size={20} />
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
                  color: "var(--color-text-faint)",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <Search size={14} />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, conditions, locations..."
                  className="input"
                  style={{
                    padding: isMobile ? "10px 14px 10px 38px" : "11px 16px 11px 40px",
                    borderRadius: 14,
                    background: "var(--color-surface)",
                    fontSize: isMobile ? 13 : 14,
                  }}
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
                      color: "var(--color-text-faint)",
                      cursor: "pointer",
                      padding: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter Bar */}
              <div className="filter-scroll">
                {[
                  { key: "all", label: "All Posts" },
                  ...Object.entries(POST_TYPES).map(([k, v]) => ({ key: k, label: v.label })),
                  { key: "saved", label: "Saved", icon: true },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeedFilter(f.key)}
                    style={{
                      padding: isMobile ? "6px 14px" : "7px 18px",
                      borderRadius: 50,
                      border: feedFilter === f.key ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      background: feedFilter === f.key ? "var(--color-primary)" : "var(--color-surface)",
                      color: feedFilter === f.key ? "#fff" : "var(--color-text-muted)",
                      fontSize: isMobile ? 13 : 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {f.icon && <Bookmark size={12} />} {f.label}
                  </button>
                ))}
              </div>

              {/* AI Welcome Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
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
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={isMobile ? 18 : 22} style={{ color: "var(--color-gold)" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: isMobile ? 13 : 15,
                    color: "#e8e4dfcc",
                    margin: "0 0 2px",
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#fff", fontWeight: 600 }}>Personalized for you</span> — Your feed prioritizes{" "}
                    {(profile?.conditions || []).slice(0, 2).join(" & ")} content in {profile?.region}.
                  </p>
                  <p style={{ fontSize: isMobile ? 12 : 13, color: "var(--color-gold)", margin: 0 }}>
                    AI adapts as you engage · {feed.length} posts in your feed
                  </p>
                </div>
              </div>

              {/* Posts */}
              {feed.length === 0 && feedFilter === "saved" && !searchQuery && (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--color-text-faint)",
                }}>
                  <Bookmark size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p style={{ fontSize: 15, marginBottom: 4 }}>No saved posts yet</p>
                  <p style={{ fontSize: 13 }}>Tap the save button on any post to bookmark it here.</p>
                </div>
              )}
              {feed.length === 0 && searchQuery && (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--color-text-faint)",
                }}>
                  <Search size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
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
              onBack={handleBack}
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
              onBack={handleBack}
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
