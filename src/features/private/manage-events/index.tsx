import { useEffect, useMemo, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EventDialog } from "./components/EventDialog.tsx"
import { EventsTable } from "./components/EventsTable.tsx"
import { FormSchemaManageEvents, type TypeFormSchemaManageEvents, defaultFormSchemaManageEvents } from "./models/FormSchemaManageEvents"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents.ts"
import type { EventRow } from "./models/EventRow.ts"
import { useQueryServiceCities } from "@/hooks/useQueryCities.ts"





type City = { id: number; name: string }

function ManageEvents() {
  
  const [open, setOpen] = useState(false)
  const [cities,setCities] =  useState<City[]>([])
  const [editing, setEditing] = useState<EventRow | null>(null)
  
  const form = useForm<TypeFormSchemaManageEvents>({
    resolver: zodResolver(FormSchemaManageEvents),
    defaultValues: defaultFormSchemaManageEvents,
  })

  const {GetAllEvents,createEventMutation,updateEventMutation} =useQueryServiceEvents()
  const {GetCities} = useQueryServiceCities()

  const {data:dataListEvent,isLoading} = GetAllEvents()
  
  const {data:dataCities} = GetCities()

  const events: EventRow[] = useMemo(() => dataListEvent?.data ?? [], [dataListEvent])
  
  useEffect(()=>{
    if(open && dataCities){
      setCities(dataCities)
    }
  },[open, dataCities])





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
      start_date: row.start_date?.slice(0,16) ?? "",
      end_date: row.end_date?.slice(0,16) ?? "",
      is_active: Boolean(row.is_active),
      city_id: row.city?.id.toString() ?? "",
    })
    setOpen(true)
  }, [form])

  const onSubmit = useCallback((data: TypeFormSchemaManageEvents) => {
    if (editing) {
      updateEventMutation.mutate(data,{
        onSuccess:()=>{
          setOpen(false)
          form.reset()
          setEditing(null)
        }
      })
    } else {      
      createEventMutation.mutate(data,{
        onSuccess:()=>{
          setOpen(false)
          form.reset()
        }
      })
    }
  }, [editing, updateEventMutation, createEventMutation, form])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administración de Eventos</h1>
          <Button onClick={onOpenNew}>Nuevo Evento</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <EventsTable isLoading={isLoading} events={events} onEdit={onOpenEdit} />
          </CardContent>
        </Card>

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
    </div>
  )
}

export default ManageEvents

