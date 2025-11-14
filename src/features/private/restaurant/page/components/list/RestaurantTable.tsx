import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { Restaurant } from "../../../types/restaurant.types";
import { RestaurantRow } from "./RestaurantRow";
import { Pagination } from "../common/Pagination";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

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
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  useEffect(() => {
    if (currentRestaurant) {
      setOpenModalDelete(true);
    }
  }, [currentRestaurant]);

  if (loading) return <Loading className="flex justify-center" classNameLoader="w-8 h-8" />;

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
    <div className="bg-white shadow rounded-lg border border-gray-300 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-400">
                Restaurante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-400">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-400">
                Ciudad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-400">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-400">
            {restaurants.map((restaurant) => (
              <RestaurantRow
                key={restaurant.id}
                restaurant={restaurant}
                onEdit={onEdit}
                onDelete={(restaurante) => setCurrentRestaurant(restaurante)}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>

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

      <Modal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(!openModalDelete)}
        title="Acción"
      >
        <div>
          <p>{`¿Estás seguro de que quieres eliminar el restaurante "${currentRestaurant?.name}"?`}</p>

          <div className="flex justify-end mt-3 gap-3">
            <Button variant={'secondary'} onClick={() => setOpenModalDelete(!openModalDelete)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (currentRestaurant) {
                  onDelete(currentRestaurant);
                  setOpenModalDelete(false)
                }
              }}
              className="bg-red-800/80"
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
