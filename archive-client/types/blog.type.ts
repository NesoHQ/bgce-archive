export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Article {
  id: number; // Needed for key in lists
  title: string;
  author: string; // New field
  publishedAt: string; // New field
  views: number; // New field
  votes: number; // New field
  description: string;
  tags: string[]; // New field
}
