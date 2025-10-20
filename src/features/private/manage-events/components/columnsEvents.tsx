import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import type { EventRow } from ".."
import { ArrowUpDown, ListTree } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const columnsEvents = (
  onEdit: (row: EventRow) => void,
  onAssignParticipants: (row: EventRow) => void
): ColumnDef<EventRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Nombre<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => <div className="text-sm font-medium text-gray-900 capitalize px-6 py-4">{row.original.name}</div>
  },
  {
    accessorKey: "city.name",
    header: "Ciudad",
    cell: ({ row }) => <div className="px-6 py-4">{row.original.city?.name}</div>
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div className="px-6 py-4 max-w-[420px] truncate">{row.original.description}</div>
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Inicio<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => <div className="px-6 py-4">{new Date(row.original.start_date).toLocaleString()}</div>
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Fin<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => <div className="px-6 py-4">{new Date(row.original.end_date).toLocaleString()}</div>
  },
  {
    accessorKey: "is_active",
    header: "Activo",
    cell: ({ row }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.original.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {row.original.is_active ? "Activo" : "Inactivo"}
      </span>
    )
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const ev = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <ListTree className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(ev)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignParticipants(ev)}>Asignar participantes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]


