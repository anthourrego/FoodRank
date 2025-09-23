import { useState, useEffect, useCallback } from 'react';
import {
  type Restaurant,
  type City,
  type CreateRestaurantData,
  type RestaurantFilters,
  type RestaurantListResponse,
  type PaginationData,
  type ApiResponse
} from '../types/restaurant.types';
import { restaurantService } from '../services/RestaurantService';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  cities: City[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  fetchRestaurants: (params?: RestaurantFilters) => Promise<void>;
  createRestaurant: (restaurantData: CreateRestaurantData) => Promise<ApiResponse<Restaurant>>;
  updateRestaurant: (id: number, restaurantData: Partial<CreateRestaurantData>) => Promise<ApiResponse<Restaurant>>;
  deleteRestaurant: (id: number) => Promise<ApiResponse<null>>;
  toggleRestaurantStatus: (id: number) => Promise<ApiResponse<Restaurant>>;
  getRestaurant: (id: number) => Promise<ApiResponse<Restaurant>>;
  fetchCities: () => Promise<void>;
}

const useRestaurants = (): UseRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  const fetchRestaurants = useCallback(async (params: RestaurantFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {

      const data: RestaurantListResponse = await restaurantService.getRestaurants(params);
      
      setRestaurants(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
        from: data.from,
        to: data.to
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cities
  const fetchCities = useCallback(async () => {
    try {
      const data: City[] = await restaurantService.getCities();
      setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  }, []);

  // Create restaurant
  const createRestaurant = async (restaurantData: CreateRestaurantData): Promise<ApiResponse<Restaurant>> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.createRestaurant(restaurantData);
      
      await fetchRestaurants();
      return { success: true, data: data.restaurant, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant
  const updateRestaurant = async (
    id: number, 
    restaurantData: Partial<CreateRestaurantData>
  ): Promise<ApiResponse<Restaurant>> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.updateRestaurant(id, restaurantData);
      
      await fetchRestaurants();
      return { success: true, data: data.restaurant, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete restaurant
  const deleteRestaurant = async (id: number): Promise<ApiResponse<null>> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.deleteRestaurant(id);
      
      await fetchRestaurants();
      return { success: true, data: null, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Toggle restaurant status
  const toggleRestaurantStatus = async (id: number): Promise<ApiResponse<Restaurant>> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.toggleRestaurantStatus(id);
      
      await fetchRestaurants();
      return { success: true, data: data.restaurant, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get single restaurant
  const getRestaurant = async (id: number): Promise<ApiResponse<Restaurant>> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: Restaurant = await restaurantService.getRestaurant(id);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    restaurants,
    cities,
    loading,
    error,
    pagination,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
    getRestaurant,
    fetchCities
  };
};

export default useRestaurants;