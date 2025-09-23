import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import useRestaurants from "../hook/UseRestaurants";
import type {
  CreateRestaurantData,
  Restaurant,
  RestaurantFilters,
} from "../types/restaurant.types";
import RestaurantForm from "./components/RestaurantForm";
import { useNotification } from "../hook/UseNotification";
import { Notification } from "./components/list/Notification";
import { SearchAndFilters } from "./components/list/Filters";
import { RestaurantTable } from "./components/list/RestaurantTable";

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

  const { notification, showNotification, hideNotification } =
    useNotification();

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
    per_page: 15,
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
      if (
        !window.confirm(
          `¿Estás seguro de que quieres eliminar el restaurante "${restaurant.name}"?`
        )
      ) {
        return;
      }

      const result = await deleteRestaurant(restaurant.id);
      showNotification(
        result.success ? "success" : "error",
        result.success
          ? result.message || "Restaurante eliminado correctamente"
          : result.error || "Error al eliminar el restaurante"
      );
    },
    [deleteRestaurant, showNotification]
  );

  const handleToggleStatus = useCallback(
    async (restaurant: Restaurant) => {
      const result = await toggleRestaurantStatus(restaurant.id);
      showNotification(
        result.success ? "success" : "error",
        result.success
          ? result.message || "Estado actualizado correctamente"
          : result.error || "Error al actualizar el estado"
      );
    },
    [toggleRestaurantStatus, showNotification]
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
          showNotification("success", result.message || "Operación exitosa");
        } else {
          showNotification("error", result.error || "Error en la operación");
        }
      } catch (err) {
        showNotification("error", "Error inesperado");
        console.error(err);
      }
    },
    [selectedRestaurant, updateRestaurant, createRestaurant, showNotification]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setSelectedRestaurant(null);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Restaurantes
        </h1>
        <p className="mt-2 text-gray-600">
          Administra los restaurantes de la plataforma
        </p>
      </header>

      <Notification notification={notification} onClose={hideNotification} />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchAndFilters
          filters={filters}
          cities={cities}
          onFiltersChange={handleFiltersChange}
        />

        <button
          onClick={handleCreateRestaurant}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Restaurante
        </button>
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
  );
};

export default RestaurantPage;
