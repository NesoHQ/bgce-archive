import React from "react";
import { Card, CardContent } from "../ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const AuthorInformation = () => {
  return (
    <div className="sticky top-6 h-fit">
      <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 border-2 border-gray-100 dark:border-slate-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-white">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Alex Johnson
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Senior writer & tech enthusiast
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  24
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Posts
                </div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Following
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
