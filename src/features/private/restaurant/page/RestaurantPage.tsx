import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRestaurants from "../hook/UseRestaurants";
import type {
  CreateRestaurantData,
  Restaurant,
  RestaurantFilters,
} from "../types/restaurant.types";
import RestaurantForm from "./components/RestaurantForm";
import { SearchAndFilters } from "./components/common/Filters";
import { RestaurantTable } from "./components/list/RestaurantTable";
import { toast } from "sonner";

const RestaurantPage: React.FC = () => {
  const {
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
  } = useRestaurants();

  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [filters, setFilters] = useState<RestaurantFilters>({
    search: "",
    is_active: undefined,
    city_id: undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    per_page: 3,
  });

  useEffect(() => {
    fetchRestaurants(filters);
  }, [fetchRestaurants, filters]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<RestaurantFilters>) => {
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

  const handleCreateRestaurant = useCallback(() => {
    setSelectedRestaurant(null);
    setShowForm(true);
  }, []);

  const handleEditRestaurant = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowForm(true);
  }, []);

  const handleDeleteRestaurant = useCallback(
    async (restaurant: Restaurant) => {
      const result = await deleteRestaurant(restaurant.id);
      if (result.success) {
        toast.success(result.message || "Restaurante eliminado correctamente");
      } else {
        toast.error(result.error || "Error al eliminar el restaurante");
      }
    },
    [deleteRestaurant]
  );

  const handleToggleStatus = useCallback(
    async (restaurant: Restaurant) => {
      const result = await toggleRestaurantStatus(restaurant.id);
      if (result.success) {
        toast.success(result.message || "Estado actualizado correctamente");
      } else {
        toast.error(result.error || "Error al actualizar el estado");
      }
    },
    [toggleRestaurantStatus]
  );

  const handleFormSubmit = useCallback(
    async (formData: CreateRestaurantData) => {
      try {
        const result = selectedRestaurant
          ? await updateRestaurant(selectedRestaurant.id, formData)
          : await createRestaurant(formData);

        if (result.success) {
          setShowForm(false);
          setSelectedRestaurant(null);
          toast.success(result.message || "Operación exitosa");
        } else {
          toast.error(result.error || "Error en la operación");
        }
      } catch (err) {
        toast.error("Error inesperado");
        console.error(err);
      }
    },
    [selectedRestaurant, updateRestaurant, createRestaurant]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setSelectedRestaurant(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Restaurantes</h1>
          <Button 
            onClick={handleCreateRestaurant} 
            className="flex items-center gap-2 bg-red-800/80 hover:bg-red-800 text-white"
          >
            <Plus className="h-4 w-4" />
            Nuevo Restaurante
          </Button>
        </div>

        <div className="mb-6">
          <SearchAndFilters
            filters={filters}
            cities={cities}
            onFiltersChange={handleFiltersChange}
            handleClearFIlters={handleClearFIlters}
            canOrderBy={true}
          />
        </div>

        <RestaurantTable
          restaurants={restaurants}
          loading={loading}
          error={error}
          pagination={pagination}
          onEdit={handleEditRestaurant}
          onDelete={handleDeleteRestaurant}
          onToggleStatus={handleToggleStatus}
          onPageChange={handlePageChange}
        />

        {showForm && (
          <RestaurantForm
            restaurant={selectedRestaurant}
            cities={cities}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
