import { z } from "zod";
const maxSize = 5 * 1024 * 1024; // 5MB
const acceptedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
export const FormSchemaConfiguration = z.object({
  key: z.string().min(1, { message: "El nombre es obligatorio" }),
  value: z.string().min(1, { message: "El valor es obligatorio" }),
  eventId: z.string().min(1, { message: "El evento es obligatorio" }),
  type: z.enum(["text", "image", "boolean", "number", "banner"]),
  description: z.string().min(1, { message: "La descripción es obligatoria" }),
  imageFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= maxSize, { message: "El archivo debe ser menor a 5MB" })
    .refine((file) => !file || acceptedTypes.includes(file.type), { message: "El archivo debe ser una imagen" }),
});



export type TypeFormSchemaConfiguration = z.infer<typeof FormSchemaConfiguration>;

export const defaultFormSchemaConfiguration: TypeFormSchemaConfiguration = {
  key: "",
  value: "",
  eventId: "",
  type: "text",
  description: "",
  imageFile: undefined,
};
