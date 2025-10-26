import ArchiveWrapper from "@/components/archive/ArchiveWrapper";
import { Article } from "@/types/blog.type";

const ArticlesPage = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: "Understanding Next.js 15 New Features",
      author: "Tech Journal",
      publishedAt: "Jan 15, 2024",
      views: 120,
      votes: 10,
      description:
        "Explore the latest features and improvements in Next.js 15 and how they can benefit your projects.",
      tags: ["Next.js", "Web Development", "JavaScript"],
    },
    {
      id: 2,
      title: "The Future of Software Development",
      author: "Dev Weekly",
      publishedAt: "Jan 12, 2024",
      views: 95,
      votes: 8,
      description:
        "A comprehensive look at emerging trends and technologies shaping the future of Software development.",
      tags: ["Software Development", "Trends", "Tech"],
    },
    {
      id: 3,
      title: "TypeScript Best Practices 2024",
      author: "Code Review",
      publishedAt: "Jan 10, 2024",
      views: 80,
      votes: 5,
      description:
        "Learn the most effective TypeScript patterns and practices for modern Software development.",
      tags: ["TypeScript", "Best Practices", "Programming"],
    },
    {
      id: 4,
      title: "Responsive Design Mastery",
      author: "Design Monthly",
      publishedAt: "Jan 8, 2024",
      views: 70,
      votes: 4,
      description:
        "Master the art of creating fully responsive layouts that work across all devices and screen sizes.",
      tags: ["Responsive Design", "CSS", "UX/UI"],
    },
    {
      id: 5,
      title: "State Management in React",
      author: "React Digest",
      publishedAt: "Jan 5, 2024",
      views: 110,
      votes: 7,
      description:
        "Comparing different state management solutions and when to use each in your React applications.",
      tags: ["React", "State Management", "JavaScript"],
    },
    {
      id: 6,
      title: "CSS Grid vs Flexbox",
      author: "Web Design Pro",
      publishedAt: "Jan 3, 2024",
      views: 65,
      votes: 3,
      description:
        "A detailed comparison of CSS Grid and Flexbox with practical examples and use cases.",
      tags: ["CSS", "Grid", "Flexbox", "Web Design"],
    },
  ];

  return (
    <>
      <ArchiveWrapper articles={articles} />
    </>
  );
};

export default ArticlesPage;
