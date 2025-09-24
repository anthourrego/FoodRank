
import apiClient from "@/services/axios";
import {
  type Restaurant,
  type City,
  type CreateRestaurantData,
  type RestaurantFilters,
  type RestaurantListResponse,
} from "../types/restaurant.types";

export class RestaurantService {
  private readonly endpoint = "/restaurants";

  async getRestaurants(
    filters?: RestaurantFilters
  ): Promise<RestaurantListResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
    const url = `${this.endpoint}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get(url);
    return response.data;
  }

  async getRestaurant(id: number): Promise<Restaurant> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async createRestaurant(data: CreateRestaurantData): Promise<{
    restaurant: Restaurant;
    message: string;
  }> {
    return apiClient.post(`${this.endpoint}`, data);
  }

  async updateRestaurant(
    id: number,
    data: Partial<CreateRestaurantData>
  ): Promise<{
    restaurant: Restaurant;
    message: string;
  }> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async deleteRestaurant(id: number): Promise<{ message: string }> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  async toggleRestaurantStatus(id: number): Promise<{
    restaurant: Restaurant;
    message: string;
  }> {
    return apiClient.patch(`${this.endpoint}/${id}/toggle-status`);
  }

  async getCities(): Promise<City[]> {
    const response = await apiClient.get("/cities")
    return response.data;
  }
}

export const restaurantService = new RestaurantService();
