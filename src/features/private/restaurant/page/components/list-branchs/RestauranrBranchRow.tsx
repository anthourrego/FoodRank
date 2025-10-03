import React from "react";
import { Edit2, Trash2, MapPin, Phone } from "lucide-react";
import type { RestaurantBranch } from "../../../types/restaurant-branch.types";

interface RestaurantBranchRowProps {
  branch: RestaurantBranch;
  onEdit: (branch: RestaurantBranch) => void;
  onDelete: (branch: RestaurantBranch) => void;
  onToggleStatus: (branch: RestaurantBranch) => void;
}

export const RestaurantBranchRow: React.FC<RestaurantBranchRowProps> = ({
  branch,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {branch.restaurant?.name || "N/A"}
            </div>
            {branch.restaurant?.phone && (
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Phone size={12} className="mr-1" />
                {branch.restaurant.phone}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 flex items-start">
          <MapPin size={14} className="mr-1 mt-1 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">{branch.address}</span>
        </div>
        {(branch.latitude && branch.longitude) && (
          <div className="text-xs text-gray-500 mt-1 ml-5">
            {branch.latitude}, {branch.longitude}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center">
          <Phone size={14} className="mr-1 text-gray-400" />
          {branch.phone}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {branch.city?.name || "N/A"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(branch)}
          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            branch.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {branch.is_active ? "Activa" : "Inactiva"}
        </button>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(branch)}
            className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 hover:bg-blue-50 rounded"
            title="Editar sucursal"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(branch)}
            className="text-red-600 hover:text-red-900 transition-colors p-1.5 hover:bg-red-50 rounded"
            title="Eliminar sucursal"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};