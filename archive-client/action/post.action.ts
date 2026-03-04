"use server";

import { postService } from "@/service/post.service";

export const getPosts = async (params?: {
  status?: string;
  category_id?: number;
  sub_category_id?: number;
  limit?: number;
  offset?: number;
  search?: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}) => {
  const result = await postService.getPosts(params);
  console.log("Testing API call");
  return result;
};

export const getPostBySlug = async (slug: string) => {
  const result = await postService.getPostBySlug(slug);
  return result;
};

export const getPostById = async (id: number) => {
  const result = await postService.getPostById(id);
  return result;
};
