"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Circle,
  MessageSquareText,
  Info,
} from "lucide-react";

// --- Mock Data ---
const roadmapData = [
  {
    id: 1,
    title: "Introduction",
    description:
      "Get familiar with System Design and the course structure, including prerequisites that set the foundation for mastering System Design Interviews.",
    lessons: [
      "Introduction to Modern System Design",
      "Why Every Developer Should Learn System Design",
      "Course Structure for Modern System Design",
    ],
  },
  {
    id: 2,
    title: "System Design Interviews",
    description:
      "Explore what System Design Interviews involve, including essential preparation strategies, fundamental concepts, key resources, and tips to perform well.",
    lessons: [
      "What is a System Design Interview?",
      "How to Prepare for the Interview",
      "Key Frameworks to Remember",
      "Common Mistakes to Avoid",
      "Communication during the Interview",
      "Whiteboarding Tips",
    ],
  },
  {
    id: 3,
    title: "Networking Basics",
    description:
      "Refresh your knowledge on core networking principles that are crucial for designing distributed systems.",
    lessons: ["TCP vs UDP", "DNS Anatomy", "HTTP/2 and HTTP/3"],
  },
  // Premium Card Mock Data
  {
    id: 4,
    title: "Distributed Cache System Design",
    subtitle: "Mock Interview",
    isPremium: true,
    description: "",
    lessons: [],
  },
];

export default function LearningRoadmap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<number[]>([1]); // Module 1 open by default

  // Search logic (Added safe check for lessons array)
  const filteredData = roadmapData.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (module.lessons &&
        module.lessons.some((lesson) =>
          lesson.toLowerCase().includes(searchQuery.toLowerCase()),
        )),
  );

  // Check if all current filtered standard items are expanded
  const standardFilteredItems = filteredData.filter((item) => !item.isPremium);
  const isAllExpanded =
    standardFilteredItems.length > 0 &&
    standardFilteredItems.every((item) => expandedItems.includes(item.id));

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedItems([]);
    } else {
      setExpandedItems(standardFilteredItems.map((item) => item.id));
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4  md:px-0 font-sans">
      {/* Header Section */}
      <div className="flex flex-wrap items-baseline gap-3 mb-6">
        <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">
          Learning Roadmap
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          204 Lessons • 147 Quizzes
        </span>
      </div>

      {/* Controls: Search & Expand All */}
      <div className="flex flex-row justify-between items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search Lessons"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded shadow-sm bg-white dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Expand / Collapse Toggle */}
        <button
          onClick={toggleExpandAll}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300  transition-colors focus:outline-none shrink-0 whitespace-nowrap"
        >
          <span>{isAllExpanded ? "Collapse All" : "Expand All"}</span>
          <span className="text-gray-500 dark:text-gray-400">
            <ChevronsUpDown size={16} />
          </span>
        </button>
      </div>

      {/* List / Accordion */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((module) => {
            // --- Premium Card Layout ---
            if (module.isPremium) {
              return (
                <div
                  key={module.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#111827] p-4 sm:p-5 flex items-center justify-between transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className="w-10.5 h-10.5 rounded-lg bg-[#FFF4E5] dark:bg-orange-900/30 text-[#B45309] dark:text-orange-400 flex items-center justify-center shrink-0">
                      <MessageSquareText size={22} strokeWidth={1.5} />
                    </div>
                    {/* Text Content */}
                    <div>
                      <h3 className="text-[17px] font-medium text-gray-900 dark:text-gray-100 leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {module.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Premium Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700 text-[13px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                    Premium <Info size={14} className="text-slate-400" />
                  </div>
                </div>
              );
            }

            // --- Standard Accordion Layout ---
            const isOpen = expandedItems.includes(module.id);

            return (
              <div
                key={module.id}
                className="border  border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#111827] overflow-hidden transition-colors"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleItem(module.id)}
                  className="w-full cursor-pointer flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-[17px] text-gray-900 dark:text-gray-100">
                    <span className="font-normal">{module.id}.</span>
                    <span className="font-medium">{module.title}</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 shrink-0">
                    {!isOpen && (
                      <span className="text-[13px] hidden sm:block">
                        {module.lessons?.length || 0} Lessons
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6">
                      <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-5 leading-relaxed pr-0 md:pr-12">
                        {module.description}
                      </p>

                      <ul className="space-y-3.5">
                        {module.lessons?.map((lesson, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 group"
                          >
                            <span className="mt-0.5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors">
                              <Circle size={16} strokeWidth={1.5} />
                            </span>
                            <a
                              href="#"
                              className="text-[15px] text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600 transition-all"
                            >
                              {lesson}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg">
            No lessons found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
