import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function RoadmapPage() {
    const roadmapItems = [
        {
            id: 1,
            title: "Platform Launch",
            description: "Initial release of the BGCE Archive platform with core features",
            status: "completed",
            date: "Q4 2023",
            features: [
                "User authentication and profiles",
                "Course catalog and browsing",
                "Basic community features",
                "Content management system",
            ],
        },
        {
            id: 2,
            title: "Enhanced Learning Experience",
            description: "Improved course delivery and interactive learning features",
            status: "completed",
            date: "Q1 2024",
            features: [
                "Interactive code playgrounds",
                "Progress tracking and certificates",
                "Video streaming optimization",
                "Mobile responsive design",
            ],
        },
        {
            id: 3,
            title: "Community & Collaboration",
            description: "Building a thriving community with collaboration tools",
            status: "in-progress",
            date: "Q2 2024",
            features: [
                "Discussion forums and threads",
                "Project showcase platform",
                "Peer code review system",
                "Live coding sessions",
            ],
        },
        {
            id: 4,
            title: "Advanced Features",
            description: "AI-powered features and advanced learning tools",
            status: "in-progress",
            date: "Q2-Q3 2024",
            features: [
                "AI-powered code suggestions",
                "Personalized learning paths",
                "Mock interview platform",
                "Real-time collaboration tools",
            ],
        },
        {
            id: 5,
            title: "Cloud Labs & Environments",
            description: "Hands-on practice with cloud-based development environments",
            status: "planned",
            date: "Q3 2024",
            features: [
                "Cloud-based IDE integration",
                "Pre-configured development environments",
                "Kubernetes playground",
                "AWS/GCP sandbox environments",
            ],
        },
        {
            id: 6,
            title: "Career Development",
            description: "Tools and resources for career advancement",
            status: "planned",
            date: "Q4 2024",
            features: [
                "Job board integration",
                "Resume builder and review",
                "Interview preparation tools",
                "Mentorship program",
            ],
        },
        {
            id: 7,
            title: "Enterprise Features",
            description: "Team and organization management capabilities",
            status: "planned",
            date: "Q1 2025",
            features: [
                "Team dashboards and analytics",
                "Custom learning paths for teams",
                "SSO and enterprise authentication",
                "Bulk licensing and management",
            ],
        },
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    icon: CheckCircle2,
                    color: "text-green-600 dark:text-green-400",
                    bgColor: "bg-green-500/10",
                    borderColor: "border-green-500/50",
                    label: "Completed",
                };
            case "in-progress":
                return {
                    icon: Clock,
                    color: "text-blue-600 dark:text-blue-400",
                    bgColor: "bg-blue-500/10",
                    borderColor: "border-blue-500/50",
                    label: "In Progress",
                };
            case "planned":
                return {
                    icon: Circle,
                    color: "text-muted-foreground",
                    bgColor: "bg-muted",
                    borderColor: "border-border",
                    label: "Planned",
                };
            default:
                return {
                    icon: Circle,
                    color: "text-muted-foreground",
                    bgColor: "bg-muted",
                    borderColor: "border-border",
                    label: "Unknown",
                };
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Product Roadmap</h1>
                        <p className="text-lg text-muted-foreground">
                            Our journey to build the best learning platform for developers. See what we've accomplished and what's coming next.
                        </p>
                    </div>
                </div>
            </section>

            {/* Roadmap Timeline */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 pb-8 border-b border-border">
                            {["completed", "in-progress", "planned"].map((status) => {
                                const config = getStatusConfig(status);
                                const Icon = config.icon;
                                return (
                                    <div key={status} className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-full ${config.bgColor}`}>
                                            <Icon className={`h-4 w-4 ${config.color}`} />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{config.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

                            {/* Timeline Items */}
                            <div className="space-y-8">
                                {roadmapItems.map((item, index) => {
                                    const config = getStatusConfig(item.status);
                                    const Icon = config.icon;

                                    return (
                                        <div key={item.id} className="relative">
                                            {/* Timeline Dot */}
                                            <div className="absolute left-6 -translate-x-1/2 hidden md:block">
                                                <div className={`p-2 rounded-full ${config.bgColor} border-4 border-background`}>
                                                    <Icon className={`h-5 w-5 ${config.color}`} />
                                                </div>
                                            </div>

                                            {/* Content Card */}
                                            <div className="md:ml-20">
                                                <div className={`bg-card border ${config.borderColor} rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 transition-all duration-300`}>
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                                                                <span className={`px-3 py-1 rounded-full ${config.bgColor} ${config.color} text-xs font-medium`}>
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                        <span className="text-sm font-medium text-primary ml-4 flex-shrink-0">
                                                            {item.date}
                                                        </span>
                                                    </div>

                                                    {/* Features List */}
                                                    <div className="space-y-2">
                                                        {item.features.map((feature, featureIndex) => (
                                                            <div key={featureIndex} className="flex items-start gap-2">
                                                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.status === "completed"
                                                                        ? "text-green-600 dark:text-green-400"
                                                                        : "text-muted-foreground"
                                                                    }`} />
                                                                <span className="text-sm text-foreground">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-16 text-center">
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
                                <h3 className="text-2xl font-semibold text-foreground mb-3">Have a Feature Request?</h3>
                                <p className="text-muted-foreground mb-6">
                                    We'd love to hear your ideas! Share your feedback and help shape the future of BGCE Archive.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a
                                        href="/discussion/new"
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Submit Feedback
                                    </a>
                                    <a
                                        href="/discussion"
                                        className="px-6 py-3 bg-accent text-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors"
                                    >
                                        Join Discussion
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
