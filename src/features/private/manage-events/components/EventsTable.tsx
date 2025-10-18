import type { EventRow } from ".."
import { DataTable } from "@/components/ui/data-table"
import { columnsEvents } from "./columnsEvents"

interface EventsTableProps {
  isLoading: boolean
  events: EventRow[]
  onEdit: (row: EventRow) => void
}

export function EventsTable({ isLoading, events, onEdit }: EventsTableProps) {
  const data = Array.isArray(events) ? events : []
  return <DataTable columns={columnsEvents(onEdit)} data={isLoading ? [] : data} />
}


