"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IContributor } from "@/app/(home)/resources/community-actions/page";

export const GridWall = ({
  contributors,
}: {
  contributors: IContributor[];
}) => {
  return (
    <section className='container mx-auto px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0'>
        {contributors.map((contributor, idx) => {
          const username = contributor.github.split("/").pop();
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{
                duration: 0.5,
                delay: (idx % 4) * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className='group h-full'>
              <div className='relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20'>
                {/* Background glow on hover */}
                <div className='absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100' />
                <div className='absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100' />

                <div className='relative h-full p-6 flex flex-col items-center text-center space-y-4 z-10'>
                  <div className='relative'>
                    <Avatar className='w-20 h-20 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-500 group-hover:scale-105'>
                      <AvatarImage
                        src={`https://github.com/${username}.png`}
                        alt={`${contributor.name} avatar`}
                      />
                      <AvatarFallback className='text-lg font-bold'>
                        {contributor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className='absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border border-border text-foreground shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300 group-hover:rotate-12'>
                      <Github className='h-3 w-3' />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <h3 className='font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300'>
                      {contributor.name}
                    </h3>
                    <p className='text-xs font-mono text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80'>
                      @{username}
                    </p>
                  </div>

                  <div className='w-full mt-auto'>
                    <Button
                      asChild
                      variant='ghost'
                      size='sm'
                      className='w-full rounded-xl bg-muted/50 hover:bg-primary hover:text-white transition-all duration-300'>
                      <Link
                        href={contributor.github}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <span className='mr-2 font-medium'>View Profile</span>
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
