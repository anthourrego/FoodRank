import type { City } from "./City";

export interface RestaurantBranch {
  id:            number;
  address:       string;
  phone:         string;
  latitude:      string;
  longitude:     string;
  is_active:     number;
  city_id:       number;
  restaurant_id: number;
  created_by:    null;
  updated_by:    null;
  created_at:    Date;
  updated_at:    Date;
  city:          City;
}

