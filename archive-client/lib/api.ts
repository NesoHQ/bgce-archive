import {
  getCategoriesAction,
  getPostsAction,
  getPostBySlugAction,
} from "./actions";

/**
 * Server-side API utility for React Server Components.
 * This has been refactored to simply utilize the shared Server Actions.
 */
export const api = {
  getCategories: getCategoriesAction,
  getPosts: getPostsAction,
  getPostBySlug: getPostBySlugAction,
};
