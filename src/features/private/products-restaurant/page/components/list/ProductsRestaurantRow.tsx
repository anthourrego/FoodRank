import React from 'react';
import { Edit, Trash2, Image, ListTree } from 'lucide-react';
import type { ProductRestaurant } from '../../../types/products-restaurant.types';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
        <button
          onClick={() => onToggleStatus(product)}
          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            product.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {product.is_active ? "Activa" : "Inactiva"}
        </button>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <ListTree className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(product)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product)} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};
