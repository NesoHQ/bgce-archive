"use client";

import Image from "next/image";
import { useState } from "react";
import {
  TbCode,
  TbSparkles,
  TbLayersIntersect,
  TbCloudComputing,
  TbRocket,
  TbCertificate,
  TbTarget,
} from "react-icons/tb";

import constellationImg from "../../assets/LanguageTransitionsDemo.webp";

interface Skill {
  label: string;
  icon: React.ReactNode;
}

const skills: Skill[] = [
  { label: "System Design", icon: <TbLayersIntersect size={17} /> },
  { label: "ML & Data Science", icon: <TbSparkles size={17} /> },
  { label: "Web Development", icon: <TbCode size={17} /> },
  { label: "Gen AI", icon: <TbRocket size={17} /> },
  { label: "AWS Cloud", icon: <TbCloudComputing size={17} /> },
  { label: "Interview Prep", icon: <TbCertificate size={17} /> },
];

export default function FutureProof() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full px-4 my-10">
      <div
        className="
          w-full max-w-6xl mx-auto
          flex flex-col lg:flex-row items-stretch
          bg-orange-50 dark:bg-neutral-900
          rounded-2xl
          border border-orange-100 dark:border-neutral-800
          shadow-sm overflow-hidden
          font-[DM_Sans,ui-sans-serif,system-ui,sans-serif]
          transition-colors duration-300
        "
      >
        {/* ── LEFT — Text + Skill Pills ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-8 min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 mb-3 text-orange-500 dark:text-orange-400 font-semibold text-[13px] tracking-wide">
            <TbTarget size={15} />
            Future-proof Your Career
          </div>

          {/* Heading */}
          <h2 className="text-[22px] lg:text-[24px] font-extrabold text-neutral-900 dark:text-neutral-50 mb-6 leading-snug tracking-tight">
            Get hands-on with in-demand skills
          </h2>

          {/* Skill Pills */}
          {/* মোবাইলে গ্যাপ একটু কমানো হয়েছে (gap-2 sm:gap-2.5) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {skills.map((skill, idx) => {
              const active = hoveredIdx === idx;
              return (
                <button
                  key={skill.label}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ outline: "none", boxShadow: "none" }}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 rounded-full
                    px-2.5 sm:px-4 py-2 sm:py-2.5 
                    text-[12px] sm:text-[13.5px] leading-tight font-medium
                    cursor-pointer whitespace-normal sm:whitespace-nowrap
                    border transition-colors duration-150 select-none text-left
                    focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0
                    [-webkit-tap-highlight-color:transparent] 
                    bg-white dark:bg-transparent
                    text-neutral-700 dark:text-neutral-300
                    ${active ? "border-orange-400 dark:border-orange-400" : "border-orange-100 dark:border-neutral-700"}
                  `}
                >
                  <span className="flex items-center text-orange-500 dark:text-orange-400 shrink-0">
                    {skill.icon}
                  </span>
                  {skill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT — Image ── */}
        <div className="relative flex-1 min-h-65 lg:min-h-0">
          <Image
            src={constellationImg}
            alt="Tech skills constellation"
            fill
            placeholder="blur"
            className="object-cover object-left"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}