export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Restaurant {
  id: number;
  name: string;
}

export interface ProductRestaurant {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
  status_text: string;
  restaurant?: Restaurant;
  created_by_user?: User;
  updated_by_user?: User;
}

export interface CreateProductRestaurantData {
  name: string;
  description?: string;
  image?: File;
  restaurant_id: number;
}

export interface UpdateProductRestaurantData extends Partial<CreateProductRestaurantData> {
  id: number;
}

export interface ProductRestaurantFormData {
  name: string;
  description: string;
  image: File | null;
  restaurant_id: number | string;
}

export interface ProductRestaurantFilters {
  search?: string;
  is_active?: boolean;
  restaurant_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ProductRestaurantListResponse {
  data: ProductRestaurant[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}
