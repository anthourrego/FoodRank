export interface User {
  id: number;
  name: string;
  email: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  is_active: boolean;
  city_id: number;
  created_at: string;
  updated_at: string;
  status_text: string;
  formatted_phone?: string;
  city?: City;
  created_by_user?: User;
  updated_by_user?: User;
}

export interface CreateRestaurantData {
  name: string;
  description?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  is_active: boolean;
  city_id: number;
}

export interface UpdateRestaurantData extends Partial<CreateRestaurantData> {
  id: number;
}

export interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  is_active: boolean;
  city_id: number | string;
}

export interface RestaurantFilters {
  search?: string;
  is_active?: boolean;
  city_id?: number;
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

export interface RestaurantListResponse {
  data: Restaurant[];
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