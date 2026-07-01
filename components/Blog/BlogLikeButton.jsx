"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BlogLike({
  blogId,
  initialLikes = 0,
  onChange,
  showIconOnly = false,
  listView = false,
}) {
  const { isSignedIn, user } = useUser();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  // Check if this blog is liked by current user
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch("/api/check-blog-like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blogId,
            email: user.primaryEmailAddress.emailAddress,
          }),
        });

        const data = await res.json();
        setLiked(data.liked);
      } catch (err) {
        console.error("Error checking like:", err);
      }
    };

    checkLikedStatus();
  }, [isSignedIn, user, blogId]);

  // Handle like toggle
  const toggleLike = useCallback(async () => {
    // console.log("Toggling like for blog:", blogId);
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
      // Optionally open login modal
      return;
    }

    try {
      const res = await fetch("/api/toggle-blog-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          email: user.primaryEmailAddress.emailAddress,
          time: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.liked === true) {
        setLiked(true);
        setLikes((prev) => prev + 1);
        onChange?.(blogId, likes + 1, true);
      } else if (data.liked === false) {
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
        onChange?.(blogId, Math.max(0, likes - 1), false);
      }
      toast.success(
        data.liked ? "Liked the blog!" : "Removed like from the blog!"
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }, [isSignedIn, user, blogId, likes, onChange]);

  return (
    <button
      onClick={toggleLike}
      className={cn(
        "flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-md",
        showIconOnly
          ? listView
            ? `p-2.5 rounded-full backdrop-blur-md border ${
                liked
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                  : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:text-rose-500"
              }`
            : `p-2.5 rounded-full backdrop-blur-md border ${
                liked
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-450"
                  : "bg-slate-950/40 border-white/10 text-white hover:text-rose-400"
              }`
          : cn(
              "px-3.5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-sm gap-1.5",
              liked
                ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-850 text-slate-605 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
            )
      )}
      aria-pressed={liked}
    >
      <Heart
        className={cn("h-3.5 w-3.5 transition-all duration-300", liked && "scale-110 fill-current")}
      />
      {!showIconOnly && (
        <span className="font-bold">
          {likes}
        </span>
      )}
    </button>
  );
}
