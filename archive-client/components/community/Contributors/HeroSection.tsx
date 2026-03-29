"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IContributor } from "@/app/(home)/resources/community-actions/page";

export const HeroSection = ({
  contributors,
}: {
  contributors: IContributor[];
}) => {
  return (
    <section className='container mx-auto px-4 text-center space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center justify-center gap-2 mb-4'>
        <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest'>
          <Sparkles className='h-3 w-3' />
          <span>Wall of Fame</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='space-y-4'>
        <h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-foreground'>
          The Architects of{" "}
          <span className='bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent'>
            BGCE Archive.
          </span>
        </h1>
        <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto'>
          Meet the talented individuals who have contributed to building the
          ultimate developer platform. Every line of code and every design
          element is a piece of their passion.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className='flex items-center justify-center gap-4 pt-4'>
        <div className='flex -space-x-3'>
          {contributors.slice(0, 3).map((contributor, i) => {
            const username = contributor.github.split("/").pop();
            return (
              <Avatar key={i} className='border-2 border-background w-10 h-10'>
                <AvatarImage
                  src={`https://github.com/${username}.png`}
                  alt={`${contributor.name} avatar`}
                />
                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
              </Avatar>
            );
          })}
          <div className='w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary backdrop-blur-sm'>
            +{Math.max(0, contributors.length - 3)}
          </div>
        </div>
        <div className='text-sm font-medium text-muted-foreground'>
          <span className='text-foreground font-bold'>
            {contributors.length}
          </span>{" "}
          Active Contributors
        </div>
      </motion.div>
    </section>
  );
};
