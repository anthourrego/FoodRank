import { z } from "zod";
export const FormSchemaConfiguration = z.object({
  key: z.string().min(1, { message: "El nombre es obligatorio" }),
  value: z.string().min(1, { message: "El valor es obligatorio" }),
  type: z.enum(["text", "image", "boolean", "number", "banner"]),
  description: z.string().min(1, { message: "La descripción es obligatoria" }),
});



export type TypeFormSchemaConfiguration = z.infer<typeof FormSchemaConfiguration>;

export const defaultFormSchemaConfiguration: TypeFormSchemaConfiguration = {
  key: "",
  value: "",
  type: "text",
  description: "",
};
