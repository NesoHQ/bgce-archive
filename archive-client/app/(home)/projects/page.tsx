import Link from "next/link";
import { Folder, Star, GitFork, Eye } from "lucide-react";

export default function ProjectsPage() {
    const projects = [
        {
            id: 1,
            title: "Microservices E-Commerce Platform",
            description: "Build a complete e-commerce platform using microservices architecture with Go, gRPC, and Kubernetes",
            difficulty: "Advanced",
            stars: 1250,
            forks: 340,
            views: 8900,
            tags: ["Go", "Microservices", "Kubernetes"],
        },
        {
            id: 2,
            title: "Real-time Chat Application",
            description: "Create a scalable real-time chat app with WebSockets, Redis, and PostgreSQL",
            difficulty: "Intermediate",
            stars: 890,
            forks: 230,
            views: 6700,
            tags: ["Go", "WebSocket", "Redis"],
        },
        {
            id: 3,
            title: "CLI Task Manager",
            description: "Build a command-line task management tool with local storage and cloud sync",
            difficulty: "Beginner",
            stars: 560,
            forks: 180,
            views: 4500,
            tags: ["Go", "CLI", "SQLite"],
        },
    ];

    return (
        <div className="min-h-screen">
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Projects</h1>
                    <p className="text-muted-foreground">Build real-world applications with guided templates</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group bg-gradient-to-br from-card/90 to-card/70 dark:from-card dark:to-card/60 border-2 border-border backdrop-blur-sm rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Folder className="h-6 w-6 text-primary" />
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-medium mb-3">
                                {project.difficulty}
                            </span>
                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {project.stars}
                                </div>
                                <div className="flex items-center gap-1">
                                    <GitFork className="h-3 w-3" />
                                    {project.forks}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {project.views}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
