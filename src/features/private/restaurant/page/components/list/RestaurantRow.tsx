import React from 'react';
import { MapPin, Mail, Phone, Globe, Instagram, Facebook, Edit, Trash2, Store, Package, ListTree } from 'lucide-react';
import type { Restaurant } from '../../../types/restaurant.types';
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RestaurantRowProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  onToggleStatus: (restaurant: Restaurant) => void;
}

export const RestaurantRow: React.FC<RestaurantRowProps> = ({
  restaurant,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
   const navigate = useNavigate();
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {restaurant.name}
          </div>
          {restaurant.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {restaurant.description}
            </div>
          )}
          {restaurant.address && (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              {restaurant.address}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          {restaurant.email && (
            <div className="text-sm text-gray-500 flex items-center">
              <Mail size={14} className="mr-1" />
              {restaurant.email}
            </div>
          )}
          {restaurant.phone && (
            <div className="text-sm text-gray-500 flex items-center">
              <Phone size={14} className="mr-1" />
              {restaurant.phone}
            </div>
          )}
          <div className="flex space-x-2">
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Globe size={16} />
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={restaurant.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
            {restaurant.facebook && (
              <a
                href={restaurant.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {restaurant.city?.name}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(restaurant)}
          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            restaurant.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {restaurant.is_active ? "Activa" : "Inactiva"}
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
              <DropdownMenuItem onClick={() => onEdit(restaurant)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(restaurant)} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/home/restaurants/${restaurant.id}/branchs`)} className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Sucursales
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/home/products-restaurant?restaurant_id=${restaurant.id}`)} className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};