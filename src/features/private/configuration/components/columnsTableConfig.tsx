import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { ListTree, ArrowUpDown, Eye } from "lucide-react"
import { useState } from "react"
import type { ConfigurationModel } from "../models/Configuration"

// Componente para previsualización de imagen
const ImagePreview = ({ imageUrl, fileName }: { imageUrl: string; fileName: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Ver imagen
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Previsualización: {fileName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={fileName}
              className="max-w-full max-h-96 object-contain rounded-lg"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<ConfigurationModel>[] = [
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
      
      if (configuration.type === "image") {
        const imageUrl = `${import.meta.env.VITE_URL_RESOURCE}${configuration.value}`;
        return (
          <div className="px-6 py-4">
            <ImagePreview imageUrl={imageUrl} fileName={configuration.value} />
          </div>
        )
      }
      
      return (
        <div className="capitalize px-6 py-4">{configuration.value}</div>
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