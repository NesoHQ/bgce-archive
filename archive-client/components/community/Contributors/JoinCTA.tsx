"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const JoinCTA = () => {
  return (
    <section className='container mx-auto px-4 pb-20'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative overflow-hidden p-8 md:p-12 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 backdrop-blur-sm'>
        <div className='absolute top-0 right-0 p-8'>
          <Heart className='h-32 w-32 text-primary/5 -rotate-12 animate-pulse' />
        </div>
        <div className='relative max-w-2xl space-y-6'>
          <Badge className='bg-primary hover:bg-primary uppercase tracking-widest text-[9px] px-3 font-bold'>
            Join the Community
          </Badge>
          <h2 className='text-3xl md:text-5xl font-bold tracking-tight'>
            Become a Contributor.
          </h2>
          <p className='text-muted-foreground text-sm md:text-lg max-w-xl'>
            The BGCE Archive is open for everyone. Help us build the future of
            tech education by contributing to our codebase, documentation, or
            community.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button asChild size='lg' className='group'>
              <Link
                href='https://github.com/NesoHQ/bgce-archive'
                target='_blank'
                rel='noopener noreferrer'>
                <div className='flex '>
                  <Github className='mr-2 h-4 w-4' /> Get Started
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
