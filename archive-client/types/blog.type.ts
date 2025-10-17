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
  id: number;
  title: string;
  description: string;
  publication: string;
  image: string;
}
