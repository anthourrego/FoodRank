import { z } from "zod"
import { getCurrentDateTimeLocal } from "@/lib/timezone"

export const FormSchemaManageEvents = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida").max(255, "La descripción no puede exceder 255 caracteres"),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de fin es requerida"),
  is_active: z.boolean(),
  city_id: z.string().min(1, "La ciudad es requerida"),
})

export type TypeFormSchemaManageEvents = z.infer<typeof FormSchemaManageEvents>

export const defaultFormSchemaManageEvents: TypeFormSchemaManageEvents = {
  name: "",
  description: "",
  start_date: getCurrentDateTimeLocal(),
  end_date: getCurrentDateTimeLocal(),
  is_active: true,
  city_id: "",
}
