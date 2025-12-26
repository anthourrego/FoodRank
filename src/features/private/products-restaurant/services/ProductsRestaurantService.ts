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
    const url = `${this.endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ""
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
    if (data.image) {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('restaurant_id', data.restaurant_id.toString());
      formData.append('image', data.image);

      return apiClient.post(`${this.endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return apiClient.post(`${this.endpoint}`, data);
  }

  async updateProductRestaurant(
    id: number,
    data: Partial<CreateProductRestaurantData>
  ): Promise<{
    product: ProductRestaurant;
    message: string;
  }> {
    // Si hay una imagen, enviar como FormData
    if (data.image) {
      const formData = new FormData();
      if (data.name) {
        formData.append('name', data.name);
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.restaurant_id) {
        formData.append('restaurant_id', data.restaurant_id.toString());
      }
      formData.append('image', data.image);

      // Para Laravel, necesitamos usar _method POST con FormData en updates
      formData.append('_method', 'PUT');

      return apiClient.post(`${this.endpoint}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // Si no hay imagen, enviar como JSON normal
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
