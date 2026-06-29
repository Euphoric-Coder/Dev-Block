"use client";

import BlogFetch from "@/components/Blog/BlogFetch";
import CardSkeleton from "@/components/Miscellaneous/CardSkeleton";
import QuoteOfTheDay from "@/components/Miscellaneous/QuoteOfTheDay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { formatDate } from "date-fns";
import { BookOpen, PenBox, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [blogData, setblogData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/fetch-blogs/");
      const data = await response.json();
      setblogData(data);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadBlogs();
  };

  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all duration-700 overflow-hidden">
      {/* Background Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-indigo-50/40 via-slate-50 to-transparent dark:from-indigo-950/20 dark:via-slate-950 dark:to-transparent border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="lg:w-3/5 text-center lg:text-left mb-6 lg:mb-0 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Developer Insights & Stories
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
              <span className="block text-slate-900 dark:text-white mb-2">Empower Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400 dark:from-teal-300 dark:via-blue-400 dark:to-indigo-500 leading-tight">
                Dev Journey
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium font-poppins text-justify max-w-3xl">
              <span className="block mb-4">
                Unlock insights, stories, and guides crafted for developers and
                tech explorers. Our platform empowers you to dive deep into
                practical experiences, coding patterns, and architecture
                essentials shaping the future of software.
              </span>

              <span className="block mb-4">
                From real-world case studies in{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-400">
                  Full Stack Development
                </span>{" "}
                and system design, to thought leadership in{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-pink-400">
                  AI & Machine Learning
                </span>{" "}
                — each blog brings clarity, relevance, and impact.
              </span>

              <span className="block">
                Explore powerful ideas across{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-teal-400">
                  DevOps
                </span>
                ,{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-300 dark:to-sky-400">
                  Cloud Computing
                </span>
                ,{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-400">
                  JavaScript Frameworks
                </span>{" "}
                and more — all curated to accelerate your dev journey.
              </span>
            </p>

            <QuoteOfTheDay type="blog" />

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              {/* Call to Action Buttons */}
              <Link href={"/blog/add-blog/"}>
                <button className="group flex gap-2 items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-full shadow-[0_10px_20px_rgba(59,130,246,0.2)] dark:shadow-[0_10px_20px_rgba(20,184,166,0.1)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all duration-300 dark:from-teal-400 dark:to-blue-500">
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Blogs
                </button>
              </Link>
              {/* Edit Blog Button with Dialog */}
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <button
                    className="flex gap-2 items-center px-8 py-3.5 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 font-bold rounded-full shadow-lg border border-slate-200 dark:border-slate-800 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all duration-300"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <PenBox className="w-5 h-5" />
                    Edit Blogs
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-[2rem] shadow-2xl p-6 sm:p-8">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      My Blogs
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Manage and edit your published blogs. You have{" "}
                      <span className="font-bold text-blue-600 dark:text-teal-400">{blogData.length}</span> blog(s).
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {blogData.length > 0 ? (
                      blogData.map((blog) => (
                        <div
                          key={blog.id}
                          className="group/item flex items-center justify-between p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/90 transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700"
                        >
                          <div className="flex-1 pr-6">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover/item:text-blue-600 dark:group-hover/item:text-teal-400 transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-350 line-clamp-2">
                              {blog.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-md">
                                Published: {formatDate(blog.date, "PPP")}
                              </span>
                              <span>{blog.views.toLocaleString()} views</span>
                              <span>{blog.likes} likes</span>
                            </div>
                          </div>
                          <Link href={`/blog/edit-blog/${blog.id}`}>
                            <Button size="sm" className="btn4 px-4 py-2 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md">
                              <PenBox className="h-4 w-4 mr-1.5" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          No blogs yet
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                          You haven&apos;t created any blogs yet. Start writing
                          your first blog and share your knowledge with the world!
                        </p>
                        <Link href="/blog/add-blog/">
                          <Button className="btn4 px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200">
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create Your First Blog
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative group lg:w-2/5 flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" />
            <div className="relative p-3.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 dark:border-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <Image
                src="/blog-page.png"
                alt="Blog Illustration"
                width={400}
                height={400}
                className="w-full h-auto max-w-sm rounded-[2rem] object-cover transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section Heading */}
      <section className="py-16 px-6">
        <div className="text-center mb-10 max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            Interactive Catalog
          </span>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Explore. Filter. Learn.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-355 leading-relaxed font-poppins">
            Browse curated blogs in{" "}
            <span className="font-semibold text-indigo-600 dark:text-teal-400">
              Web Development
            </span>
            ,{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              AI/ML
            </span>
            ,{" "}
            <span className="font-semibold text-emerald-600 dark:text-teal-400">
              Cloud & DevOps
            </span>{" "}
            and more — then filter by category or tag to find what fuels your
            curiosity.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            Search precisely. Filter effortlessly. View your way.
          </p>
        </div>
      </section>

      {/* Blogs Showcase Grid */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="px-4 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
            {[1, 2, 3, 4, 5, 6].map((blog) => (
              <CardSkeleton key={blog} />
            ))}
          </div>
        ) : (
          <BlogFetch blogs={blogData} refreshData={refreshData} />
        )}
      </section>
    </main>
  );
};

export default Page;
