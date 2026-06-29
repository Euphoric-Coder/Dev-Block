"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  CalendarIcon,
  Clock,
  Eye,
  Filter,
  Grid,
  Heart,
  List,
  MoreHorizontal,
  Search,
  Share2,
  Tag,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { blogCategories, blogSubCategoriesList } from "@/lib/data";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import BlogShare from "./BlogShare";
import { useUser } from "@clerk/nextjs";
import BlogLike from "./BlogLikeButton";
import BlogBookmark from "./BlogBookmarkButton";
import FilterButton from "./FilterButton";

const BlogFetch = ({ blogs, refreshData }) => {
  // Helper to extract initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Subcategory display component
  const SubcategoryDisplay = ({ blog }) => {
    const maxVisible = 2;
    const visibleSubcategories = Array.isArray(blog.subCategories)
      ? blog.subCategories.slice(0, maxVisible)
      : [];
    const remainingCount = Array.isArray(blog.subCategories)
      ? blog.subCategories.length - maxVisible
      : 0;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleSubcategories.map((subcategory) => (
          <span
            key={subcategory}
            className="inline-block px-2.5 py-0.5 bg-sky-500/10 dark:bg-teal-400/10 text-sky-700 dark:text-teal-400 border border-sky-500/20 dark:border-teal-400/20 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition-transform duration-300"
          >
            {subcategory}
          </span>
        ))}

        {remainingCount > 0 && (
          <HoverCard>
            <HoverCardTrigger>
              <button className="flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 text-xs rounded-full border border-slate-200 dark:border-slate-750 font-medium hover:bg-slate-250 dark:hover:bg-slate-700 transition-all duration-200">
                <MoreHorizontal className="h-3 w-3 mr-0.5" />+{remainingCount}{" "}
                more
              </button>
            </HoverCardTrigger>

            <HoverCardContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3">
              <div className="">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  All Subcategories ({blog.subCategories.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {blog.subCategories.map((subcategory) => (
                    <span
                      key={subcategory}
                      className="px-2 py-0.5 bg-slate-50 dark:bg-slate-850 text-slate-650 dark:text-slate-300 text-xs border border-slate-100 dark:border-slate-800 rounded-full font-medium"
                    >
                      {subcategory}
                    </span>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
  };

  const fetchIndividualBlog = (id) => {
    return blogs.find((blog) => blog.id === id);
  };

  const BlogCard = ({ blog, isListView = false }) => {
    if (isListView) {
      return (
        <article className="group relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1">
          <div className="relative flex flex-col lg:flex-row">
            {/* Image */}
            <div className="relative lg:w-80 h-52 lg:h-auto overflow-hidden">
              <img
                src={blog.blogImage || "/placeholder.png"}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {blog.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Featured
                  </span>
                )}
                {blog.trending && (
                  <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center shadow-lg">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between relative space-y-4">
              <div className="space-y-3">
                {/* Category and Quick Actions */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 rounded-full shadow-sm">
                    {blog.category}
                  </span>
                  <div className="flex items-center space-x-1.5 p-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full border border-white/30 dark:border-slate-800/40 shadow-sm">
                    <BlogLike
                      blogId={blog.id}
                      initialLikes={likesMap[blog.id] ?? blog.likes ?? 0}
                      onChange={handleLikeChange}
                      showIconOnly={true}
                      listView={true}
                    />
                    <BlogBookmark
                      blogId={blog.id}
                      onChange={handleBookmarkChange}
                      showIconOnly={true}
                      listView={true}
                    />
                    <button
                      className="p-1.5 hover:text-blue-650 dark:hover:text-teal-400 transition-colors text-slate-500"
                      onClick={() => {
                        setIndividualBlog(fetchIndividualBlog(blog.id));
                        setIsShareOpen(true);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-medium font-poppins">
                  {blog.description}
                </p>

                {/* Subcategories */}
                {blog.subCategories && blog.subCategories.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Topics
                    </div>
                    <SubcategoryDisplay blog={blog} />
                  </div>
                )}

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex gap-1 items-center px-2.5 py-0.5 bg-blue-50/85 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/10 text-blue-600 dark:text-teal-400 text-xs font-semibold rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 dark:from-teal-400 dark:to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                    {getInitials(blog.author)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {blog.author}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                      {format(new Date(blog.date), "PPP")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{blog.views ?? "0"}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-slate-250 dark:bg-slate-700" />
                    <span>{blog.readTime}</span>
                  </div>

                  <Link href={`/blogpost/${blog.id}`}>
                    <button className="group/btn inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-teal-400 hover:text-blue-700 dark:hover:text-teal-350 transition-colors">
                      Read More
                      <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article className="group relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full">
        {/* Cover Image Container */}
        <div className="relative h-56 overflow-hidden rounded-t-[2rem]">
          <img
            src={blog.blogImage || "/placeholder.png"}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

          {/* Badges floating on image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {blog.featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                Featured
              </span>
            )}
            {blog.trending && (
              <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </span>
            )}
          </div>

          {/* Quick Actions floating top-right */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
            <div className="flex gap-1.5 p-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full border border-white/40 dark:border-slate-800/40 shadow-md">
              <BlogBookmark
                blogId={blog.id}
                onChange={handleBookmarkChange}
                showIconOnly={true}
              />
              <BlogLike
                blogId={blog.id}
                initialLikes={likesMap[blog.id] ?? blog.likes ?? 0}
                onChange={handleLikeChange}
                showIconOnly={true}
              />
              <button
                className="p-2 text-slate-750 hover:text-blue-600 dark:text-slate-350 dark:hover:text-teal-400 transition-colors"
                onClick={() => {
                  setIndividualBlog(fetchIndividualBlog(blog.id));
                  setIsShareOpen(true);
                }}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Category badge */}
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 text-xs font-bold bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 rounded-full shadow-sm">
                {blog.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{blog.readTime}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors duration-300 leading-snug line-clamp-2">
              {blog.title}
            </h3>

            {/* Description */}
            <p className="text-slate-650 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-medium font-poppins">
              {blog.description ?? "No Description Available"}
            </p>

            {/* Subcategories */}
            {blog.subCategories && blog.subCategories.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Topics
                </div>
                <SubcategoryDisplay blog={blog} />
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex gap-1 items-center px-2.5 py-0.5 bg-blue-50/85 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/10 text-blue-600 dark:text-teal-400 text-xs font-semibold rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/85">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span className="font-semibold">{blog.views ?? "0"}</span>
              </div>
              <BlogLike
                blogId={blog.id}
                initialLikes={likesMap[blog.id] ?? blog.likes ?? 0}
                onChange={handleLikeChange}
              />
              <BlogBookmark blogId={blog.id} onChange={handleBookmarkChange} />
            </div>
          </div>

          {/* Footer Card Section with Author */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 dark:from-teal-400 dark:to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                {getInitials(blog.author)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {blog.author}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {format(new Date(blog.date), "PPP")}
                </span>
              </div>
            </div>

            <Link href={`/blogpost/${blog.id}`}>
              <button className="group/btn inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-teal-400 hover:text-blue-700 dark:hover:text-teal-350 transition-colors">
                Read More
                <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </div>
      </article>
    );
  };

  useEffect(() => {
    const updateViewMode = () => {
      if (window.innerWidth < 768) {
        setViewMode("grid"); // force grid for small screens
      }
    };

    updateViewMode(); // call on mount
    window.addEventListener("resize", updateViewMode); // optional: respond to resize

    return () => window.removeEventListener("resize", updateViewMode);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [individualBlog, setIndividualBlog] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [likesMap, setLikesMap] = useState(() => {
    return Object.fromEntries(blogs.map((b) => [b.id, b.likes ?? 0]));
  });
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  const [viewMode, setViewMode] = useState("grid");
  const [tempFilters, setTempFilters] = useState({
    authors: [],
    category: [],
    subCategories: [],
    dateRange: { from: "", to: "" },
    oldestBlog: false,
  });
  const selectedCategoryCount = tempFilters.category
    ? tempFilters.category.length
    : 0;
  const selectedSubCategoryCount = tempFilters.subCategories
    ? tempFilters.subCategories.length
    : 0;
  const selectedAuthorCount = tempFilters.authors
    ? tempFilters.authors.length
    : 0;
  const blogAuthors = [...new Set(blogs.map((blog) => blog.author))];
  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSearchActive = searchTerm !== ""; // Check if there is text in the search bar

  const filterCount = useMemo(() => {
    let count = 0;
    count += tempFilters.authors.length;
    count += tempFilters.category.length;
    count += tempFilters.subCategories.length;
    if (tempFilters.dateRange.from) count += 1;
    if (tempFilters.dateRange.to) count += 1;
    if (tempFilters.oldestBlog) count += 1;
    return count;
  }, [tempFilters]);

  const filteredBlogs = useMemo(() => {
    let filters = blogs.filter((bg) => {
      const filtersToApply = appliedFilters;

      const matchesSearch =
        bg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bg.subCategories?.toString().includes(searchTerm.toLowerCase()) ||
        bg.category.includes(searchTerm.toLowerCase()) ||
        bg.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filtersToApply.category.length === 0 ||
        filtersToApply.category.includes(bg.category.toLowerCase());

      const blogSubCategories = bg.subCategories
        ? bg.subCategories.map((sub) => sub.trim()) // Convert to array and trim spaces
        : [];

      const matchesSubCategory =
        tempFilters.subCategories.length === 0 ||
        blogSubCategories.some((sub) =>
          tempFilters.subCategories.includes(sub)
        );

      const matchesDateRange =
        (!filtersToApply.dateRange.from ||
          bg.date.split(" ")[0] >= filtersToApply.dateRange.from) &&
        (!filtersToApply.dateRange.to ||
          bg.date.split(" ")[0] <= filtersToApply.dateRange.to);

      const matchesAuthor =
        filtersToApply.authors.length === 0 || // Check if no authors are selected
        filtersToApply.authors.includes(bg.author.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesDateRange &&
        matchesAuthor
      );
    });

    // Conditionally sort by oldest
    // If oldestBlog is true, reverse the filtered list
    if (appliedFilters.oldestBlog) {
      filters = [...filters].reverse(); // clone before reverse to avoid mutating original array
    }
    return filters;
  }, [searchTerm, appliedFilters, blogs]);

  const previewedBlogs = useMemo(() => {
    let filtered = blogs.filter((bg) => {
      const matchesCategory =
        tempFilters.category.length === 0 ||
        tempFilters.category.includes(bg.category.toLowerCase());

      const blogSubCategories = bg.subCategories
        ? bg.subCategories.map((sub) => sub.trim())
        : [];

      const matchesSubCategory =
        tempFilters.subCategories.length === 0 ||
        blogSubCategories.some((sub) =>
          tempFilters.subCategories.includes(sub)
        );

      const matchesAuthor =
        tempFilters.authors.length === 0 || // Check if no authors are selected
        tempFilters.authors.includes(bg.author.toLowerCase());

      const matchesDateRange =
        (!tempFilters.dateRange.from ||
          bg.createdAt.split(" ")[0] >= tempFilters.dateRange.from) &&
        (!tempFilters.dateRange.to ||
          bg.createdAt.split(" ")[0] <= tempFilters.dateRange.to);

      return (
        matchesCategory &&
        matchesSubCategory &&
        matchesDateRange &&
        matchesAuthor
      );
    });

    // Conditionally sort by oldest
    // If oldestBlog is true, reverse the filtered list
    if (tempFilters.oldestBlog) {
      filtered = [...filtered].reverse(); // clone before reverse to avoid mutating original array
    }

    return filtered;
  }, [tempFilters, blogs]);

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setIsDialogOpen(false); // Close the dialog
  };

  const clearFilters = () => {
    setTempFilters(appliedFilters);
  };

  const resetFilters = () => {
    setAppliedFilters({
      authors: [],
      category: [],
      subCategories: [],
      dateRange: { from: "", to: "" },
      oldestBlog: false,
    });
    setTempFilters({
      authors: [],
      category: [],
      subCategories: [],
      dateRange: { from: "", to: "" },
      oldestBlog: false,
    });

    toast.success("Filters have been successfully reset to default!");
  };

  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      setTempFilters({ ...appliedFilters }); // Reset temp filters to applied filters when dialog is closed
    }
    setIsDialogOpen(isOpen); // Track dialog state
  };

  const displayedBlogs = isDialogOpen ? previewedBlogs : filteredBlogs;

  const hasActiveFilters =
    appliedFilters.authors.length > 0 ||
    appliedFilters.category.length > 0 ||
    (appliedFilters.dateRange.from &&
      appliedFilters.dateRange.from.trim() !== "") ||
    (appliedFilters.dateRange.to &&
      appliedFilters.dateRange.to.trim() !== "") ||
    appliedFilters.oldestBlog;

  const handleLikeChange = (blogId, total, liked) => {
    setLikesMap((prev) => ({ ...prev, [blogId]: total }));
  };

  const handleBookmarkChange = (blogId, bookmarked) => {
    setBookmarkedMap((prev) => ({ ...prev, [blogId]: bookmarked }));
  };

  return (
    <div>
      {/* Search Bar & Filter Button for Non-Mobile Devices */}
      <div className="hidden md:flex justify-center mb-16 gap-4 items-center pt-3 px-6">
        <div className="relative max-w-4xl w-full mx-auto">
          <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 focus-within:border-blue-500/80 dark:focus-within:border-teal-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-teal-500/10 transition-all duration-300">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-0 px-4 py-1">
              <div className="flex items-center justify-center w-10 h-10 text-slate-400 dark:text-slate-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs by title, content, or tags..."
                className="flex-1 min-w-[200px] max-w-full sm:max-w-none h-12 px-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-none outline-none font-medium text-sm"
              />

              <div className="flex flex-wrap gap-3 items-center pr-2">
                {/* Clear Button Inside Search Bar */}
                <div>
                  {isSearchActive && (
                    <Button
                      onClick={() => setSearchTerm("")}
                      className="text-white px-4 py-1.5 rounded-full shadow-md text-xs font-bold tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-teal-500 dark:from-teal-400 dark:to-indigo-500"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-850" />
                <FilterButton
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  blogCategories={blogCategories}
                  blogSubCategoriesList={blogSubCategoriesList}
                  blogAuthors={blogAuthors}
                  filterCount={filterCount}
                  selectedCategoryCount={selectedCategoryCount}
                  selectedSubCategoryCount={selectedSubCategoryCount}
                  selectedAuthorCount={selectedAuthorCount}
                  hasActiveFilters={hasActiveFilters}
                  applyFilters={applyFilters}
                  clearFilters={clearFilters}
                  resetFilters={resetFilters}
                  handleDialogClose={handleDialogClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Button for Mobile Devices */}
      <div className="flex md:hidden justify-center mb-4 gap-4 items-center pt-3 px-6">
        <div className="relative max-w-3xl w-full">
          <Input
            type="text"
            placeholder="Search blogs by name, description, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-5 rounded-full placeholder:text-xs text-xs font-semibold shadow-md border transition-all duration-300 bg-white/60 dark:bg-slate-900/60 dark:text-white text-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:focus:ring-teal-500/10"
          />

          {/* Clear Button Inside Search Bar */}
          {isSearchActive && (
            <Button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white px-3 py-1 rounded-full shadow-md text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-blue-600 to-teal-550 dark:from-teal-400 dark:to-indigo-500 hover:scale-105 active:scale-95"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex md:hidden justify-center mb-6 gap-4 items-center pt-1 px-6">
        <FilterButton
          tempFilters={tempFilters}
          setTempFilters={setTempFilters}
          blogCategories={blogCategories}
          blogSubCategoriesList={blogSubCategoriesList}
          blogAuthors={blogAuthors}
          filterCount={filterCount}
          selectedCategoryCount={selectedCategoryCount}
          selectedSubCategoryCount={selectedSubCategoryCount}
          selectedAuthorCount={selectedAuthorCount}
          hasActiveFilters={hasActiveFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          resetFilters={resetFilters}
          handleDialogClose={handleDialogClose}
        />
      </div>
      
      <div className="max-w-[1400px] flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Showing {displayedBlogs.length} of {blogs.length} blogs
        </div>
        
        {/* Unified Segmented View Control Toggle Switch */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-teal-400 shadow-md"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Grid className="h-4 w-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-teal-400 shadow-md"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {displayedBlogs.length > 0 ? (
          <div
            className={`${
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-8"
            }`}
          >
            {displayedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                isListView={viewMode === "list"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] max-w-2xl mx-auto shadow-sm">
            <div className="text-slate-350 dark:text-slate-600 mb-4 animate-pulse">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No blogs found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn&apos;t find any articles matching your filters. Try adjusting your search criteria or reset filters to explore all topics.
            </p>
          </div>
        )}
      </div>

      {/* Blog Share Modal */}
      {individualBlog && (
        <BlogShare
          isOpen={isShareOpen}
          onClose={() => {
            setIsShareOpen(false);
            setIndividualBlog(null);
          }}
          title={individualBlog.title}
          description={individualBlog.description}
          url={`https://yourdomain.com/blogpost/${individualBlog.id}`} // replace with your actual domain
          // url={"https://www.google.com"} // placeholder URL, replace with actual blog URL
        />
      )}
    </div>
  );
};

export default BlogFetch;
