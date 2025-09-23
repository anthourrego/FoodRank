import React from "react";
import { AlertCircle } from "lucide-react";
import type { Restaurant } from "../../../types/restaurant.types";
import { RestaurantRow } from "./RestaurantRow";
import { Pagination } from "./Pagination";
import { LoadingSpinner } from "./LoadingSpinner";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  onToggleStatus: (restaurant: Restaurant) => void;
  onPageChange: (page: number) => void;
}

export const RestaurantTable: React.FC<RestaurantTableProps> = ({
  restaurants,
  loading,
  error,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange,
}) => {
  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
        <div className="flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ciudad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <RestaurantRow
                key={restaurant.id}
                restaurant={restaurant}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron restaurantes
          </p>
        </div>
      )}

      {restaurants.length > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};
