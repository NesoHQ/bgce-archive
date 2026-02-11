"use client";

import {
  GraduationCap,
  ArrowRight,
  Clock,
  Star,
  PlayCircle,
} from "lucide-react";

export default function CoursesSection() {
  const courses = [
    {
      title: "Machine Learning Fundamentals",
      desc: "Master the basics of ML with hands-on projects and real-world applications",
      instructor: "Dr. Sarah Johnson",
      rating: 4.9,
      reviews: 12458,
      duration: "8 weeks",
      level: "Beginner",
      enrolled: "45,234",
      image: "🤖",
      progress: 0,
    },
    {
      title: "Advanced Deep Learning with PyTorch",
      desc: "Build state-of-the-art neural networks and deploy them to production",
      instructor: "Prof. Michael Chen",
      rating: 4.8,
      reviews: 8934,
      duration: "12 weeks",
      level: "Advanced",
      enrolled: "28,567",
      image: "🧠",
      progress: 0,
    },
    {
      title: "Data Science with Python",
      desc: "Learn pandas, NumPy, and visualization libraries for data analysis",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      reviews: 15234,
      duration: "6 weeks",
      level: "Intermediate",
      enrolled: "67,891",
      image: "📊",
      progress: 0,
    },
  ];

  return (
    <section className="container mx-auto py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            Courses
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            Learn from industry experts with interactive courses • 100% Free
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="rounded-md bg-card/30 border border-gray-300 dark:border-white/10 backdrop-blur-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col"
          >
            {/* Content */}
            <div className="p-6 space-y-4 flex-1">
              {/* Icon + Level */}
              <div className="flex items-start justify-between">
                <div className="text-5xl">{course.image}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    course.level === "Beginner"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                      : course.level === "Intermediate"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                  }`}
                >
                  {course.level}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
                {course.desc}
              </p>

              {/* Instructor */}
              <p className="text-xs font-medium text-foreground">
                👨‍🏫 {course.instructor}
              </p>

              {/* Rating + Duration */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-muted-foreground">
                    ({course.reviews.toLocaleString()})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/80 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-[10px]">
                    FREE
                  </span>
                  <span className="text-muted-foreground">
                    {course.enrolled} enrolled
                  </span>
                </div>
                <button className="flex items-center gap-1 text-primary hover:gap-2 transition-all font-medium">
                  <PlayCircle className="h-3.5 w-3.5" />
                  Start
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
