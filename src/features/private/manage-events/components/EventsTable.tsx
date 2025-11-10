import type { EventRow } from "../models/EventRow"
import { DataTable } from "@/components/ui/data-table"
import { columnsEvents } from "./columnsEvents"

interface EventsTableProps {
  isLoading: boolean
  events: EventRow[]
  onEdit: (row: EventRow) => void
  onAssignParticipants: (row: EventRow) => void,
  generarQr: (row: EventRow) => void
}

export function EventsTable({ isLoading, events, onEdit, onAssignParticipants, generarQr }: EventsTableProps) {
  const data = Array.isArray(events) ? events : []
  return <DataTable columns={columnsEvents(onEdit, onAssignParticipants, generarQr)} data={isLoading ? [] : data} />
}


