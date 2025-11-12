import { useState, useCallback } from "react";
import {
  type ProductRestaurant,
  type CreateProductRestaurantData,
  type ProductRestaurantFilters,
  type ProductRestaurantListResponse,
  type PaginationData,
  type ApiResponse,
} from "../types/products-restaurant.types";
import { productsRestaurantService } from "../services/ProductsRestaurantService";

interface UseProductsRestaurantReturn {
  products: ProductRestaurant[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  fetchProducts: (params?: ProductRestaurantFilters) => Promise<void>;
  createProduct: (
    productData: CreateProductRestaurantData
  ) => Promise<ApiResponse<ProductRestaurant>>;
  updateProduct: (
    id: number,
    productData: Partial<CreateProductRestaurantData>
  ) => Promise<ApiResponse<ProductRestaurant>>;
  deleteProduct: (id: number) => Promise<ApiResponse<null>>;
  toggleProductStatus: (id: number) => Promise<ApiResponse<ProductRestaurant>>;
  getProduct: (id: number) => Promise<ApiResponse<ProductRestaurant>>;
}

const useProductsRestaurant = (): UseProductsRestaurantReturn => {
  const [products, setProducts] = useState<ProductRestaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ProductRestaurantFilters>({});
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchProducts = useCallback(
    async (params: ProductRestaurantFilters = {}) => {
      setLoading(true);
      setError(null);
      setCurrentFilters(params);

      try {
        const data: ProductRestaurantListResponse =
          await productsRestaurantService.getProductsRestaurant(params);

        setProducts(data.data);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          from: data.from,
          to: data.to,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createProduct = async (
    productData: CreateProductRestaurantData
  ): Promise<ApiResponse<ProductRestaurant>> => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsRestaurantService.createProductRestaurant(
        productData
      );

      await fetchProducts(currentFilters);
      return { success: true, data: data.product, message: data.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: number,
    productData: Partial<CreateProductRestaurantData>
  ): Promise<ApiResponse<ProductRestaurant>> => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsRestaurantService.updateProductRestaurant(
        id,
        productData
      );

      await fetchProducts(currentFilters);
      return { success: true, data: data.product, message: data.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<ApiResponse<null>> => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsRestaurantService.deleteProductRestaurant(id);

      await fetchProducts(currentFilters);
      return { success: true, data: null, message: data.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (
    id: number
  ): Promise<ApiResponse<ProductRestaurant>> => {
    setLoading(true);
    setError(null);

    try {
      const data =
        await productsRestaurantService.toggleProductRestaurantStatus(id);

      await fetchProducts(currentFilters);
      return { success: true, data: data.product, message: data.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (
    id: number
  ): Promise<ApiResponse<ProductRestaurant>> => {
    setLoading(true);
    setError(null);

    try {
      const data: ProductRestaurant =
        await productsRestaurantService.getProductRestaurant(id);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getProduct,
  };
};

export default useProductsRestaurant;
