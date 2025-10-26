"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, List, Grid } from "lucide-react";

type ArticleSearchProps = {
  viewMode: string;
  setViewMode: (mode: "list" | "grid") => void;
};

export function ArticleSearch({ setViewMode, viewMode }: ArticleSearchProps) {
  return (
    <div className="w-full space-y-4 py-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="rounded-sm shadow-none  pl-10 w-full h-10 focus-visible:ring-0.1 focus-visible:ring-blue-500 focus-visible:border-blue-500 border border-gray-400 font-medium"
          />
        </div>

        {/* Category */}
        <Select>
          <SelectTrigger
            className=" w-full  md:w-[200px] lg:w-[300px]  !h-10 font-medium
            border
            rounded-sm             
            shadow-none 
            border-gray-400
            focus:ring-0.1
            focus:ring-blue-500
            focus:border-blue-500
            focus:outline-none
            data-[state=open]:ring-0.1
            data-[state=open]:ring-blue-500
            data-[state=open]:border-blue-500"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="font-medium">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>

        {/* Subcategory */}
        <Select>
          <SelectTrigger
            className="w-full md:w-[200px] lg:w-[300px] !h-10 font-medium
            border
            rounded-sm             
            shadow-none 
            border-gray-400
            focus:ring-0.1
            focus:ring-blue-500
            focus:border-blue-500
            focus:outline-none
            data-[state=open]:ring-0.1
            data-[state=open]:ring-blue-500
            data-[state=open]:border-blue-500 rounded-0"
          >
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent className="font-medium">
            <SelectItem value="all">Sort by name (A-Z)</SelectItem>
            <SelectItem value="web">Sort by name (Z-A)</SelectItem>
            <SelectItem value="mobile">Sort by most recent</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-9 px-3 cursor-pointer"
          >
            <Grid className="h-4 w-4" />
          </Button>

          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-9 px-3 cursor-pointer"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
