import React from "react";

// Clean, solid green checkmark icon
const CheckIcon = () => (
  <svg
    className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#16A34A] dark:text-[#22C55E] shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function LearningObjectives() {
  const objectives = [
    "A 45-minute answer structure with RESHADED for any System Design Interview",
    "An understanding of how to frame open-ended interview problems as specific requirements, constraints, and success criteria",
    "The ability to design scalable, reliable systems with databases, caches, load balancers, queues, and microservices",
    "Pattern toolkit: sharding, replication, consistency models, CQRS, and event-driven design",
    "Capacity and reliability skills: throughput and latency math, bottlenecks, SLIs and SLOs, failure handling",
    "Communication under pressure: fast diagramming, clear trade-off narratives, effective checkpoints",
    "Mock Interview practice with timed scenarios, model answers, and rubrics to build confidence and speed",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FAFAFA] dark:bg-[#0f1117]/80 border border-gray-100 dark:border-gray-800/60 rounded-xl p-5 sm:p-8 lg:p-10 shadow-sm transition-colors duration-300">
        <h2 className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#4B5563] dark:text-[#9CA3AF] uppercase mb-6 sm:mb-8">
          Learning Objectives
        </h2>

        {/* List of Objectives */}
        <ul className="space-y-4 sm:space-y-5">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3 sm:gap-4">
              <div className="mt-0.5 sm:mt-1 shrink-0">
                <CheckIcon />
              </div>

              {/* Responsive text size: text-sm on mobile, slightly larger on sm+ screens */}
              <span className="text-sm sm:text-[15px] leading-relaxed text-[#374151] dark:text-[#D1D5DB] transition-colors duration-300">
                {objective}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
