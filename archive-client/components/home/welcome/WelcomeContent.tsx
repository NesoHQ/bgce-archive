import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BookOpen, Rocket, Users, Award } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description: "From basics to advanced",
  },
  {
    icon: Rocket,
    title: "Real-World Projects",
    description: "Production-grade code",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Expert mentorship",
  },
  {
    icon: Award,
    title: "Career Growth",
    description: "Interview preparation",
  },
];

const state = [
  {
    title: "Courses",
    students: "500+",
  },
  {
    title: "Developers",
    students: "10K+",
  },
  {
    title: "Satisfaction",
    students: "98%",
    className: "from-primary via-primary/90 to-primary/70",
  },
];

export function WelcomeContent() {
  return (
    <div className='space-y-5 lg:pr-8'>
      {/* Badge */}
      <div className='flex items-center gap-2 flex-wrap'>
        <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm'>
          <Zap className='h-2.5 w-2.5' />
          <span>Professional Developer Platform</span>
        </div>

        {/* Operational Badge */}
        <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-sm'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
          <span className='text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide'>
            Operational
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className='space-y-3'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground'>
          Master Modern Development.{" "}
          <span className='bg-gradient-to-r block sm:inline from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-primary/90 dark:to-primary/70 bg-clip-text text-transparent'>
            Build Production-Ready Systems.
          </span>
        </h1>
        <p className='text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl sm:max-w-2xl'>
          Comprehensive learning platform for backend engineering, cloud
          infrastructure, and distributed systems. Learn Go, microservices,
          DevOps, and system design from industry practitioners.
        </p>
      </div>

      {/* Key Features */}
      <div className='grid grid-cols-2 gap-3'>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className='flex items-start gap-2'>
              <div className='p-1.5 rounded-md bg-primary/10 mt-0.5'>
                <Icon className='h-3.5 w-3.5 text-primary' />
              </div>
              <div>
                <div className='text-xs font-semibold text-foreground'>
                  {feature.title}
                </div>
                <div className='text-[10px] text-muted-foreground'>
                  {feature.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Buttons */}
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          size='default'
          asChild
          className='h-10 px-5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all group bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white'>
          <Link href='/explore/courses'>
            Explore Courses
            <ArrowRight className='ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform' />
          </Link>
        </Button>
        <Button
          size='default'
          variant='outline'
          asChild
          className='h-10 px-5 rounded-lg border-2 hover:border-primary/50 dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.26_260)] transition-all'>
          <Link href='/blogs'>View Archive</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className='flex flex-wrap md:inline-flex items-center justify-center gap-4 sm:gap-6 px-4 py-3 sm:px-5 rounded-2xl sm:rounded-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border border-border/50 backdrop-blur-sm'>
        {state.map((item, index) => (
          <div key={item.title} className='flex items-center gap-4 sm:gap-6'>
            <div className='flex items-baseline gap-2'>
              <span
                className={`text-xl sm:text-2xl font-bold bg-gradient-to-br ${item.className || "from-foreground via-foreground/90 to-foreground/70"} bg-clip-text text-transparent tracking-tight`}>
                {item.students}
              </span>
              <span className='text-[10px] sm:text-xs font-semibold text-muted-foreground/80 tracking-wide'>
                {item.title}
              </span>
            </div>
            {index < state.length - 1 && (
              <div className='hidden sm:block w-px h-5 bg-gradient-to-b from-transparent via-border to-transparent' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
