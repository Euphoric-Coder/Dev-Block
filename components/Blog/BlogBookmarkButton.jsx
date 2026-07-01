"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility for class merging

export default function BlogBookmark({
  blogId,
  onChange,
  showIconOnly = false,
  listView = false
}) {
  const { isSignedIn, user } = useUser();
  const [bookmarked, setBookmarked] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch("/api/check-blog-bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blogId,
            email: user.primaryEmailAddress.emailAddress,
          }),
        });

        const data = await res.json();
        setBookmarked(data.bookmarked);
      } catch (err) {
        console.error("Error checking bookmark:", err);
      }
    };

    checkBookmarkStatus();
  }, [isSignedIn, user, blogId]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async () => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

    try {
      const res = await fetch("/api/toggle-blog-bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          email: user.primaryEmailAddress.emailAddress,
          time: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.bookmarked === true) {
        setBookmarked(true);
        onChange?.(blogId, true);
      } else if (data.bookmarked === false) {
        setBookmarked(false);
        onChange?.(blogId, false);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  }, [isSignedIn, user, blogId, onChange]);

  return (
    <button
      onClick={toggleBookmark}
      className={cn(
        "flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-md",
        showIconOnly
          ? listView
            ? `p-2.5 rounded-full backdrop-blur-md border ${
                bookmarked
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500"
              }`
            : `p-2.5 rounded-full backdrop-blur-md border ${
                bookmarked
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "bg-slate-950/40 border-white/10 text-white hover:text-amber-400"
              }`
          : cn(
              "px-3.5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-sm gap-1.5",
              bookmarked
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
            )
      )}
      aria-pressed={bookmarked}
    >
      <Bookmark
        className={cn("h-3.5 w-3.5 transition-all duration-300", bookmarked && "scale-110")}
        fill={bookmarked ? "currentColor" : "none"}
      />
      {!showIconOnly && (
        <span>
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </button>
  );
}
