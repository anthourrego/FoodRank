import { useCallback, useMemo } from "react";
import type {
  RestaurantFormData,
  ValidationErrors,
} from "../types/restaurant.types";

export const useFormValidation = () => {
  const validationRules = useMemo(
    () => ({
      name: (value: string) => {
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3)
          return "El nombre debe tener al menos 3 caracteres";
        return null;
      },
      email: (value: string) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "El formato del email no es válido";
        }
        return null;
      },
      phone: (value: string) => {
        if (value && !/^[\d\s+\-()]+$/.test(value)) {
          return "El formato del teléfono no es válido";
        }
        return null;
      },
      website: (value: string) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return "La URL debe comenzar con http:// o https://";
        }
        return null;
      },
      instagram: (value: string) => {
        if (
          value &&
          !/^https?:\/\/(www\.)?instagram\.com\/[\w.\-_]+\/?$/.test(value)
        ) {
          return "La URL de Instagram no es válida";
        }
        return null;
      },
      facebook: (value: string) => {
        if (
          value &&
          !/^https?:\/\/(www\.)?facebook\.com\/[\w.\-_]+\/?$/.test(value)
        ) {
          return "La URL de Facebook no es válida";
        }
        return null;
      },
      city_id: (value: string) => {
        if (!value || value === "") return "La ciudad es obligatoria";
        return null;
      },
    }),
    []
  );

  const validateField = useCallback(
    (name: keyof RestaurantFormData, value: string | boolean | number) => {
      const rule = validationRules[name as keyof typeof validationRules];
      if (rule && typeof value === "string") {
        return rule(value);
      }
      return null;
    },
    [validationRules]
  );

  const validateForm = useCallback(
    (formData: RestaurantFormData) => {
      const errors: ValidationErrors = {};

      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key as keyof RestaurantFormData, value);
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
