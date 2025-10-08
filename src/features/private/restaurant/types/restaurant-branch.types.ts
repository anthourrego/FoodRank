import type { City, Restaurant, User } from "./restaurant.types";

export interface RestaurantBranch {
  id: number;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  city_id: number;
  restaurant_id: number;
  created_by?: number | null;
  updated_by?: number | null;
  city?: City;
  restaurant?: Restaurant;
  createdBy?: User;
  updatedBy?: User;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
}

export interface RestaurantBranchesResponse {
  data: RestaurantBranch[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
}

export interface RequestRestaurantBranch {
  page?: number;
  per_page?: number;
  search?: string;
  restaurant_id?: number;
  city_id?: number;
  is_active?: boolean;
}
