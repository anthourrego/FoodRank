import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import type { RestaurantBranch } from "../../../types/restaurant-branch.types";
import { RestaurantBranchRow } from "./RestauranrBranchRow";
import { Pagination } from "../common/Pagination";

interface RestaurantBranchTableProps {
  branches: RestaurantBranch[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  onEdit: (branch: RestaurantBranch) => void;
  onDelete: (branch: RestaurantBranch) => void;
  onToggleStatus: (branch: RestaurantBranch) => void;
  onPageChange: (page: number) => void;
}

export const RestaurantBranchTable: React.FC<RestaurantBranchTableProps> = ({
  branches,
  loading,
  error,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange,
}) => {
  const [currentBranch, setCurrentBranch] = useState<RestaurantBranch>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  useEffect(() => {
    if (currentBranch) {
      setOpenModalDelete(true);
    }
  }, [currentBranch]);

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
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
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
            {branches.map((branch) => (
              <RestaurantBranchRow
                key={branch.id}
                branch={branch}
                onEdit={onEdit}
                onDelete={(branchItem) => setCurrentBranch(branchItem)}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      {branches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron sucursales
          </p>
        </div>
      )}

      {branches.length > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}

      <Modal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(!openModalDelete)}
        title="Eliminar Sucursal"
      >
        <div>
          <p>{`¿Estás seguro de que quieres eliminar la sucursal ubicada en "${currentBranch?.address}"?`}</p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end mt-4 gap-3">
            <Button onClick={() => setOpenModalDelete(!openModalDelete)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (currentBranch) {
                  onDelete(currentBranch);
                  setOpenModalDelete(false);
                }
              }}
              className="bg-red-800/80"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};