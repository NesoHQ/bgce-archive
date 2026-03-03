"use server";

import { categoryService } from "@/service/category.service";

export const getCategories = async () => {
  const result = await categoryService.getCategories();
  return result;
};

export const getCategoryBySlug = async (slug: string) => {
  const result = await categoryService.getCategoryBySlug(slug);
  return result;
};
