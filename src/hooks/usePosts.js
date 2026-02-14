import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";
import { SEED_POSTS, SEED_USERS } from "../data/mockData";

/**
 * usePosts — real-time post feed from Firestore, or mock data in demo mode.
 * Handles CRUD, likes, saves, AAN endorsements, and AI relevance scoring.
 */
export function usePosts(profile) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(SEED_USERS);
  const [loading, setLoading] = useState(true);
  const isDemo = !isFirebaseConfigured;

  // Load posts
  useEffect(() => {
    if (isDemo) {
      // Demo mode — use seed data with AI reasons injected
      const enriched = SEED_POSTS.map((p) => ({
        ...p,
        aiReason: getAiReason(p, profile),
      }));
      setPosts(enriched);
      setLoading(false);
      return;
    }

    // Firestore real-time listener
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const livePosts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        aiReason: getAiReason(d.data(), profile),
      }));
      setPosts(livePosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo, profile]);

  // --- Actions ---

  const addPost = useCallback(
    async ({ type, title, body, conditions, location }) => {
      const newPost = {
        type,
        title,
        body,
        conditions,
        location,
        region: profile?.region || "",
        authorId: profile?.uid || "demo-user",
        authorName: profile?.name || "You",
        authorRole: profile?.role || "community",
        authorAvatar:
          profile?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "YO",
        likes: 0,
        likedBy: [],
        saves: 0,
        savedBy: [],
        comments: [],
        status: type === "need" ? "open" : null,
        aanEndorsed: false,
        aanEndorsedBy: null,
        aanPriority: false,
        createdAt: isDemo ? new Date().toISOString() : serverTimestamp(),
        time: "Just now",
      };

      if (isDemo) {
        setPosts((prev) => [
          { ...newPost, id: "p-" + Date.now(), aiReason: "Your new post" },
          ...prev,
        ]);
        return;
      }

      await addDoc(collection(db, "posts"), newPost);
    },
    [profile, isDemo]
  );

  const toggleLike = useCallback(
    async (postId) => {
      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
              : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      const uid = profile?.uid;
      if (!uid) return;

      const isLiked = post?.likedBy?.includes(uid);
      await updateDoc(postRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(uid) : arrayUnion(uid),
      });
    },
    [posts, profile, isDemo]
  );

  const toggleSave = useCallback(
    async (postId) => {
      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, saves: p.saved ? p.saves - 1 : p.saves + 1, saved: !p.saved }
              : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      const uid = profile?.uid;
      if (!uid) return;

      const isSaved = post?.savedBy?.includes(uid);
      await updateDoc(postRef, {
        saves: increment(isSaved ? -1 : 1),
        savedBy: isSaved ? arrayRemove(uid) : arrayUnion(uid),
      });
    },
    [posts, profile, isDemo]
  );

  const toggleEndorse = useCallback(
    async (postId) => {
      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, aanEndorsed: !p.aanEndorsed } : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      await updateDoc(postRef, {
        aanEndorsed: !post?.aanEndorsed,
        aanEndorsedBy: post?.aanEndorsed ? null : profile?.uid,
      });
    },
    [posts, profile, isDemo]
  );

  const togglePriority = useCallback(
    async (postId) => {
      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, aanPriority: !p.aanPriority } : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      await updateDoc(postRef, {
        aanPriority: !post?.aanPriority,
      });
    },
    [posts, profile, isDemo]
  );

  const updateStatus = useCallback(
    async (postId, newStatus) => {
      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, status: newStatus } : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { status: newStatus });
    },
    [isDemo]
  );

  const addComment = useCallback(
    async (postId, text) => {
      const comment = {
        id: "c-" + Date.now(),
        authorId: profile?.uid || "demo-user",
        authorName: profile?.name || "You",
        authorRole: profile?.role || "community",
        authorAvatar:
          profile?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "YO",
        body: text,
        time: "Just now",
        createdAt: new Date().toISOString(),
      };

      if (isDemo) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, comment] }
              : p
          )
        );
        return;
      }

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });
    },
    [profile, isDemo]
  );

  // Sort posts by relevance to current user
  const sortedPosts = useCallback(
    (filter = "all") => {
      return [...posts]
        .filter((p) => filter === "all" || p.type === filter)
        .sort((a, b) => {
          const score = (p) => {
            let s = 0;
            if (profile) {
              if (p.conditions?.some((c) => profile.conditions?.includes(c))) s += 3;
              if (p.region === profile.region) s += 2;
              if (p.aanPriority) s += 2;
              if (p.aanEndorsed) s += 1;
            }
            return s;
          };
          return score(b) - score(a);
        });
    },
    [posts, profile]
  );

  return {
    posts,
    users,
    loading,
    sortedPosts,
    addPost,
    toggleLike,
    toggleSave,
    toggleEndorse,
    togglePriority,
    updateStatus,
    addComment,
  };
}

// --- Helpers ---

function getAiReason(post, profile) {
  if (!profile) return null;
  const matchesCondition = post.conditions?.some((c) =>
    profile.conditions?.includes(c)
  );
  const matchesRegion = post.region === profile.region;

  if (matchesCondition && matchesRegion) {
    const match = post.conditions.find((c) => profile.conditions?.includes(c));
    return `Matches your interest in ${match} and your region`;
  }
  if (matchesCondition) {
    const match = post.conditions.find((c) => profile.conditions?.includes(c));
    return `Related to ${match} — a condition you follow`;
  }
  if (matchesRegion) return `Happening in ${profile.region}, your local area`;
  if (post.aanPriority) return "Flagged as a priority need by AAN members";
  if (post.likes > 80) return "Trending in the NeuroConnect community";
  return null;
}
