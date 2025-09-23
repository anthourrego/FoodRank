import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  type Restaurant,
  type City,
  type RestaurantFormData,
  type ValidationErrors,
  type CreateRestaurantData,
} from "../../types/restaurant.types";
import { Modal } from "@/components/ui/modal";
import { SelectField } from "./form/SelectField";
import { useFormValidation } from "../../hook/UseFormRestaurant";
import { FormField } from "./form/FormField";

interface RestaurantFormProps {
  restaurant?: Restaurant | null;
  cities: City[];
  onSubmit: (data: CreateRestaurantData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  restaurant = null,
  cities = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { validateField, validateForm } = useFormValidation();

  const initialFormData: RestaurantFormData = useMemo(
    () => ({
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      address: restaurant?.address || "",
      email: restaurant?.email || "",
      phone: restaurant?.phone || "",
      website: restaurant?.website || "",
      instagram: restaurant?.instagram || "",
      facebook: restaurant?.facebook || "",
      is_active: restaurant?.is_active ?? true,
      city_id: restaurant?.city_id?.toString() || "",
    }),
    [restaurant]
  );

  const [formData, setFormData] = useState<RestaurantFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  }, [initialFormData]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === "checkbox";
      const newValue = isCheckbox
        ? (e.target as HTMLInputElement).checked
        : value;

      setFormData((prev) => ({ ...prev, [name]: newValue }));

      if (touched[name]) {
        const error = validateField(name as keyof RestaurantFormData, newValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error || undefined,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name as keyof RestaurantFormData, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const allTouched = Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      const formErrors = validateForm(formData);
      setErrors(formErrors);

      if (
        Object.keys(formErrors).length === 0 &&
        formData.name.trim() &&
        formData.city_id
      ) {
        const submitData: CreateRestaurantData = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          address: formData.address.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          website: formData.website.trim() || undefined,
          instagram: formData.instagram.trim() || undefined,
          facebook: formData.facebook.trim() || undefined,
          is_active: formData.is_active,
          city_id: parseInt(formData.city_id + "", 10),
        };

        await onSubmit(submitData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return touched[fieldName] ? errors[fieldName] : undefined;
    },
    [touched, errors]
  );

  const isFormValid = useMemo(() => {
    return (
      Object.keys(errors).filter(key => errors[key]).length === 0 &&
      formData.name.trim() &&
      formData.city_id
    );
  }, [errors, formData.name, formData.city_id]);

  const formFields = useMemo(
    () => [
      {
        id: "name",
        name: "name",
        label: "Nombre",
        value: formData.name,
        placeholder: "Nombre del restaurante",
        required: true,
      },
      {
        id: "description",
        name: "description",
        label: "Descripción",
        value: formData.description,
        placeholder: "Descripción del restaurante",
        as: "textarea" as const,
        rows: 3,
      },
      {
        id: "address",
        name: "address",
        label: "Dirección",
        value: formData.address,
        placeholder: "Dirección del restaurante",
      },
      {
        id: "email",
        name: "email",
        label: "Email",
        type: "email",
        value: formData.email,
        placeholder: "correo@restaurante.com",
      },
      {
        id: "phone",
        name: "phone",
        label: "Teléfono",
        type: "tel",
        value: formData.phone,
        placeholder: "+57 300 123 4567",
      },
      {
        id: "website",
        name: "website",
        label: "Sitio Web",
        type: "url",
        value: formData.website,
        placeholder: "https://www.restaurante.com",
      },
      {
        id: "instagram",
        name: "instagram",
        label: "Instagram",
        type: "url",
        value: formData.instagram,
        placeholder: "https://www.instagram.com/restaurante",
      },
      {
        id: "facebook",
        name: "facebook",
        label: "Facebook",
        type: "url",
        value: formData.facebook,
        placeholder: "https://www.facebook.com/restaurante",
      },
    ],
    [formData]
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={restaurant ? "Editar Restaurante" : "Nuevo Restaurante"}
    >
      <div className="flex flex-col h-full">
        <form className="flex-1 px-1 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <FormField
            {...formFields[0]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("name")}
          />

          <FormField
            {...formFields[1]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("description")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              {...formFields[2]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("address")}
            />

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
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              {...formFields[3]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("email")}
            />

            <FormField
              {...formFields[4]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("phone")}
            />
          </div>

          <FormField
            {...formFields[5]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("website")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
            <FormField
              {...formFields[6]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("instagram")}
            />

            <FormField
              {...formFields[7]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError("facebook")}
            />
          </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            {loading || isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {restaurant ? "Actualizar" : "Crear"} Restaurante
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantForm;
