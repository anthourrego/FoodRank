
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import type { EventRow } from "../models/EventRow"
import type { TypeFormSchemaManageEvents } from "../models/FormSchemaManageEvents"
import type { UseFormReturn } from "react-hook-form"
import { memo, useState, useEffect } from "react"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Editar evento" : "Nuevo evento"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Nombre"
            type="text"
            placeholder="Nombre"
          />
          <FormInput
            control={form.control}
            name="description"
            label="Descripción"
            type="text"
            placeholder="Descripción"
          />
         
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
            name="start_date"
            label="Fecha inicio"
            type="datetime-local"
            placeholder="Fecha inicio"
          />
          <FormInput
            control={form.control}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Guardar cambios" : "Crear evento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
)
})


