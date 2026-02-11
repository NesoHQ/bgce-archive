"use client";

import { User, MessageSquare, ThumbsUp, Eye } from "lucide-react";

export default function RecentQuestions() {
  const questions = [
    {
      title: "Partially failed Control Tower setup with an incomplete acco...",
      desc: "Hi all, I have the following problem: I have been dealing with a partially failed Control Tower setup with an incomplete account that can't be removed normally. The account is closed but I want to...",
      tags: ["AWS Control Tower", "AWS Organizations"],
      stats: { answers: 1, votes: 0, views: 1 },
      author: "Col",
      time: "asked 5 hours ago",
    },
    {
      title: "How to optimize Lambda cold start times for Node.js functions?",
      desc: "I'm experiencing significant cold start latency with my Node.js Lambda functions (around 3-4 seconds). I've tried reducing package size and using Lambda layers, but the improvement is minimal. What are the best practices for...",
      tags: ["AWS Lambda", "Node.js", "Performance"],
      stats: { answers: 3, votes: 12, views: 247 },
      author: "Sarah",
      time: "asked 2 days ago",
    },
    {
      title: "S3 bucket policy vs IAM policy - which one should I use?",
      desc: "I'm confused about when to use S3 bucket policies versus IAM policies for access control. I need to grant cross-account access to specific objects in my bucket. What's the recommended approach and what are the security implications...",
      tags: ["AWS S3", "IAM", "Security"],
      stats: { answers: 5, votes: 28, views: 892 },
      author: "DevOps_Mike",
      time: "asked 1 week ago",
    },
    {
      title: "RDS MySQL to Aurora migration - downtime considerations",
      desc: "Planning to migrate our production RDS MySQL database (500GB) to Aurora. We can only afford 2 hours of downtime. Has anyone done this successfully? Looking for advice on using DMS vs snapshot restore, and any gotchas to watch out for...",
      tags: ["AWS RDS", "Aurora", "Database Migration"],
      stats: { answers: 2, votes: 7, views: 156 },
      author: "Alex_Chen",
      time: "asked 3 days ago",
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Recent questions</h2>
        <p className="text-sm text-muted-foreground font-mono mt-2">
          Latest community discussions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="rounded-md bg-card/30 border border-gray-300 dark:border-white/10 backdrop-blur-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {q.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {q.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {q.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/80 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                {/* Stats */}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                    <strong>{q.stats.answers}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                    <strong>{q.stats.votes}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <strong>{q.stats.views}</strong>
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{q.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
