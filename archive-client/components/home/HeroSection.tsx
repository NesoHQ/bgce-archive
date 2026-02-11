"use client";

import React from "react";
import { Code2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-4 mt-5">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Subtle Fog */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-background via-background/90 to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Welcome to <span className="text-primary italic">BGCE Archive</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed border-l-2 border-primary/20 pl-6 inline-block text-left">
          A community-driven archive to collect, organize, and preserve
          knowledge, tools, and stories from the Go ecosystem. Whether
          you&apos;re a beginner, job seeker, seasoned contributor, or mentor —
          this is where we grow together.
        </p>

        {/* Stats Grid */}
      </div>
    </section>
  );
}
