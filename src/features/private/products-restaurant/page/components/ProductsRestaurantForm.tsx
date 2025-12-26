import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Save, Loader2, Upload, X, Info, Image as ImageIcon } from "lucide-react";
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
      image: null,
      restaurant_id: product?.restaurant_id?.toString() || preselectedRestaurantId?.toString() || "",
    }),
    [product, preselectedRestaurantId]
  );

  const [formData, setFormData] = useState<ProductRestaurantFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            image: 'El archivo debe ser una imagen (JPEG, JPG, PNG o WEBP)',
          }));
          return;
        }

        const maxSize = 5120 * 1024;
        if (file.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            image: 'La imagen no debe superar los 5MB',
          }));
          return;
        }

        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: undefined }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

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
          restaurant_id: parseInt(formData.restaurant_id + "", 10),
        };

        if (formData.image) {
          submitData.image = formData.image;
        }

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

          {/* Campo de imagen */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Imagen del producto
              </label>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Info size={16} />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 top-6 z-50 w-64 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                    <div className="font-semibold mb-1">Requisitos de la imagen:</div>
                    <ul className="space-y-0.5">
                      <li>• Formatos: JPEG, JPG, PNG, WEBP</li>
                      <li>• Tamaño máximo: 5MB</li>
                    </ul>
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>

            {!imagePreview ? (
              <div>
                <input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-600 font-medium">
                      Click para seleccionar imagen
                    </p>
                    <p className="text-xs text-gray-500">o arrastra y suelta aquí</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center gap-2 shadow-lg"
                    >
                      <ImageIcon size={16} />
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2 shadow-lg"
                    >
                      <X size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}

            {getFieldError("image") && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X size={14} />
                {getFieldError("image")}
              </p>
            )}
          </div>

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
