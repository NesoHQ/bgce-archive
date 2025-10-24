import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Archive, GithubIcon, Sparkles, Users, Youtube } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export function HeroSection() {
  const communityButtons = [
    {
      icon: SiDiscord,
      label: "Discord",
      href: "https://discord.gg/wHq4SjKrNY",
      variant: "outline" as const,
    },
    {
      icon: Users,
      label: "Facebook",
      href: "https://www.facebook.com/share/g/17eLEEiUPN/",
      variant: "outline" as const,
    },
    {
      icon: Youtube,
      label: "Youtube",
      href: "https://www.youtube.com/@gowithhabib",
      variant: "outline" as const,
    },
  ];

  return (
    <section className="my-2 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium mb-8 overflow-hidden">
            <span className="relative z-10 text-[16px] flex gap-2 items-center">
              <Sparkles size={15} className="animate-pulse text-blue-400" />{" "}
              Community Driven • Open Source
              <Sparkles size={15} className="animate-pulse text-blue-400" />
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
            Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Golang Community Vault
            </span>
          </h1>

          {/* Description */}
          <p className="text-md text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            A community-driven archive to collect, organize, and preserve
            knowledge, tools, and stories from the Go ecosystem. Whether
            you&apos;re a beginner, job seeker, seasoned contributor, or mentor
            — this is where we grow together.
          </p>

          {/* Community Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {communityButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <Link href={button.href} key={index}>
                  <button className="flex items-center text-white gap-3 px-8 py-2 border-gray-300   dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 border hover:border-gray-400 dark:hover:bg-gray-800 transition-all duration-500  hover:-translate-y-1 relative w-auto  bg-gray-800  font-semibold text-sm rounded-sm shadow-lg  overflow-hidden group cursor-pointer  ease-in-out transform hover:scale-105 dark:border-gray-400">
                    {/* Shine animation */}
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-blue-400 opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40 pointer-events-none" />

                    <Icon className="h-5 w-5" />
                    {button.label}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-3 transition-colors duration-200"
              asChild
            >
              <Link href="/archive" className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Explore Archive
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 px-8 py-3 transition-colors duration-500 ease-in-out"
              asChild
            >
              <Link href="/contribute" className="flex items-center gap-2">
                <GithubIcon className="h-5 w-5" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
