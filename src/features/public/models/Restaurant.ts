import type { RestaurantBranch } from "./RestaurantBranchs";

export interface Restaurant {
  id:                  number;
  name:                string;
  description:         string;
  address:             string;
  email:               string;
  phone:               string;
  website:             string;
  instagram:           null;
  facebook:            null;
  is_active:           number;
  city_id:             number;
  created_by:          null;
  updated_by:          null;
  created_at:          Date;
  updated_at:          Date;
  restaurant_branches: RestaurantBranch[];
  socialMedia?: {
    instagram: string
    facebook: string
  }
  owner?: string
}
