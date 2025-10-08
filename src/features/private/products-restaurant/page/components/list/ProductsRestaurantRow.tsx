import React from 'react';
import { Edit, Power, Trash2, Image } from 'lucide-react';
import type { ProductRestaurant } from '../../../types/products-restaurant.types';

interface ProductsRestaurantRowProps {
  product: ProductRestaurant;
  onEdit: (product: ProductRestaurant) => void;
  onDelete: (product: ProductRestaurant) => void;
  onToggleStatus: (product: ProductRestaurant) => void;
}

export const ProductsRestaurantRow: React.FC<ProductsRestaurantRowProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
              <Image size={20} className="text-gray-400" />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            {product.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {product.description}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {product.restaurant?.name || 'N/A'}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            product.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleStatus(product)}
            className={`transition-colors cursor-pointer ${
              product.is_active
                ? "text-red-600 hover:text-red-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={product.is_active ? "Desactivar" : "Activar"}
          >
            <Power size={16} />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};
