import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  type ProductRestaurant,
  type Restaurant,
  type ProductRestaurantFormData,
  type ValidationErrors,
  type CreateProductRestaurantData,
} from "../../types/products-restaurant.types";
import { Modal } from "@/components/ui/modal";
import { SelectField } from "./form/SelectField";
import { useFormValidation } from "../../hook/UseFormProductsRestaurant";
import { FormField } from "./form/FormField";

interface ProductsRestaurantFormProps {
  product?: ProductRestaurant | null;
  restaurants: Restaurant[];
  onSubmit: (data: CreateProductRestaurantData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  preselectedRestaurantId?: number;
}

const ProductsRestaurantForm: React.FC<ProductsRestaurantFormProps> = ({
  product = null,
  restaurants = [],
  onSubmit,
  onCancel,
  loading = false,
  preselectedRestaurantId,
}) => {
  const { validateField, validateForm } = useFormValidation();

  const initialFormData: ProductRestaurantFormData = useMemo(
    () => ({
      name: product?.name || "",
      description: product?.description || "",
      image_url: product?.image_url || "",
      restaurant_id: product?.restaurant_id?.toString() || preselectedRestaurantId?.toString() || "",
    }),
    [product, preselectedRestaurantId]
  );

  const [formData, setFormData] = useState<ProductRestaurantFormData>(initialFormData);
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
        const error = validateField(name as keyof ProductRestaurantFormData, newValue);
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

      const error = validateField(name as keyof ProductRestaurantFormData, value);
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
        formData.description.trim() &&
        formData.restaurant_id
      ) {
        const submitData: CreateProductRestaurantData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          image_url: formData.image_url.trim() || undefined,
          restaurant_id: parseInt(formData.restaurant_id + "", 10),
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
      formData.description.trim() &&
      formData.restaurant_id
    );
  }, [errors, formData.name, formData.description, formData.restaurant_id]);

  const formFields = useMemo(
    () => [
      {
        id: "name",
        name: "name",
        label: "Nombre",
        value: formData.name,
        placeholder: "Nombre del producto",
        required: true,
      },
      {
        id: "description",
        name: "description",
        label: "Descripción",
        value: formData.description,
        placeholder: "Descripción del producto",
        as: "textarea" as const,
        rows: 3,
        required: true,
      },
      {
        id: "image_url",
        name: "image_url",
        label: "URL de la imagen",
        type: "url",
        value: formData.image_url,
        placeholder: "https://ejemplo.com/imagen.jpg",
      },
    ],
    [formData]
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={product ? "Editar Producto" : "Nuevo Producto"}
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

          <FormField
            {...formFields[2]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError("image_url")}
          />

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
            disabled={!!preselectedRestaurantId}
          />
          
          {/* Mensaje explicativo cuando el restaurante está preseleccionado */}
          {preselectedRestaurantId && (
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              🔒 {product ? 'Restaurante bloqueado por filtro activo' : 'Restaurante preseleccionado desde la vista de restaurantes'}
            </p>
          )}
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
                {product ? "Actualizar" : "Crear"} Producto
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductsRestaurantForm;
