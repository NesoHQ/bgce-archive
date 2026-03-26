"use client";

import React from "react";
import {
  Star,
  BookOpen,
  Video,
  RefreshCcw,
  Clock,
  Bookmark,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function CourseHero() {
  return (
    <div className="w-full text-center px-4 sm:px-6 pt-10 pb-5 sm:py-5 font-sans transition-colors">

      {/* breadcrumb */}
      <div className="flex flex-wrap justify-center items-center gap-1 text-xs sm:text-sm mb-3 sm:mb-4 text-gray-500 dark:text-gray-400">
        <span>Home</span>
        <span>›</span>
        <span>Courses</span>
        <span>›</span>
        <span className="font-medium text-black dark:text-white">
          Grokking Modern System Design Interview
        </span>
      </div>

      {/* badge */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium border-gray-300 dark:border-gray-600 text-black dark:text-white">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          AI-powered learning
        </div>

        <button className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:opacity-70">
          <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
          Save
        </button>
      </div>

      {/* title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 max-w-2xl mx-auto text-black dark:text-white leading-tight">
        Grokking Modern System Design Interview
      </h1>

      {/* subtitle */}
      <p className="text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg mx-auto mb-6 sm:mb-7 leading-relaxed text-gray-600 dark:text-gray-400">
        Everything you need for Grokking the System Design Interview,
        developed by FAANG engineers. Master distributed system fundamentals
        and practice real-world interview questions.
      </p>

      {/* stats */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium mb-6 sm:mb-8 text-gray-700 dark:text-gray-300">
        
        {/* stars */}
        <div className="flex items-center gap-1">
          <div className="flex text-orange-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500" />
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500" />
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500" />
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500" />
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500 opacity-40" />
          </div>
          <span className="ml-1 font-bold text-black dark:text-white">4.6</span>
        </div>

        <span className="hidden sm:block text-gray-400 dark:text-gray-600">|</span>

        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
          204 Lessons
        </div>

        <span className="hidden sm:block text-gray-400 dark:text-gray-600">|</span>

        <div className="flex items-center gap-1">
          <Video className="w-3 h-3 sm:w-4 sm:h-4" />
          8 Mock Interviews
        </div>

        <span className="hidden sm:block text-gray-400 dark:text-gray-600">|</span>

        <div className="flex items-center gap-1">
          <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          Updated today
        </div>

        <span className="hidden sm:block text-gray-400 dark:text-gray-600">|</span>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          26h
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3  w-full max-w-6xl mx-auto">
        
        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-indigo-600 text-white text-sm sm:text-base font-semibold hover:bg-indigo-700 transition">
          Start Learning
        </button>

        <button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border flex items-center justify-center gap-2 text-sm sm:text-base font-medium 
          text-black dark:text-white 
          border-gray-300 dark:border-gray-600 
          hover:border-gray-400 dark:hover:border-gray-500 transition">
          Course Content
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      
    </div>
  );
}