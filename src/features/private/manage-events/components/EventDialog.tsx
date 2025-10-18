import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { EventRow } from ".."
import type { TypeFormSchemaManageEvents } from "../models/FormSchemaManageEvents"
import type { UseFormReturn } from "react-hook-form"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"

interface EventDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  editing: EventRow | null
  form: UseFormReturn<TypeFormSchemaManageEvents>
  onSubmit: (data: TypeFormSchemaManageEvents) => void
  isSubmitting: boolean
  cities: { id: number; name: string }[]
}

export function EventDialog({ open, setOpen, editing, form, onSubmit, isSubmitting, cities }: EventDialogProps) {
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
            <FormSelect
              control={form.control}
              name="city_id"
              label="Ciudad"
              options={cities.map((c) => ({ label: c.name, value: c.id }))}
              onValueChange={(value) => form.setValue("city_id", Number(value))}
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
              options={[{ label: "Activo", value: true }, { label: "Inactivo", value: false }]}
              onValueChange={(value) => form.setValue("is_active", value === true)}
              
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
}


