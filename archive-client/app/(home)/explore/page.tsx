import Link from "next/link";
import { BookOpen, Code, Folder, Cloud, Briefcase, Target, Brain, ArrowRight } from "lucide-react";

export default function ExplorePage() {
    const sections = [
        {
            icon: BookOpen,
            title: "Courses",
            description: "Learn from expert-led courses covering Go, system design, cloud, and more",
            href: "/explore/courses",
            count: "500+ courses",
            color: "from-blue-500/20 to-blue-600/20",
        },
        {
            icon: Brain,
            title: "Practice",
            description: "Sharpen your skills with hands-on coding challenges and exercises",
            href: "/explore/practice",
            count: "1000+ challenges",
            color: "from-purple-500/20 to-purple-600/20",
        },
        {
            icon: Folder,
            title: "Projects",
            description: "Build real-world applications with guided project templates",
            href: "/explore/projects",
            count: "200+ projects",
            color: "from-green-500/20 to-green-600/20",
        },
        {
            icon: Cloud,
            title: "Cloud Labs",
            description: "Practice in interactive cloud environments without setup",
            href: "/explore/cloud-labs",
            count: "50+ labs",
            color: "from-cyan-500/20 to-cyan-600/20",
        },
        {
            icon: Briefcase,
            title: "Get Hired",
            description: "Access career resources, job boards, and hiring opportunities",
            href: "/explore/get-hired",
            count: "100+ opportunities",
            color: "from-orange-500/20 to-orange-600/20",
        },
        {
            icon: Target,
            title: "Mock Interview",
            description: "Practice technical interviews with AI-powered feedback",
            href: "/explore/mock-interview",
            count: "Unlimited practice",
            color: "from-red-500/20 to-red-600/20",
        },
        {
            icon: Code,
            title: "Interview Prep",
            description: "Master coding interviews with curated problems and solutions",
            href: "/explore/interview-prep",
            count: "300+ problems",
            color: "from-indigo-500/20 to-indigo-600/20",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                            Explore Learning Paths
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Choose your path to mastery. From courses to hands-on projects, we have everything you need to level up your skills.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sections Grid */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <Link
                                    key={section.href}
                                    href={section.href}
                                    className="group relative bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border backdrop-blur-sm rounded-xl p-8 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {section.description}
                                        </p>

                                        {/* Count */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-primary">
                                                {section.count}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
