"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    ThumbsUp,
    MessageSquare,
    Share2,
    Bookmark,
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const blogId = params.id as string;

    // Mock blog data - in production, fetch from API
    const blogs = [
        {
            id: "1",
            title: "Building Scalable Microservices with Go",
            excerpt: "Learn how to design and implement microservices architecture using Go, gRPC, and Kubernetes for production-ready applications.",
            content: `
# Building Scalable Microservices with Go

Microservices architecture has become the de facto standard for building modern, scalable applications. In this comprehensive guide, we'll explore how to design and implement microservices using Go, one of the most efficient languages for building distributed systems.

## Why Go for Microservices?

Go (Golang) is particularly well-suited for microservices development due to several key features:

- **Concurrency**: Built-in goroutines and channels make concurrent programming straightforward
- **Performance**: Compiled language with excellent runtime performance
- **Simplicity**: Clean syntax and minimal learning curve
- **Standard Library**: Rich standard library with HTTP, JSON, and networking support
- **Static Typing**: Catch errors at compile time

## Architecture Overview

When building microservices with Go, we typically follow these architectural patterns:

### 1. Service Discovery

Service discovery is crucial in a microservices architecture. We can use tools like:
- Consul
- etcd
- Kubernetes DNS

### 2. API Gateway

An API gateway serves as the single entry point for all client requests:

\`\`\`go
package main

import (
    "net/http"
    "github.com/gorilla/mux"
)

func main() {
    router := mux.NewRouter()
    router.HandleFunc("/api/users", handleUsers)
    router.HandleFunc("/api/orders", handleOrders)
    
    http.ListenAndServe(":8080", router)
}
\`\`\`

### 3. Communication Patterns

Microservices can communicate using:
- **REST APIs**: Simple and widely adopted
- **gRPC**: High-performance RPC framework
- **Message Queues**: Asynchronous communication

## Implementing a Microservice

Let's build a simple user service:

\`\`\`go
package main

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
)

type User struct {
    ID    string \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    userID := vars["id"]
    
    // Fetch user from database
    user := User{
        ID:    userID,
        Name:  "John Doe",
        Email: "john@example.com",
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func main() {
    router := mux.NewRouter()
    router.HandleFunc("/users/{id}", getUserHandler).Methods("GET")
    
    http.ListenAndServe(":8081", router)
}
\`\`\`

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

\`\`\`go
if err != nil {
    log.Printf("Error: %v", err)
    http.Error(w, "Internal Server Error", http.StatusInternalServerError)
    return
}
\`\`\`

### 2. Configuration Management

Use environment variables or configuration files:

\`\`\`go
import "os"

dbHost := os.Getenv("DB_HOST")
dbPort := os.Getenv("DB_PORT")
\`\`\`

### 3. Health Checks

Implement health check endpoints:

\`\`\`go
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}
\`\`\`

## Deployment with Kubernetes

Deploy your microservices to Kubernetes:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 8081
\`\`\`

## Monitoring and Observability

Use tools like:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Jaeger**: Distributed tracing
- **ELK Stack**: Centralized logging

## Conclusion

Building microservices with Go provides a powerful combination of performance, simplicity, and scalability. By following best practices and using the right tools, you can create robust, production-ready microservices that scale with your business needs.

Remember to:
- Keep services small and focused
- Implement proper error handling
- Use service discovery
- Monitor and log everything
- Test thoroughly

Happy coding!
            `,
            author: { name: "Sarah Chen", avatar: "SC", color: "bg-blue-500" },
            category: "microservices",
            date: "2024-02-20",
            views: 12500,
            likes: 489,
            comments: 123,
            tags: ["Go", "Microservices", "Architecture"],
            readTime: "12 min",
            isHot: true,
        },
        {
            id: "2",
            title: "Optimizing Database Queries in Production",
            excerpt: "Deep dive into query optimization techniques, indexing strategies, and performance monitoring for high-traffic applications.",
            content: `
# Optimizing Database Queries in Production

Database performance is critical for application success. This guide covers essential optimization techniques for production databases.

## Understanding Query Performance

Before optimizing, you need to understand what's slow. Use EXPLAIN ANALYZE to see query execution plans.

## Indexing Strategies

Proper indexing can dramatically improve query performance:

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
\`\`\`

## Query Optimization Techniques

1. Avoid SELECT *
2. Use appropriate JOIN types
3. Limit result sets
4. Use prepared statements

## Monitoring and Profiling

Set up monitoring with tools like:
- pg_stat_statements
- pgBadger
- Prometheus + Grafana

## Conclusion

Regular monitoring and optimization keep your database performing well at scale.
            `,
            author: { name: "Michael Rodriguez", avatar: "MR", color: "bg-purple-500" },
            category: "database",
            date: "2024-02-18",
            views: 8900,
            likes: 356,
            comments: 87,
            tags: ["Database", "Performance", "SQL"],
            readTime: "15 min",
            isHot: true,
        },
    ];

    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
                    <Button onClick={() => router.push("/blogs")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blogs
                    </Button>
                </div>
            </div>
        );
    }

    // Related blogs
    const relatedBlogs = blogs.filter(b => b.id !== blogId).slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            {/* Header with breadcrumb */}
            <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/blogs" className="hover:text-primary transition-colors">
                            Blogs
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium truncate max-w-[200px]">
                            {blog.title}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => router.push("/blogs")}
                        className="group mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Blogs
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        {/* Article Header */}
                        <div className="mb-8">
                            {/* Category & Hot Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 dark:bg-primary/20">
                                    {blog.category}
                                </Badge>
                                {blog.isHot && (
                                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                                        🔥 Hot
                                    </Badge>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            {/* Excerpt */}
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {blog.excerpt}
                            </p>

                            {/* Author & Meta */}
                            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-border">
                                        <AvatarFallback className={`${blog.author.color} text-white font-bold`}>
                                            {blog.author.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{blog.author.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(blog.date).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {blog.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {blog.views.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-4 w-4" />
                                        {blog.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        {blog.comments}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {blog.content}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
                            {blog.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mb-8 p-6 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="gap-2 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    Like ({blog.likes})
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 border-2 dark:border-input dark:hover:border-[oklch(0.75_0.22_260)] dark:hover:bg-[oklch(0.28_0.06_260)] dark:hover:text-[oklch(0.85_0.28_260)]"
                                >
                                    <Bookmark className="h-4 w-4" />
                                    Save
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Link2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="p-6 rounded-lg border-2 border-border dark:border-input bg-gradient-to-br from-card via-card/95 to-card/80 dark:from-card dark:via-card/95 dark:to-card/50">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarFallback className={`${blog.author.color} text-white text-xl font-bold`}>
                                        {blog.author.avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-2">About {blog.author.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Senior Software Engineer with 10+ years of experience in building scalable systems.
                                        Passionate about Go, microservices, and cloud architecture.
                                    </p>
                                    <Button variant="outline" size="sm" className="border-2">
                                        Follow
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-20 space-y-6">
                            {/* Table of Contents */}
                            <div className="p-6 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30">
                                <h3 className="text-lg font-bold text-foreground mb-4">Table of Contents</h3>
                                <nav className="space-y-2 text-sm">
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Why Go for Microservices?
                                    </a>
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Architecture Overview
                                    </a>
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Implementing a Microservice
                                    </a>
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Best Practices
                                    </a>
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Deployment with Kubernetes
                                    </a>
                                    <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                                        Monitoring and Observability
                                    </a>
                                </nav>
                            </div>

                            {/* Related Blogs */}
                            <div className="p-6 rounded-lg border-2 border-border dark:border-input bg-card/50 dark:bg-card/30">
                                <h3 className="text-lg font-bold text-foreground mb-4">Related Articles</h3>
                                <div className="space-y-4">
                                    {relatedBlogs.map((relatedBlog) => (
                                        <Link
                                            key={relatedBlog.id}
                                            href={`/blogs/${relatedBlog.id}`}
                                            className="block group"
                                        >
                                            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-[oklch(0.85_0.28_260)] transition-colors line-clamp-2 mb-2">
                                                {relatedBlog.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{relatedBlog.readTime}</span>
                                                <span>•</span>
                                                <span>{relatedBlog.views.toLocaleString()} views</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
                                <h3 className="text-lg font-bold text-foreground mb-2">Stay Updated</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get the latest articles delivered to your inbox.
                                </p>
                                <Button className="w-full bg-gradient-to-r from-[oklch(0.4_0.14_260)] to-[oklch(0.35_0.12_260)] hover:from-[oklch(0.45_0.16_260)] hover:to-[oklch(0.4_0.14_260)] dark:from-[oklch(0.65_0.18_260)] dark:to-[oklch(0.6_0.16_260)] dark:hover:from-[oklch(0.75_0.22_260)] dark:hover:to-[oklch(0.7_0.2_260)] text-white dark:text-white">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
