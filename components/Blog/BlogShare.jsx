"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  MessageCircle,
  Twitter,
  Linkedin,
  Mail,
  Link,
  Copy,
  Check,
  Send,
  ExternalLink,
} from "lucide-react";

const BlogShare = ({ isOpen, onClose, title, description, url }) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} - ${url}`
      )}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-slate-900 dark:bg-slate-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-slate-500",
      url: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    },
  ];

  const bonusOptions = [
    {
      name: "Reddit",
      icon: ExternalLink,
      color: "bg-orange-500",
      url: `https://reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-sky-500",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-[2.2rem] border border-slate-200 dark:border-slate-800/80 shadow-[0_30px_70px_rgba(0,0,0,0.15)] w-full max-w-md p-6 sm:p-7 overflow-hidden z-10 transition-all duration-300 transform scale-100">
        
        {/* Title bar */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-850 dark:text-white uppercase tracking-wider text-xs">
            Share this Blog
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Blog description text */}
        <div className="mb-6 space-y-1.5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/85 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <div className={`p-2.5 rounded-full text-white shadow-sm flex items-center justify-center ${option.color}`}>
                <option.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                {option.name}
              </span>
            </a>
          ))}
        </div>

        {/* Copy url link bar */}
        <div className="relative mt-4 flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl p-1 bg-slate-50/50 dark:bg-slate-900/30">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-grow bg-transparent border-none outline-none text-xs text-slate-500 dark:text-slate-400 px-3 truncate"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:scale-102 active:scale-98 flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Bonus Options */}
        <div className="hidden sm:grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
          {bonusOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/80 dark:hover:bg-slate-850 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 shadow-sm"
            >
              <div className={`p-1.5 rounded-full text-white ${option.color} flex items-center justify-center`}>
                <option.icon className="w-3 h-3" />
              </div>
              <span>{option.name}</span>
            </a>
          ))}
        </div>

        {showToast && (
          <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider z-50 animate-bounce">
            <Check className="w-4 h-4" />
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogShare;
