import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
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
  const [filters, setFilters] = useState<ProductRestaurantFilters>({
    search: "",
    is_active: undefined,
    restaurant_id: undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    per_page: 5,
  });

  useEffect(() => {
    fetchRestaurants({ page: 1, per_page: 500 });
  }, [fetchRestaurants]);

  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductRestaurantFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    []
  );

  const handleClearFIlters = useCallback(() => {
    setFilters({});
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateProduct = useCallback(() => {
    setSelectedProduct(null);
    setShowForm(true);
  }, []);

  const handleEditProduct = useCallback((product: ProductRestaurant) => {
    setSelectedProduct(product);
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
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Productos
        </h1>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchAndFilters
          filters={filters}
          restaurants={restaurants}
          onFiltersChange={handleFiltersChange}
          handleClearFIlters={handleClearFIlters}
          canOrderBy={true}
        />

        <button
          onClick={handleCreateProduct}
          className="flex items-center px-4 py-2 text-white bg-red-800/80 rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </button>
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
        />
      )}
    </div>
  );
};

export default ProductsRestaurantPage;
