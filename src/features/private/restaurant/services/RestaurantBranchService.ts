import apiClient from "@/api/axiosInstance";
import type { RestaurantBranchFormData } from "../page/components/RestaurantBranchForm";
import type {
  RequestRestaurantBranch,
  RestaurantBranch,
  RestaurantBranchesResponse,
} from "../types/restaurant-branch.types";

export const restaurantBranchService = {
  getAll: async (
    params?: RequestRestaurantBranch
  ): Promise<RestaurantBranchesResponse> => {
    const response = await apiClient.get("/restaurant-branches", { params });
    return response.data;
  },

  getById: async (id: number): Promise<RestaurantBranch> => {
    const response = await apiClient.get(`/restaurant-branches/${id}`);
    return response.data;
  },
  create: async (data: RestaurantBranchFormData): Promise<RestaurantBranch> => {
    const response = await apiClient.post("/restaurant-branches", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: RestaurantBranchFormData
  ): Promise<RestaurantBranch> => {
    const response = await apiClient.put(`/restaurant-branches/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/restaurant-branches/${id}`);
  },

  toggleStatus: async (id: number): Promise<RestaurantBranch> => {
    const response = await apiClient.patch(
      `/restaurant-branches/${id}/toggle-status`
    );
    return response.data.data;
  },
};

export default restaurantBranchService;
