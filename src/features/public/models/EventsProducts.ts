import type { RestaurantProduct } from "./RestaurantProduct";

export interface EventsProduct {
  id:                 number;
  event_id:           number;
  product_id:         number;
  is_active:          number;
  created_by:         null;
  updated_by:         null;
  created_at:         Date;
  updated_at:         Date;
  restaurant_product: RestaurantProduct;
}