import { useState } from "react";
import { SEED_USERS } from "../data/mockData";
import { Avatar } from "./common";

export function ActivityBell({ posts, currentUser, users, onOpenPost, compact }) {
  const [open, setOpen] = useState(false);

  const allUsers = [...SEED_USERS, ...(users || [])];

  // Build activity items from posts the current user authored
  const myPosts = posts.filter(
    (p) => p.authorId === (currentUser?.uid || currentUser?.id || "demo-user")
  );

  const activities = [];

  myPosts.forEach((post) => {
    // Comments on my posts
    (post.comments || []).forEach((comment) => {
      if (comment.authorId !== currentUser?.uid && comment.authorId !== "demo-user") {
        const commenter = allUsers.find((u) => u.id === comment.authorId) || { name: comment.authorName || "Someone", avatar: comment.authorAvatar || "??" , role: comment.authorRole || "community" };
        activities.push({
          id: `comment-${comment.id}`,
          type: "comment",
          user: commenter,
          postTitle: post.title,
          postId: post.id,
          text: comment.body,
          time: comment.time,
        });
      }
    });

    // Endorsements on my posts
    if (post.aanEndorsed && post.aanEndorsedBy) {
      const endorser = allUsers.find((u) => u.id === post.aanEndorsedBy);
      if (endorser && endorser.id !== currentUser?.uid) {
        activities.push({
          id: `endorse-${post.id}`,
          type: "endorse",
          user: endorser,
          postTitle: post.title,
          postId: post.id,
          time: post.time,
        });
      }
    }

    // Priority flags on my posts
    if (post.aanPriority) {
      activities.push({
        id: `priority-${post.id}`,
        type: "priority",
        postTitle: post.title,
        postId: post.id,
        time: post.time,
      });
    }
  });

  // Also show engagement on posts where user commented
  posts.forEach((post) => {
    if (myPosts.some((p) => p.id === post.id)) return;
    const userCommented = (post.comments || []).some(
      (c) => c.authorId === (currentUser?.uid || currentUser?.id || "demo-user")
    );
    if (userCommented && post.aanEndorsed) {
      activities.push({
        id: `thread-endorse-${post.id}`,
        type: "thread_endorsed",
        postTitle: post.title,
        postId: post.id,
        time: post.time,
      });
    }
  });

  const count = activities.length;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: compact ? 16 : 18,
          color: "#7a746b",
          padding: "4px 6px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        🔔
        {count > 0 && (
          <span style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#d4764e",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Manrope', sans-serif",
          }}>
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 80 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: compact ? "calc(100vw - 32px)" : 360,
            maxHeight: 420,
            overflow: "auto",
            background: "#fff",
            borderRadius: 18,
            border: "1px solid #e8e4df",
            boxShadow: "0 12px 40px #1a233220",
            zIndex: 90,
            padding: "16px",
          }}>
            <h3 style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#1a2332",
              margin: "0 0 12px",
            }}>
              Activity
            </h3>

            {activities.length === 0 ? (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#9a9488", textAlign: "center", padding: "20px 0" }}>
                No activity yet. Engagement on your posts will show up here.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { onOpenPost(item.postId); setOpen(false); }}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f8f7f5")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.user ? (
                      <Avatar initials={item.user.avatar} role={item.user.role} size={32} />
                    ) : (
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", background: "#f4f2ef",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, flexShrink: 0,
                      }}>
                        {item.type === "priority" ? "◈" : "✦"}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#1a2332", margin: "0 0 2px", lineHeight: 1.4 }}>
                        {item.type === "comment" && (
                          <><strong>{item.user.name}</strong> commented on <em>{item.postTitle}</em></>
                        )}
                        {item.type === "endorse" && (
                          <><strong>{item.user.name}</strong> endorsed <em>{item.postTitle}</em></>
                        )}
                        {item.type === "priority" && (
                          <>Your post <em>{item.postTitle}</em> was flagged as priority</>
                        )}
                        {item.type === "thread_endorsed" && (
                          <>A post you commented on was AAN endorsed: <em>{item.postTitle}</em></>
                        )}
                      </p>
                      {item.text && (
                        <p style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: 12,
                          color: "#7a746b",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          "{item.text}"
                        </p>
                      )}
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#b0aaa2" }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
