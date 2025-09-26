import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columnsTableConfig";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogConfig } from "../components/DialogConfig";
import { useState } from "react";

function Configuration() {
  const [openDialogConfig, setOpenDialogConfig] = useState(false);



  const data = [
    {
      id: "1",
      key: "key",
      value: "value",
      type: "text" as const,
      description: "description",
      isActive: true,
      status: "success" as const,
      email: "admin@example.com",
    },
    {
      id: "2",
      key: "key2",
      value: "value2",
      type: "image" as const,
      description: "description2",
      isActive: false,
      status: "pending" as const,
      email: "admin@example.com",
    },
  ]

  const btnCreate = (
    <Button variant="outline" className="flex items-center px-4 py-2 text-white bg-red-800/80 rounded-lg transition-colors h-full" onClick={() => setOpenDialogConfig(true)}>
      <Plus size={20} className="mr-2" />
      Nueva Configuración
    </Button>
  )
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <section>
        <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Configuración
        </h1>
        <p className="mt-2 text-gray-600">
          Administra la configuración de la plataforma
        </p>
        </div>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} btnCreate={btnCreate} />
        </div>
      </section>
      <section>
        <DialogConfig openDialogConfig={openDialogConfig} setOpenDialogConfig={setOpenDialogConfig} />
      </section>
    </div>
  )
}

export default Configuration;
