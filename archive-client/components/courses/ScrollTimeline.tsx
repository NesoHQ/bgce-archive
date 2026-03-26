"use client";

import React, { useEffect, useState, useRef } from "react";
import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";
import Image from "next/image";

export default function CourseFeaturesTimeline() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [smoothPercentage, setSmoothPercentage] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const currentRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Starts filling when container enters from bottom,
      // reaches 100% when the bottom of the container hits 80% up the viewport
      // Fill line up to 100px above viewport bottom — so the fill "front" is always visible
      const fillFront = windowHeight - 200;
      const scrolled = (fillFront - top) / height;
      setScrollPercentage(Math.min(Math.max(scrolled, 0), 1) * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const animate = () => {
      const diff = scrollPercentage - currentRef.current;
      if (Math.abs(diff) > 0.05) {
        currentRef.current += diff * 0.08;
        setSmoothPercentage(currentRef.current);
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentRef.current = scrollPercentage;
        setSmoothPercentage(scrollPercentage);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scrollPercentage]);

  const features = [
    {
      title: "System Design skills are non-negotiable",
      description:
        "If there's one skill that every developer needs to know to be successful in the AI era, it's System Design. That's why System Design Interviews still determine your starting role and salary at top companies.",
      image: img1,
    },
    {
      title: "From building blocks to System Design Interview master",
      description:
        "Master the fundamentals of modern System Design from the ground up. Use the RESHADED method to unlock any System Design problem you encounter.",
      image: img2,
    },
    {
      title: "13+ real-world case studies; one battle-tested formula",
      description:
        "Understand the architecture that powers hyperscalers like YouTube, WhatsApp, and Uber. Then apply RESHADED to unlock dozens of real-world System Design Interview questions.",
      image: img3,
    },
    {
      title: "Benchmark your skills with AI Mock Interviews",
      description:
        "Put your new skills to the test as you go. Take on real-world design challenges and embedded AI mock interviews that simulate the hiring process at top companies.",
      image: img4,
    },
    {
      title: "Curriculum developed by MAANG engineers",
      description:
        "The #1 System Design course created by industry pros who built global-scale distributed systems at Meta, Google, and Microsoft. Used by millions of learners to land SWE, TPM, and EM roles.",
      image: img5,
    },
  ];

  return (
    <section className="w-full py-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-20 tracking-tight">
          Why choose this course?
        </h2>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative w-full pb-10">
          {/* ── DESKTOP: center line ── */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0 border-l-[5px] border-dashed border-[#C7D2FE] dark:border-[#4338ca]/50" />
          <div
            className="hidden md:block absolute left-1/2 top-0 w-[5px] -translate-x-1/2 z-0 bg-[#8B5CF6] dark:bg-[#818CF8]"
            style={{ height: `${smoothPercentage}%` }}
          />

          {/* ── MOBILE: left line — offset 20px from edge ── */}
          <div className="block md:hidden absolute left-5 top-0 bottom-0 w-[2px] z-0 border-l-[5px] border-dashed border-[#C7D2FE] dark:border-[#4338ca]/50" />
          <div
            className="block md:hidden absolute left-5 top-0 w-[5px] z-0 bg-[#8B5CF6] dark:bg-[#818CF8]"
            style={{ height: `${smoothPercentage}%` }}
          />

          {/* ── ROWS ── */}
          <div className="flex flex-col gap-16 md:gap-32">
            {features.map((feature, index) => {
              const itemPosPercentage = (index / (features.length - 1)) * 100;
              const isFilled = smoothPercentage >= itemPosPercentage;

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full"
                >
                  {/* Desktop dot */}
                  <div
                    className={`hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full z-10 transition-all duration-500 ${
                      isFilled
                        ? "bg-[#8B5CF6] dark:bg-[#818CF8] shadow-[0_0_12px_rgba(139,92,246,0.6)] scale-125"
                        : "bg-[#E0E7FF] dark:bg-[#312e81]"
                    }`}
                  />

                  {/* Mobile dot — perfectly centered on the left line */}
                  <div
                    className={`block md:hidden absolute left-3.25 top-1.5 -translate-x-1/2 translate-x-[2.5px] w-3.5 h-3.5 rounded-full z-10 transition-all duration-500 ${
                      isFilled
                        ? "bg-[#8B5CF6] dark:bg-[#818CF8] shadow-[0_0_10px_rgba(139,92,246,0.5)] scale-125"
                        : "bg-[#E0E7FF] dark:bg-[#312e81]"
                    }`}
                  />

                  {/* Mobile layout: content starts after the left line */}
                  {/* Desktop layout: left half */}
                  <div className="w-full md:w-[42%] pl-12 md:pl-0 md:pr-10">
                    <h3
                      className={`text-lg sm:text-xl md:text-[22px] font-bold leading-snug mb-3 transition-colors duration-500 ${
                        isFilled
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-[15px] leading-relaxed transition-colors duration-500 ${
                        isFilled
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>

                    {/* ── IMAGE: mobile only, shown below text ── */}
                    <div
                      className={`md:hidden mt-5 w-full  flex items-center justify-center transition-all duration-700 ${
                        isFilled
                          ? "opacity-100 translate-y-0"
                          : "opacity-30 translate-y-3"
                      }`}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={800}
                        height={400}
                        className="w-[80%] h-auto object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </div>

                  {/* ── IMAGE: desktop only, right column ── */}
                  <div className="w-[40%] hidden md:flex">
                    <div
                      className={`w-full transition-all duration-700 ${
                        isFilled
                          ? "opacity-100 translate-y-0"
                          : "opacity-30 translate-y-4"
                      }`}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
