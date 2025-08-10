export interface EventProduct {
    id: number;
    event_id: number;
    product_id: number;
    is_active: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    restaurant_product: RestaurantProduct;
    branchs_product: EventProductBranch[];
}

export interface RestaurantProduct {
    id: number;
    name: string;
    description: string;
    image_url: string;
    is_active: number;
    restaurant_id: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    restaurant: Restaurant;
}

export interface Restaurant {
    id: number;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    instagram: string | null;
    facebook: string | null;
    is_active: number;
    city_id: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    restaurant_branches: RestaurantBranch[];
}

export interface RestaurantBranch {
    id: number;
    address: string;
    phone: string;
    latitude: string;
    longitude: string;
    is_active: number;
    city_id: number;
    restaurant_id: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    city: City;
}

export interface City {
    id: number;
    name: string;
    code: string;
    is_active: number;
    state_id: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface EventProductBranch {
    branch: RestaurantBranch;
    id: number;
    event_product_id: number;
    restaurant_branch_id: number;
    is_active: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface RestaurantBranch {
  id: number;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
  is_active: number; // o 0 | 1 si prefieres más estricto
  city_id: number;
  restaurant_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
