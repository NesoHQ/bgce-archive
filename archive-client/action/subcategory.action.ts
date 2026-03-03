"use server"

import { subcategoryService } from "@/service/subcategory.service";

export const getSubcategories = async (parentUuid?: string) => {
    const result = await subcategoryService.getSubcategories(parentUuid);
    return result;
}