import { useEffect, useMemo, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventDialog } from "./components/EventDialog.tsx"
import { EventsTable } from "./components/EventsTable.tsx"
import { FormSchemaManageEvents, type TypeFormSchemaManageEvents, defaultFormSchemaManageEvents } from "./models/FormSchemaManageEvents"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents.ts"
import type { EventRow } from "./models/EventRow.ts"
import { useQueryServiceCities } from "@/hooks/useQueryCities.ts"
import { useNavigate } from "react-router"
import { toast } from "sonner"





type City = { id: number; name: string }

function ManageEvents() {

  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [editing, setEditing] = useState<EventRow | null>(null)
  const navigate = useNavigate()

  const form = useForm<TypeFormSchemaManageEvents>({
    resolver: zodResolver(FormSchemaManageEvents),
    defaultValues: defaultFormSchemaManageEvents,
  })

  const { GetAllEvents, createEventMutation, updateEventMutation } = useQueryServiceEvents()
  const { GetCities } = useQueryServiceCities()

  const { data: dataListEvent, isLoading } = GetAllEvents()

  const { data: dataCities } = GetCities()

  const events: EventRow[] = useMemo(() => dataListEvent?.data ?? [], [dataListEvent])

  useEffect(() => {
    if (open && dataCities) {
      setCities(dataCities)
    }
  }, [open, dataCities])





  const onOpenNew = useCallback(() => {
    setEditing(null)
    form.reset({
      ...defaultFormSchemaManageEvents,
      city_id: cities[0]?.id.toString() ?? "",
    })
    setOpen(true)
  }, [form, cities])

  const onOpenEdit = useCallback((row: EventRow) => {
    setEditing(row)
    form.reset({
      id: row.id,
      name: row.name,
      description: row.description,
      start_date: row.start_date?.slice(0, 16) ?? "",
      end_date: row.end_date?.slice(0, 16) ?? "",
      is_active: Boolean(row.is_active),
      city_id: row.city?.id.toString() ?? "",
    })
    setOpen(true)
  }, [form])

  const onAssignParticipants = useCallback((row: EventRow) => {
    navigate(`/home/manage-events/${row.id}/participants`)
  }, [navigate])

  const onSubmit = useCallback((data: TypeFormSchemaManageEvents) => {
    if (editing) {
      updateEventMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false)
          form.reset()
          setEditing(null)
          toast.success("Evento actualizado correctamente")
        },
        onError: (error) => {
          const errorMessage =  error?.message || "Error al actualizar el evento"
          toast.error(errorMessage)
        }
      })
    } else {
      createEventMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false)
          form.reset()
          toast.success("Evento creado correctamente")
        },
        onError: (error) => {
          const errorMessage =  error?.message || "Error al crear el evento"
          toast.error(errorMessage)
        }
      })
    }
  }, [editing, updateEventMutation, createEventMutation, form])

  const generarQr = useCallback((row: EventRow) => {
    navigate(`/home/qr/${row.id}`)
  }, [navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Eventos</h1>
        <Button onClick={onOpenNew} className="flex items-center gap-2 bg-red-800/80 hover:bg-red-800 text-white">
          <Plus className="h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>


      <EventsTable isLoading={isLoading} events={events} onEdit={onOpenEdit} onAssignParticipants={onAssignParticipants} generarQr={generarQr} />


      <EventDialog
        open={open}
        setOpen={setOpen}
        editing={editing}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={createEventMutation.isPending || updateEventMutation.isPending}
        cities={cities}
      />
    </div>
  )
}

export default ManageEvents

