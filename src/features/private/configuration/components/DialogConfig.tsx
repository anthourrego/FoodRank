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
import { useEffect, useState, Suspense } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";

interface DialogConfigProps {
  openDialogConfig: boolean;
  setOpenDialogConfig: (open: boolean) => void;
  fnSubmit: UseMutationResult<TypeFormSchemaConfiguration, Error, TypeFormSchemaConfiguration>;
}

// Componente interno que maneja la lógica del formulario
const DialogConfigInternal = ({
  openDialogConfig,
  setOpenDialogConfig,
  fnSubmit,
}: DialogConfigProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { GetEvents } = useQueryServiceEvents()
  const { data: eventsData, isLoading: isLoadingEvents } = GetEvents()

  const [eventsList, setEventsList] = useState<OptionItem[]>([])
  useEffect(() => {
    if (eventsData?.data?.length > 0) {
      setEventsList(eventsData.data.map((event: { id: string; name: string }) => {
        return {
          value: event.id,
          label: event.name,
          data: event
        }
      }))
    }
  }, [eventsData])







  const form = useForm<TypeFormSchemaConfiguration>({
    resolver: zodResolver(FormSchemaConfiguration),
    defaultValues: defaultFormSchemaConfiguration,
  });

  const onSubmit = (data: TypeFormSchemaConfiguration) => {
    console.log("Datos del formulario:", data);
    /* if(data.type === "image" && data.imageFile){
      form.setValue("value", data.imageFile.name);
    } */
    fnSubmit.mutate(data, {
      onSuccess: () => {
        form.reset(defaultFormSchemaConfiguration);
        setSelectedFile(null);
        setPreviewUrl("");
        setOpenDialogConfig(false);
        toast.success("Configuración creada correctamente");
      },
      onError: (error) => {
        const errorMessage =  error?.message || "Error al crear la configuración";
        toast.error(errorMessage);
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
    // Limpiar archivo seleccionado cuando cambie el tipo
    if (value !== "image") {
      setSelectedFile(null);
      setPreviewUrl("");
      form.setValue("imageFile", undefined);
    }
  };

  const handleKeyChange = (value: string) => {
    // Establecer tipo automáticamente según la clave seleccionada
    if (value === "topBanner" || value === "bottomBanner") {
      form.setValue("type", "image");
    } else if (value === "title" || value === "description") {
      form.setValue("type", "text");
    }
  };



  const optionsKey = [
    { value: "topBanner", label: "Banner superior" },
    { value: "bottomBanner", label: "Banner inferior" },

  ];

  if(isLoadingEvents){
    return (
      <Dialog open={openDialogConfig} onOpenChange={setOpenDialogConfig}>
        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-[425px]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Nueva Configuración</DialogTitle>
            <DialogDescription>
              Cargando lista de eventos...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center flex flex-col items-center justify-center">
              <Loading />
              <p className="mt-2 text-sm text-gray-600">Cargando eventos...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={openDialogConfig} onOpenChange={setOpenDialogConfig}>

      <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex flex-col flex-1 min-h-0">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Nueva Configuración</DialogTitle>
              <DialogDescription>
                Ingresar el nombre de la configuración, el valor y el tipo de
                dato.
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-4 flex-shrink-0" />
            <div className="flex-1 overflow-y-auto overflow-x-hidden grid gap-4 mb-4 min-h-0">
              <FormSelect
                control={form.control}
                required={true}
                label="Configuracion del evento"
                options={eventsList}
                name="eventId"

              />
              <div className="grid gap-3">
                <FormSelect
                  control={form.control}
                  required={true}
                  label="Nombre"
                  options={optionsKey}
                  name="key"
                  onValueChange={(value) => handleKeyChange(value)}
                />
              </div>
              <div className="grid gap-3">
                <FormInput
                  control={form.control}
                  required={true}
                  label="Tipo"
                  name="type"
                  readOnly={true}
                  type="text"
                  className="text-slate-500"
                  placeholder="Tipo"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El tipo se establece automáticamente según la configuración seleccionada
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  La resolución recomendada para la imagen es de 1905x440
                </p>
              </div>
              <div className="grid gap-3">
                {form.watch("type") === "image" ? (
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
                    type={form.watch("type") === "number" ? "number" : "text"}
                    name="value"
                    placeholder="Valor"
                  />
                )}
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
            <DialogFooter className="flex-shrink-0 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-red-800/80 hover:bg-red-800 text-white">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Componente lazy wrapper que solo carga cuando es necesario
export const DialogConfig = ({
  openDialogConfig,
  setOpenDialogConfig,
  fnSubmit,
}: DialogConfigProps) => {
  // Solo renderizar cuando el diálogo esté abierto
  if (!openDialogConfig) {
    return null;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Cargando configuración...</div>}>
      <DialogConfigInternal
        openDialogConfig={openDialogConfig}
        setOpenDialogConfig={setOpenDialogConfig}
        fnSubmit={fnSubmit}
      />
    </Suspense>
  );
};
