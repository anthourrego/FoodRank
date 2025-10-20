import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { ListTree } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { EventsProduct } from "@/features/public/models/EventsProducts"

export const columns = (
  onRemove: (row: EventsProduct) => void,
): ColumnDef<EventsProduct>[] => [
  {
    accessorKey: "restaurant_product.name",
    header: "Producto",
  },
  {
    accessorKey: "restaurant_product.restaurant.name",
    header: "Restaurante",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const item = row.original
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
            <DropdownMenuItem onClick={() => onRemove(item)}>Eliminar participante</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


