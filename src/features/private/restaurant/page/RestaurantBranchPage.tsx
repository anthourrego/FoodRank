import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, Plus } from "lucide-react";
import type {
  RequestRestaurantBranch,
  RestaurantBranch,
} from "../types/restaurant-branch.types";
import restaurantBranchService from "../services/RestaurantBranchService";
import {
  RestaurantBranchForm,
  type RestaurantBranchFormData,
} from "./components/RestaurantBranchForm";
import { RestaurantBranchTable } from "./components/list-branchs/BranchsTable";
import { SearchAndFilters } from "./components/common/Filters";
import type { RestaurantFilters } from "../types/restaurant.types";
import useRestaurants from "../hook/UseRestaurants";
import { useParams } from "react-router";

const RestaurantBranchesPage: React.FC = () => {
  const { restaurantId } = useParams();

  const { restaurants, cities, fetchRestaurants } = useRestaurants();

  const [branches, setBranches] = useState<RestaurantBranch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<RestaurantBranch | null>(
    null
  );

  const currentRestaurant = restaurants.find(
    (restaurant) => restaurant.id == +(restaurantId || 0)
  );

  const [filters, setFilters] = useState<RequestRestaurantBranch>({
    search: "",
    is_active: undefined,
    city_id: undefined,
    page: 1,
    per_page: 3,
    restaurant_id: restaurantId ? +restaurantId : 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 10,
    total: 0,
  });

  useEffect(() => {
    fetchRestaurants({ page: 1, per_page: 500 });
  }, [fetchRestaurants]);

  useEffect(() => {
    loadBranches();
  }, [filters]);

  const loadBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await restaurantBranchService.getAll(filters);
      setBranches(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        from: response.from,
        to: response.to,
        total: response.total,
      });
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: RestaurantBranchFormData) => {
    try {
      if (selectedBranch) {
        await restaurantBranchService.update(selectedBranch.id, data);
      } else {
        await restaurantBranchService.create(data);
      }
      setShowForm(false);
      setSelectedBranch(null);
      loadBranches();
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handleEdit = (branch: RestaurantBranch) => {
    setSelectedBranch(branch);
    setShowForm(true);
  };

  const handleDelete = async (branch: RestaurantBranch) => {
    try {
      await restaurantBranchService.delete(branch.id);
      loadBranches();
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handleToggleStatus = async (branch: RestaurantBranch) => {
    try {
      await restaurantBranchService.toggleStatus(branch.id);
      loadBranches();
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page: page });
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleNewBranch = () => {
    setSelectedBranch(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedBranch(null);
  };

  const handleFiltersChange = useCallback(
    (newFilters: Partial<RestaurantFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    },
    []
  );

  const handleClearFIlters = useCallback(() => {
    setFilters({
      restaurant_id: restaurantId ? +restaurantId : 0,
      per_page: 3,
      page: 1
    });
  }, []);

  if (!restaurantId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className={`mb-6 p-4 rounded-md flex items-center animate-fade-in bg-red-50 text-red-800 border border-red-200`}
        >
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span className="flex-1">
            No se encontro restaurante seleccionado
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sucursales de {currentRestaurant?.name}
        </h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchAndFilters
          filters={filters}
          cities={cities}
          onFiltersChange={handleFiltersChange}
          handleClearFIlters={handleClearFIlters}
          canOrderBy={false}
        />

        <button
          onClick={handleNewBranch}
          className="flex items-center px-4 py-2 text-white bg-red-800/80 rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Sucursal
        </button>
      </div>

      <RestaurantBranchTable
        branches={branches}
        loading={loading}
        error={error}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <RestaurantBranchForm
          branch={selectedBranch}
          restaurants={restaurants}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          restaurantId={+restaurantId}
        />
      )}
    </div>
  );
};

export default RestaurantBranchesPage;
