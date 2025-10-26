import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Article {
  id: number;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  views: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    badgeColor: string;
  };
  publishedDate: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: '"The provided number does not exist or does not belong to th...',
    description:
      'I want to resolve the "The provided number does not exist or does not belong to the account." error when I send an SMS message using AWS SNS or Pinpoint from my account.',
    tags: [
      "AWS End User Messaging",
      "Amazon Simple Notification Service (SNS)",
      "Amazon Pinpoint",
    ],
    votes: 0,
    views: "764",
    author: {
      name: "rajaws",
      avatar: "/placeholder.svg",
      badge: "SUPPORT ENGINEER",
      badgeColor: "bg-orange-500",
    },
    publishedDate: "published 7 months ago",
  },
  {
    id: 2,
    title: "'Network Error' uploading files with Amplify Storage",
    description:
      "Demonstrates how to configure an S3 bucket to accept multipart uploads using Amplify",
    tags: ["AWS Amplify", "Amazon Q"],
    votes: 0,
    views: "2.6K",
    author: {
      name: "Patrick Kremer",
      avatar: "/placeholder.svg",
      badge: "EXPERT",
      badgeColor: "bg-purple-600",
    },
    publishedDate: "published a year ago",
  },
  {
    id: 3,
    title: ".NET 8 Support Now Available for Amazon GameLift Servers C# ...",
    description:
      "Amazon GameLift Servers announces .NET 8 support for the C# Server SDK 5. This update ensures continued security patches and technical support, offering developers a seamless path to maintain secure a...",
    tags: [
      "Amazon GameLift Servers",
      "Game Tech",
      "Game Server Hosting & Backends",
    ],
    votes: 0,
    views: "127",
    author: {
      name: "Sachin",
      avatar: "/placeholder.svg",
      badge: "EXPERT",
      badgeColor: "bg-purple-600",
    },
    publishedDate: "published 6 months ago",
  },
];

const ArticleList: React.FC = () => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card
          key={article.id}
          className="w-full hover:shadow-lg transition-shadow duration-200 p-0 rounded-sm"
        >
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Main Content */}
              <div className="flex-1 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 hover:text-blue-900 cursor-pointer">
                  {article.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {article.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ARTICLE
                  </Badge>
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white hover:bg-gray-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats and Author Section */}
              <div className="bg-[#EEEEFA] p-4 md:px-4 md:py-4  lg:w-72 border-t lg:border-t-0 lg:border-l">
                <div className="flex lg:flex-col gap-1">
                  {/* Stats */}
                  <div className="flex lg:flex-row gap-4 lg:gap-6 lg:mb-4 items-center mr-2">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                        {article.votes}
                      </div>
                      <div className="text-xs text-gray-600">votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                        {article.views}
                      </div>
                      <div className="text-xs text-gray-600">views</div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 flex-1 lg:flex-initial">
                    <div className="relative">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-gray-800">
                        <AvatarImage
                          src={article.author.avatar}
                          alt={article.author.name}
                        />
                        <AvatarFallback>
                          {article.author.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`inline-block px-2 py-0.5 ${article.author.badgeColor} text-white text-[10px] font-semibold rounded mb-1`}
                      >
                        {article.author.badge}
                      </div>
                      <div className="text-teal-900 text-sm font-medium hover:underline cursor-pointer">
                        {article.author.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {article.publishedDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
