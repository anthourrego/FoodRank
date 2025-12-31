import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import type { EventRow } from "../models/EventRow"
import { ArrowUpDown, ListTree, Edit, Users, QrCode, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const columnsEvents = (
  onEdit: (row: EventRow) => void,
  onAssignParticipants: (row: EventRow) => void,
  generarQr: (row: EventRow) => void,
  onGoToConfiguration: (row: EventRow) => void
): ColumnDef<EventRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Nombre<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
    ),
    cell: ({ row }) => <div className="text-sm font-medium text-gray-900 capitalize px-6 py-4">{row.original.name}</div>,
    enableColumnFilter: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "city.name",
    header: "Ciudad",
    cell: ({ row }) => <div className="px-6 py-4">{row.original.city?.name}</div>,
    enableColumnFilter: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div className="px-6 py-4 max-w-[420px] truncate">{row.original.description}</div>,
    enableColumnFilter: true,
    enableGlobalFilter: true,
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
    header: () => <div className="text-center">Activo</div>,
    cell: ({ row }) => (
      <div className="text-center px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.original.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.original.is_active ? "Activo" : "Inactivo"}
        </span>
      </div>
    ),
    enableGlobalFilter: true,
    filterFn: (row, _columnId, value) => {
      const isActive = row.original.is_active;
      const status = isActive ? "activo" : "inactivo";
      return status.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const ev = row.original
      return (
        <div className="flex justify-center px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <ListTree className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(ev)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignParticipants(ev)} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Asignar participantes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGoToConfiguration(ev)} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generarQr(ev)} className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generar QR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    }
  }
]


