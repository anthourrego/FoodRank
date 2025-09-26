import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import { ListTree,ArrowUpDown  } from "lucide-react"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Configuration = {
  id: string
  key: string
  value: string
  type: 'text'|'image'|'boolean'|'number'|'banner'
  description: string
  isActive: boolean
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Configuration>[] = [
  {
    accessorKey: "key",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <div className="text-sm font-medium text-gray-900 capitalize px-6 py-4">{configuration.key}</div>
      )
    }
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <div className=" capitalize px-6 py-4">{configuration.value}</div>
      )
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <div className=" capitalize px-6 py-4">{configuration.type}</div>
      )
    }
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <div className=" capitalize px-6 py-4">{configuration.description}</div>
      )
    }
  },
  {
    accessorKey: "isActive",
    header: "Activo",
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            configuration.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {configuration.isActive ? "Activo" : "Inactivo"}
        </span>
      )
    }
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0" >
              <span className="sr-only">Abrir menu</span>
              <ListTree className="h-4 w-4" />
              
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>{
                console.log(configuration);
              }}
            >
              Desa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

]