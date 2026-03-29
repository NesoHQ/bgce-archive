"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { WelcomeContent } from "./welcome/WelcomeContent";
import type { TechStack } from "./welcome/types";

// Dynamically import CodeWindow with no SSR
const CodeWindow = dynamic(
  () =>
    import("./welcome/CodeWindow").then((mod) => ({ default: mod.CodeWindow })),
  { ssr: false },
);

export function WelcomeSection() {
  const [activeTech, setActiveTech] = useState<TechStack>("go");

  return (
    <section className='relative overflow-hidden'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Left Content */}
          <WelcomeContent />
          {/* Right Visual - Dynamically loaded */}
          <CodeWindow activeTech={activeTech} onTechChange={setActiveTech} />
        </div>
      </div>
    </section>
  );
}
