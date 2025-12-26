import { useCallback, useMemo } from "react";
import type {
  ProductRestaurantFormData,
  ValidationErrors,
} from "../types/products-restaurant.types";

export const useFormValidation = () => {
  const validationRules = useMemo(
    () => ({
      name: (value: string) => {
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3)
          return "El nombre debe tener al menos 3 caracteres";
        if (value.trim().length > 150)
          return "El nombre no puede exceder 150 caracteres";
        return null;
      },
      description: (value: string) => {
        if (!value.trim()) return "La descripción es obligatoria";
        if (value.trim().length < 10)
          return "La descripción debe tener al menos 10 caracteres";
        return null;
      },
      restaurant_id: (value: string) => {
        if (!value || value === "") return "El restaurante es obligatorio";
        return null;
      },
    }),
    []
  );

  const validateField = useCallback(
    (name: keyof ProductRestaurantFormData, value: string | boolean | number) => {
      const rule = validationRules[name as keyof typeof validationRules];
      if (rule && typeof value === "string") {
        return rule(value);
      }
      return null;
    },
    [validationRules]
  );

  const validateForm = useCallback(
    (formData: ProductRestaurantFormData) => {
      const errors: ValidationErrors = {};

      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key as keyof ProductRestaurantFormData, value);
        if (error) {
          errors[key as keyof ValidationErrors] = error;
        }
      });

      return errors;
    },
    [validateField]
  );

  return { validateField, validateForm };
};
