import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, type FieldErrors } from "react-hook-form";
import {
  defaultFormSchemaConfiguration,
  FormSchemaConfiguration,
  type TypeFormSchemaConfiguration,
} from "../models/FormSchemaConfiguration";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

interface DialogConfigProps {
  openDialogConfig: boolean;
  setOpenDialogConfig: (open: boolean) => void;
  fnSubmit: UseMutationResult<TypeFormSchemaConfiguration, Error, TypeFormSchemaConfiguration>;
}
export const DialogConfig = ({
  openDialogConfig,
  setOpenDialogConfig,
  fnSubmit,
}: DialogConfigProps) => {
  const [selectedType, setSelectedType] = useState<string>("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  

  


  const form = useForm<TypeFormSchemaConfiguration>({
    resolver: zodResolver(FormSchemaConfiguration),
    defaultValues: defaultFormSchemaConfiguration,
  });

  const onSubmit = (data: TypeFormSchemaConfiguration) => {
    console.log("Datos del formulario:", data);
    /* if(data.type === "image" && data.imageFile){
      form.setValue("value", data.imageFile.name);
    } */
    fnSubmit.mutate(data,{
      onSuccess: () => {
        setOpenDialogConfig(false);
      },
      onError: (error) => {
        console.log("Error:", error);
      }
    });

    /* // Si es una imagen, crear FormData para enviar el archivo
    if (data.type === "image" && data.imageFile) {
      const formData = new FormData();
      formData.append("key", data.key);
      formData.append("value", data.value);
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("imageFile", data.imageFile);

      console.log("FormData para imagen:", formData);
      // Aquí puedes enviar el formData a tu API
    } else {
      console.log("Datos regulares:", data);
      // Aquí puedes enviar los datos regulares a tu API
    } */

  };

  function onInvalid(error: FieldErrors) {
    console.log("Error:", error);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      form.setValue("value", file.name);
      form.setValue("imageFile", file);
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Limpiar archivo seleccionado cuando cambie el tipo
    if (value !== "image") {
      setSelectedFile(null);
      setPreviewUrl("");
      form.setValue("imageFile", undefined);
    }
  };

  const optionsType = [
    { value: "text", label: "Texto" },
    { value: "image", label: "Imagen" },
    { value: "boolean", label: "Booleano" },
    { value: "number", label: "Número" },
  ];

  const optionsKey = [
    { value: "topBanner", label: "Banner superior" },
    { value: "bottomBanner", label: "Banner inferior" },
  ];

  return (
    <Dialog open={openDialogConfig} onOpenChange={setOpenDialogConfig}>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            <DialogHeader>
              <DialogTitle>Nueva Configuración</DialogTitle>
              <DialogDescription>
                Ingresar el nombre de la configuración, el valor y el tipo de
                dato.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-3">
                <FormSelect
                  control={form.control}
                  required={true}
                  label="Nombre"
                  options={optionsKey}
                  name="key"

                />
              </div>
              <div className="grid gap-3">
                {selectedType === "image" ? (
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-slate-500 text-xs">
                          Imagen *
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="cursor-pointer border-none bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                              Haz clic para seleccionar una imagen (máximo 5MB)
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {previewUrl && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                            <div className="flex items-center space-x-3">
                              <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="w-20 h-20 object-cover rounded border"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedFile?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile?.size && (selectedFile.size / 1024 / 1024).toFixed(2))} MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormInput
                    control={form.control}
                    required={true}
                    label="Valor"
                    type={selectedType === "number" ? "number" : "text"}
                    name="value"
                    placeholder="Valor"
                  />
                )}
              </div>
              <div className="grid gap-3">
                <FormSelect
                  control={form.control}
                  required={true}
                  label="Tipo"
                  name="type"
                  options={optionsType}
                  onValueChange={(value) => handleTypeChange(value)}
                />
              </div>
              <div className="grid gap-3">
                <FormInput
                  control={form.control}
                  required={true}
                  label="Descripción"
                  name="description"
                  type="text"
                  placeholder="Descripción de la configuración"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="hover:opacity-90 cursor-pointer">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
