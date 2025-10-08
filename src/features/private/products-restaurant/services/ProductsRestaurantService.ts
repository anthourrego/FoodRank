import apiClient from "@/api/axiosInstance";
import {
  type ProductRestaurant,
  type Restaurant,
  type CreateProductRestaurantData,
  type ProductRestaurantFilters,
  type ProductRestaurantListResponse,
} from "../types/products-restaurant.types";

export class ProductsRestaurantService {
  private readonly endpoint = "/products-restaurant";

  async getProductsRestaurant(
    filters?: ProductRestaurantFilters
  ): Promise<ProductRestaurantListResponse> {
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

  async getProductRestaurant(id: number): Promise<ProductRestaurant> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  async createProductRestaurant(data: CreateProductRestaurantData): Promise<{
    product: ProductRestaurant;
    message: string;
  }> {
    return apiClient.post(`${this.endpoint}`, data);
  }

  async updateProductRestaurant(
    id: number,
    data: Partial<CreateProductRestaurantData>
  ): Promise<{
    product: ProductRestaurant;
    message: string;
  }> {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  async deleteProductRestaurant(id: number): Promise<{ message: string }> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  async toggleProductRestaurantStatus(id: number): Promise<{
    product: ProductRestaurant;
    message: string;
  }> {
    return apiClient.patch(`${this.endpoint}/${id}/toggle-status`);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    const response = await apiClient.get("/restaurants");
    return response.data;
  }
}

export const productsRestaurantService = new ProductsRestaurantService();
