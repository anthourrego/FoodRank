import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columnsTableConfig";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogConfig } from "../components/DialogConfig";
import { useEffect, useState } from "react";
import type { ConfigurationModel } from "../models/Configuration";
import { useQueryServiceConfig } from "../hook/useQueryServiceConfig";

function Configuration() {
  const [openDialogConfig, setOpenDialogConfig] = useState(false);
  const [configurationsList, setConfigurationsList] = useState<ConfigurationModel[]>([]);


  const { GetConfigurations, mutateCreateConfiguration } = useQueryServiceConfig();

  const { data: configurations } = GetConfigurations;

  
  useEffect(() => {
    if(configurations &&configurations.success && configurations.data?.length > 0){
      setConfigurationsList(configurations.data);
    }
  }, [configurations]);


/*   const data = [
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
  ] */

  const btnCreate = (
    <Button variant="default" className="h-full" onClick={() => setOpenDialogConfig(true)}>
      <Plus size={20} className="mr-2" />
      <span className="text-white">Nueva Configuración</span>
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
          <DataTable columns={columns} data={configurationsList} btnCreate={btnCreate} />
        </div>
      </section>
      <section>
        <DialogConfig openDialogConfig={openDialogConfig} setOpenDialogConfig={setOpenDialogConfig} fnSubmit={mutateCreateConfiguration} />
      </section>
    </div>
  )
}

export default Configuration;
