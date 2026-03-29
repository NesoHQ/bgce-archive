"use client";

import { useState, useRef, useEffect } from "react";
import { TbPlus, TbMinus } from "react-icons/tb";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is Grokking System Design worth it?",
    answer:
      "Yes, Grokking the System Design is worth it for those preparing for system design interviews and want to build a clear, structured approach to solving real-world scalability and architecture problems.",
  },
  {
    question: "What is System Design?",
    answer:
      "System Design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements. It involves making high-level decisions about how a system will be structured and how its components will interact.",
  },
  {
    question: "What makes Grokking System Design different from other courses?",
    answer:
      "Grokking System Design focuses on real-world scalability problems with a structured, pattern-based approach. It breaks down complex systems into manageable components and teaches you to think systematically about trade-offs — something most courses skip.",
  },
  {
    question: "Is there coding involved in the System Design Interview?",
    answer:
      "System design interviews are primarily focused on architectural thinking rather than coding. However, you may occasionally be asked to write pseudocode or high-level code snippets to illustrate specific components of your design.",
  },
  {
    question: "How long does it take to prepare for a System Design Interview?",
    answer:
      "Preparation time varies based on your experience level. Generally, 4–8 weeks of consistent study covering core concepts, design patterns, and practice problems is sufficient for most candidates aiming for mid-to-senior level positions.",
  },
];

/* ── Custom hook: hydration-safe dark mode ── */
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false); // Hydration fix

  useEffect(() => {
    setMounted(true); // Component is now mounted on the client

    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark, mounted }; // Return both
}

/* ── Animated answer panel ── */
function AccordionPanel({
  isOpen,
  answer,
}: {
  isOpen: boolean;
  answer: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [answer, isOpen]);

  return (
    <div
      style={{
        maxHeight: isOpen ? height : 0,
        opacity: isOpen ? 1 : 0,
        transition:
          "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div ref={ref} className="pb-5 pr-10">
        <p className="text-[14.5px] leading-[1.75] text-neutral-500 dark:text-neutral-400 font-normal">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ── Single FAQ row ── */
function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        border rounded-2xl transition-all duration-250 ease-in-out
        ${
          isOpen
            ? "border-orange-300 dark:border-orange-600 bg-orange-50/60 dark:bg-[#111827]"
            : hovered
              ? "border-orange-200 dark:border-orange-800 bg-white dark:bg-[#111827]"
              : "border-orange-100 dark:border-neutral-800 bg-white dark:bg-[#111827]"
        }
      `}
    >
      {/* Question */}
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          px-6 py-5 text-left gap-4 cursor-pointer rounded-2xl
          focus:outline-none focus:ring-0
          [-webkit-tap-highlight-color:transparent]
        "
      >
        <span
          className={`text-[15px] font-semibold leading-snug transition-colors duration-200 ${
            isOpen || hovered
              ? "text-orange-500 dark:text-orange-400"
              : "text-neutral-800 dark:text-neutral-200"
          }`}
        >
          {faq.question}
        </span>

        <span
          className={`
            shrink-0 w-7 h-7 rounded-full flex items-center justify-center
            transition-all duration-300
            ${
              isOpen
                ? "bg-orange-500 text-white"
                : hovered
                  ? "bg-orange-100 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
            }
          `}
        >
          {isOpen ? <TbMinus size={14} /> : <TbPlus size={14} />}
        </span>
      </button>

      {/* Answer */}
      <div className="px-6">
        <AccordionPanel isOpen={isOpen} answer={faq.answer} />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function CourseFAQs() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { mounted } = useDarkMode();

  const toggle = (idx: number) =>
    setOpenIdx((prev) => (prev === idx ? null : idx));

  if (!mounted) {
    return <div className="min-h-100"></div>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 font-[Sora,ui-sans-serif,system-ui,sans-serif]">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-neutral-50">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => (
          <FAQItem
            key={idx}
            faq={faq}
            isOpen={openIdx === idx}
            onToggle={() => toggle(idx)}
          />
        ))}
      </div>
    </section>
  );
}
