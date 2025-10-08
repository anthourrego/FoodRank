import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { FormField } from "./form/FormField";
import { SelectField } from "./form/SelectField";
import type { RestaurantBranch } from "../../types/restaurant-branch.types";
import MapPicker from "./form/MapPcikers";

interface RestaurantBranchFormProps {
  branch?: RestaurantBranch | null;
  restaurants: Array<{ id: number; name: string }>;
  cities: Array<{ id: number; name: string }>;
  onSubmit: (data: RestaurantBranchFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  restaurantId: number;
}

export interface RestaurantBranchFormData {
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  city_id: number;
  restaurant_id: number;
}

const initialFormData: RestaurantBranchFormData = {
  address: "",
  phone: "",
  latitude: 0,
  longitude: 0,
  city_id: 0,
  restaurant_id: 0,
};

export const RestaurantBranchForm: React.FC<RestaurantBranchFormProps> = ({
  branch,
  restaurants,
  cities,
  onSubmit,
  onCancel,
  loading = false,
  restaurantId,
}) => {
  const [formData, setFormData] = useState<RestaurantBranchFormData>({
    ...initialFormData,
    restaurant_id: restaurantId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (branch) {
      setFormData({
        address: branch.address || "",
        phone: branch.phone || "",
        latitude: branch.latitude || 0,
        longitude: branch.longitude || 0,
        city_id: branch.city_id || 0,
        restaurant_id: branch.restaurant_id || 0,
      });
    }
  }, [branch]);

  const validateField = (name: string, value: number | string): string => {
    switch (name) {
      case "address":
        if (typeof value === "string" && (!value || value.trim() === ""))
          return "La dirección es requerida";
        if (typeof value === "string" && value.length < 5)
          return "La dirección debe tener al menos 5 caracteres";
        break;
      case "phone":
        if (typeof value === "string" && (!value || value.trim() === ""))
          return "El teléfono es requerido";
        if (typeof value === "string" && !/^[0-9+\-\s()]+$/.test(value))
          return "Formato de teléfono inválido";
        break;
      case "city_id":
        if (!value || value === 0) return "La ciudad es requerida";
        break;
      case "restaurant_id":
        if (!value || value === 0) return "El restaurante es requerido";
        break;
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || name.includes("_id") ? Number(value) : value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key,
        formData[key as keyof RestaurantBranchFormData]
      );
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      address: true,
      phone: true,
      city_id: true,
      restaurant_id: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.address.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.city_id > 0 &&
    formData.restaurant_id > 0 &&
    Object.values(errors).every((error) => !error);

  const formFields = [
    {
      id: "address",
      name: "address",
      label: "Dirección",
      type: "text",
      value: formData.address,
      required: true,
      placeholder: "Ingrese la dirección de la sucursal",
    },
    {
      id: "phone",
      name: "phone",
      label: "Teléfono",
      type: "text",
      value: formData.phone,
      required: true,
      placeholder: "+57 300 123 4567",
    },
  ];

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={branch ? "Editar Sucursal" : "Nueva Sucursal"}
    >
      <div className="flex flex-col h-full">
        <form className="flex-1 px-1 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <SelectField
            id="restaurant_id"
            name="restaurant_id"
            label="Restaurante"
            value={formData.restaurant_id + ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("restaurant_id")}
            options={restaurants}
            placeholder="Seleccionar restaurante"
            required
            disabled={true}
          />

          <FormField
            {...formFields[0]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("address")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="city_id"
              name="city_id"
              label="Ciudad"
              value={formData.city_id + ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("city_id")}
              options={cities}
              placeholder="Seleccionar ciudad"
              required
            />

            <FormField
              {...formFields[1]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("phone")}
            />
          </div>

          <MapPicker onLocationSelect={handleLocationSelect} height="300px" />
        </form>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading || isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || isSubmitting || !isFormValid}
            className="px-4 py-2 text-sm font-medium text-white bg-red-800/80 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            {loading || isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {branch ? "Actualizar" : "Crear"} Sucursal
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
