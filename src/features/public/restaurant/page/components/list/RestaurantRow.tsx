import React from 'react';
import { MapPin, Mail, Phone, Globe, Instagram, Facebook, Edit, Power, Trash2 } from 'lucide-react';
import type { Restaurant } from '../../../types/restaurant.types';

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
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            restaurant.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {restaurant.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleStatus(restaurant)}
            className={`transition-colors ${
              restaurant.is_active
                ? "text-red-600 hover:text-red-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={restaurant.is_active ? "Desactivar" : "Activar"}
          >
            <Power size={16} />
          </button>
          <button
            onClick={() => onEdit(restaurant)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(restaurant)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};