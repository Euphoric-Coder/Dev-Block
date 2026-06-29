import { quotesByDay } from "@/lib/data";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const QuoteOfTheDay = ({ type = "blog" }) => {
  const [visible, setVisible] = useState(false);

  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const quote = quotesByDay[today]?.[type];

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!quote) return null;

  return (
    <div className="my-10 px-4 sm:px-0">
      <blockquote
        className={`transition-all duration-1000 ease-in-out transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } relative max-w-4xl mx-auto p-8 sm:p-10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-slate-800/50`}
      >
        {/* Animated Ambient Glow Blobs Inside Card */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Premium Left Accent Gradient Bar */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-teal-400 dark:from-teal-400 dark:via-blue-500 dark:to-indigo-500" />

        {/* Decorative Giant Quote Icon in Background */}
        <Quote className="absolute -top-6 -right-6 w-32 h-32 text-indigo-500/5 dark:text-teal-400/5 rotate-12 select-none pointer-events-none" />

        <div className="relative z-10">
          {/* Header Title with Soft Badge Style */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Inspirational Spark
              </span>
            </span>
          </div>

          <h2 className="flex items-center gap-3 justify-center text-center text-xl sm:text-2xl font-extrabold mb-5 text-gray-900 dark:text-white">
            <span className="p-1.5 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-xl shadow-md flex items-center justify-center text-white">
              <Image 
                src="/quote-icon.png" 
                alt="quote" 
                width={20} 
                height={20} 
                className="brightness-0 invert dark:brightness-100 dark:invert-0" 
              />
            </span>
            Quote of the Day <span className="font-medium text-gray-500 dark:text-gray-400 text-lg sm:text-xl">({today})</span>
          </h2>

          {/* Quote content with stunning typography and layouts */}
          <div className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-slate-200 text-center font-medium italic font-poppins">
            <span className="text-3xl text-indigo-500 dark:text-teal-400 font-serif mr-1">“</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 dark:from-teal-300 dark:via-blue-400 dark:to-indigo-400 font-bold not-italic">
              {quote.mainQuote}{" "}
            </span>
            <span>{quote.description}</span>
            <span className="text-3xl text-indigo-500 dark:text-teal-400 font-serif ml-1">”</span>
          </div>

          {/* Divider line */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent mx-auto my-6" />

          {/* Author */}
          <div className="text-sm sm:text-base font-bold text-center tracking-wide text-indigo-600 dark:text-teal-400 uppercase">
            — {quote.author}
          </div>
        </div>
      </blockquote>
    </div>
  );
};

export default QuoteOfTheDay;
