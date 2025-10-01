import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import type { RestaurantFilters, City } from "../../../types/restaurant.types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface SearchAndFiltersProps {
  filters: RestaurantFilters;
  cities: City[];
  onFiltersChange: (filters: Partial<RestaurantFilters>) => void;
  handleClearFIlters: () => void;
  canOrderBy: boolean;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  cities,
  onFiltersChange,
  handleClearFIlters,
  canOrderBy = true,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleFilterChange = (key: keyof RestaurantFilters, value: unknown) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <div className="flex-1">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar restaurantes..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
            showFilters
              ? "bg-blue-50 text-blue-700 border-blue-300"
              : "text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <Filter size={20} className="mr-2" />
          Filtros
        </button>
      </div>

      {showFilters && (
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(!showFilters)}
          title="Filtros"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={
                filters.is_active === undefined
                  ? ""
                  : filters.is_active
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                handleFilterChange(
                  "is_active",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <select
              value={filters.city_id || ""}
              onChange={(e) =>
                handleFilterChange(
                  "city_id",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {canOrderBy && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at">Fecha de creación</option>
                <option value="name">Nombre</option>
                <option value="updated_at">Última actualización</option>
              </select>
            </div>
          )}

          <div className="flex justify-end mt-3 gap-3">
            <Button
              onClick={() => {
                handleClearFIlters();
                setShowFilters(!showFilters);
              }}
            >
              Limpiar
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-red-800/80"
            >
              Aceptar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
