import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import useProductsRestaurant from "../hook/UseProductsRestaurant";
import type {
  CreateProductRestaurantData,
  ProductRestaurant,
  ProductRestaurantFilters,
} from "../types/products-restaurant.types";
import ProductsRestaurantForm from "./components/ProductsRestaurantForm";
import { SearchAndFilters } from "./components/common/Filters";
import { ProductsRestaurantTable } from "./components/list/ProductsRestaurantTable";
import useRestaurants from "../../restaurant/hook/UseRestaurants";
import { toast } from "sonner";

const ProductsRestaurantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  } = useProductsRestaurant();

  const { restaurants, fetchRestaurants } = useRestaurants();

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductRestaurant | null>(null);

  // Leer restaurant_id de los parámetros de la URL
  const restaurantIdParam = searchParams.get('restaurant_id');
  const [filters, setFilters] = useState<ProductRestaurantFilters>({
    search: "",
    is_active: undefined,
    restaurant_id: restaurantIdParam ? parseInt(restaurantIdParam) : undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    fetchRestaurants({ page: 1, per_page: 500 });
  }, [fetchRestaurants]);

  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductRestaurantFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    []
  );

  const handleClearFIlters = useCallback(() => {
    // Limpiar los parámetros de la URL
    navigate('/home/products-restaurant', { replace: true });

    // Resetear los filtros
    setFilters({
      search: "",
      is_active: undefined,
      restaurant_id: undefined,
      sort_by: "created_at",
      sort_order: "desc",
      page: 1,
      per_page: 10,
    });
  }, [navigate]);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateProduct = useCallback(() => {
    setSelectedProduct(null);
    setShowForm(true);
  }, []);

  const handleEditProduct = useCallback((product: ProductRestaurant) => {
    const dataProduct = { ...product };
    dataProduct.image_url = import.meta.env.VITE_URL_BACK + "imageproduct/" + product?.image_url;
    setSelectedProduct(dataProduct);
    setShowForm(true);
  }, []);

  const handleDeleteProduct = useCallback(
    async (product: ProductRestaurant) => {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.message || "Producto eliminado correctamente");
      } else {
        toast.error(result.error || "Error al eliminar el producto");
      }
    },
    [deleteProduct]
  );

  const handleToggleStatus = useCallback(
    async (product: ProductRestaurant) => {
      const result = await toggleProductStatus(product.id);
      if (result.success) {
        toast.success(result.message || "Estado actualizado correctamente");
      } else {
        toast.error(result.error || "Error al actualizar el estado");
      }
    },
    [toggleProductStatus]
  );

  const handleFormSubmit = useCallback(
    async (formData: CreateProductRestaurantData) => {
      try {
        const result = selectedProduct
          ? await updateProduct(selectedProduct.id, formData)
          : await createProduct(formData);

        if (result.success) {
          setShowForm(false);
          setSelectedProduct(null);
          toast.success(result.message || "Operación exitosa");
        } else {
          toast.error(result.error || "Error en la operación");
        }
      } catch (err) {
        toast.error("Error inesperado");
        console.error(err);
      }
    },
    [selectedProduct, updateProduct, createProduct]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setSelectedProduct(null);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Productos
          </h1>

          {/* Indicador de filtro por restaurante */}
          {filters.restaurant_id && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <p className="text-sm text-blue-800">
                📍 Mostrando productos de: <strong>
                  {restaurants.find(r => r.id === filters.restaurant_id)?.name || `Restaurante ID: ${filters.restaurant_id}`}
                </strong>
              </p>
              <button
                onClick={handleClearFIlters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={handleCreateProduct}
          className="flex items-center gap-2 bg-red-800/80 hover:bg-red-800 text-white"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="mb-6">
        <SearchAndFilters
          filters={filters}
          restaurants={restaurants}
          onFiltersChange={handleFiltersChange}
          handleClearFIlters={handleClearFIlters}
          canOrderBy={true}
          confirmSearchProducts={() => {
            fetchProducts(filters)
          }}
        />
      </div>

      <ProductsRestaurantTable
        products={products}
        loading={loading}
        error={error}
        pagination={pagination}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <ProductsRestaurantForm
          product={selectedProduct}
          restaurants={restaurants}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
          preselectedRestaurantId={filters.restaurant_id}
        />
      )}
    </div>
  );
};

export default ProductsRestaurantPage;
