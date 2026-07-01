"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  Share2,
  Heart,
  Bookmark,
  Calendar,
  ArrowLeft,
  PenBox,
  LayoutDashboard,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { processContent } from "@/lib/processContent";
import BlogLoader from "@/components/Blog/BlogLoader";
import Comment from "@/components/Blog/Comments";
import Image from "next/image";
import BlogShare from "@/components/Blog/BlogShare";
import NotSignedIn from "@/components/Miscellaneous/NotSignedIn";

export default function Page() {
  const blogId = useParams().id;
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [blogData, setBlogData] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [htmlContent, setHtmlContent] = useState("");

  // Load blog data when blogId changes
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch(`/api/fetch-blogs/${blogId}`);
        const data = await response.json();
        setBlogData(data);
        setLikesCount(data.likes || 0);
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };

    loadBlog();
  }, [blogId]);

  // Convert blog content when blogData updates
  useEffect(() => {
    if (blogData) {
      setHtmlContent(processContent(blogData.content));
    }
  }, [blogData]);

  // Check if user liked this blog (when blogId and isSignedIn change)
  useEffect(() => {
    const checkIfLiked = async () => {
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
        setIsLiked(data.liked);
      } catch (err) {
        console.error("Error checking like:", err);
      }
    };

    checkIfLiked();
  }, [blogId, isSignedIn, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    const checkIfBookmarked = async () => {
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
        setIsBookmarked(data.bookmarked);
      } catch (err) {
        console.error("Error checking bookmark:", err);
      }
    };

    checkIfBookmarked();
  }, [blogId, isSignedIn, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (!isSignedIn) return;

    const viewBlog = async () => {
      try {
        const res = await fetch("/api/view-blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blogId: blogId }),
        });

        console.log(res);
      } catch (error) {
        console.error("Error logging blog view:", error);
      }
    };

    viewBlog();
  }, [blogId]);

  const redirectBlogEditor = () => {
    router.push(`/blog/edit-blog/${blogId}`);
  };

  if (!blogData) {
    return <BlogLoader />;
  }

  const handleLikeToggle = async () => {
    if (!isSignedIn) {
      setShowSignInModal(true);
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

      if (!res.ok) {
        console.error("Server error:", await res.text());
        return;
      }

      const data = await res.json();

      if (typeof data.liked === "boolean") {
        setIsLiked(data.liked);
        setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
      } else {
        console.warn("Unexpected like response:", data);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isSignedIn) {
      setShowSignInModal(true);
      return;
    }

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
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const placeholderImage = "/placeholder.png"; // Fallback image

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] md:h-[60vh] w-full bg-[length:100%_100%] bg-no-repeat bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${blogData?.blogImage || placeholderImage})`,
        }}
      >
        <div className="relative z-20 w-full flex gap-2 items-center justify-between px-4 sm:px-6 md:px-10 py-4">
          <button
            onClick={() => router.push("/blog")}
            className="group flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <ArrowLeft className="w-6 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-4">
            {user?.primaryEmailAddress?.emailAddress ===
              blogData?.createdBy && (
              <button
                onClick={console.log("working on it")}
                className="group flex items-center bg-indigo-600/80 backdrop-blur-sm hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all duration-300 border border-indigo-500/50 hover:border-indigo-400"
              >
                <PenBox className="w-6 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Edit</span>
              </button>
            )}
            <button
              onClick={() => router.push("/blog")}
              className="group flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <LayoutDashboard className="w-6 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Go to Dashboard</span>
            </button>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-10 text-white">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium mb-4">
              {blogData.category}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
              {blogData.title}
            </h1>

            <p className="text-lg md:text-xl opacity-90 mb-6">
              {blogData.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <Image
                  src={blogData?.author?.avatar || "/default-avatar.jpg"}
                  alt={blogData?.author?.name || "Author"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{blogData?.author?.name || "Anonymous"}</span>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{blogData?.readingTime || 0} min read</span>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{format(new Date(blogData.date), "PPP")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Share and Save Buttons */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center transition-colors ${
                  isLiked
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                <span>
                  {isLiked ? "Liked" : "Like"} ({likesCount})
                </span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                <span>Share</span>
              </button>
            </div>
            <button
              onClick={handleBookmarkToggle}
              className={`flex items-center transition-colors ${
                isBookmarked
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <Bookmark className="w-5 h-5 mr-2 fill-current" />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>

          {/* Main Blog Content */}
          <article className="prose prose-lg lg:prose-xl dark:prose-invert prose-indigo max-w-none">
            <div className="blog-content">{htmlContent}</div>
          </article>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <Image
                src={blogData.author.avatar || "/default-avatar.jpg"}
                alt={blogData.author.name || "Author"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
                draggable={false}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {blogData.author.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Content creator and technology enthusiast. Writing about the
                  future of technology and how it shapes our world.
                </p>
              </div>
            </div>
          </div>

          {/* BlogComments */}
          {/* <CommentSection
            comments={blogData.comments || []}
            onAddComment={handleAddComment}
          /> */}

          {/* Blog Share Modal */}
          <BlogShare
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title={blogData.title}
            description={blogData.description}
            url={`${typeof window !== "undefined" ? window.location.origin : ""}/blogpost/${blogId}`}
          />

          <NotSignedIn
            isOpen={showSignInModal}
            onClose={() => setShowSignInModal(false)}
            onSignIn={() => router.push("/sign-in")}
          />

          <Comment blogId={blogId} />
        </div>
      </div>
    </div>
  );
}
