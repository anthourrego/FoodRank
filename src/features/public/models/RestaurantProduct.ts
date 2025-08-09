import type { Restaurant } from "./Restaurant";


export interface RestaurantProduct {
  id:            number;
  name:          string;
  description:   string;
  image_url:     string;
  is_active:     number;
  restaurant_id: number;
  created_by:    null;
  updated_by:    null;
  created_at:    Date;
  updated_at:    Date;
  restaurant:    Restaurant;
  rating:number
}
