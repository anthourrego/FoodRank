
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { X, Save } from "lucide-react"
import type { EventRow } from "../models/EventRow"
import type { TypeFormSchemaManageEvents } from "../models/FormSchemaManageEvents"
import type { UseFormReturn } from "react-hook-form"
import { memo, useState, useEffect } from "react"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormCombobox } from "@/components/form/FormCombobox";

interface EventDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  editing: EventRow | null
  form: UseFormReturn<TypeFormSchemaManageEvents>
  onSubmit: (data: TypeFormSchemaManageEvents) => void
  isSubmitting: boolean
  cities: { id: number; name: string }[]
}

export const EventDialog = memo(function EventDialog({ open, setOpen, editing, form, onSubmit, isSubmitting, cities }: EventDialogProps) {
  const [cityOptions, setCityOptions] = useState<{ label: string; value: number }[]>([])


  useEffect(() => {
    if (open && cities.length > 0) {
      const options = cities.map((c) => ({ label: c.name, value: c.id }))
      setCityOptions(options)
    }
  }, [open, cities])

  useEffect(() => {
    if (!open) {
      setCityOptions([])
    }
  }, [open])

return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="flex flex-col max-h-[90vh]">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>{editing ? "Editar evento" : "Nuevo evento"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 min-h-0">
            <FormInput
              control={form.control}
              name="name"
              required={true}
              label="Nombre"
              type="text"
              placeholder="Nombre"
            />
            <div className="space-y-0">
              <FormTextarea
                control={form.control}
                required={true}
                name="description"
                label="Descripción"
                placeholder="Descripción del evento..."
                maxLength={255}
                rows={4}
              />
              <p className="text-xs text-gray-500 text-right">
                {form.watch("description")?.length || 0}/255 caracteres
              </p>
            </div>
           
            <FormCombobox
              control={form.control}
              required={true}
              label="Ciudad"
      
              items={cityOptions}
              name="city_id"
              textUnselected="Seleccione una ciudad"
              className="w-full lg:w-full"
            />
            <FormInput
              control={form.control}
              required={true}
              name="start_date"
              label="Fecha inicio"
              type="datetime-local"
              placeholder="Fecha inicio"
            />
            <FormInput
              control={form.control}
              required={true}
              name="end_date"
              label="Fecha fin"
              type="datetime-local"
              placeholder="Fecha fin"
            />
            <FormSelect
              control={form.control}
              name="is_active"
              label="Estado"
              options={[{ label: "Activo", value: "true" }, { label: "Inactivo", value: "false" }]}
              onValueChange={(value) => form.setValue("is_active", value === "true")}

            />
          </div>
          <DialogFooter className="flex-shrink-0 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {editing ? "Guardar cambios" : "Crear evento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
)
})


