export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating?: number;
  reviews?: [{ rating: number; comment: string; reviewerName: string; reviewerEmail: string; date: string }];
  stock?: number;
  discount?: number;
  dimensions?: {
    length?: number;
    depth?: number;
    width?: number;
    height?: number;
  };
  badge?: 'New' | 'Sale' | 'Best Seller';
  tags?: string[];
  colors: string[];
  colorImages: {
    [key: string]: string;
  };
  video?: string;
  category: string;
  subcategory?: string;
  meta?: {
    material?: string;
    careInstructions?: string;
    origin?: string;
    createdAt?: string;
    updatedAt?: string;
    releaseDate?: string;
    [key: string]: any;
  };
}