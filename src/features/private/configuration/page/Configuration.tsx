import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columnsTableConfig";
import { Button } from "@/components/ui/button";
import { ListTree, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { ConfigurationModel } from "../models/Configuration";
import { useQueryServiceConfig } from "../hook/useQueryServiceConfig";
import { Separator } from "@/components/ui/separator";
import { DialogConfig } from "../components/DialogConfig";

function Configuration() {
  const [openDialogConfig, setOpenDialogConfig] = useState(false);
  const [configurationsList, setConfigurationsList] = useState<ConfigurationModel[]>([]);


  const { GetConfigurations, mutateCreateConfiguration } = useQueryServiceConfig();

  const { data: configurations } = GetConfigurations();
console.log(configurations)

  useEffect(() => {
    if (configurations && configurations.success && configurations.data) {
      setConfigurationsList(configurations.data);
    } else if (configurations && configurations.success && !configurations.data) {
      setConfigurationsList([]);
    }
  }, [configurations]);



  const btnCreate = (
    <Button className="h-full bg-red-800/80 hover:bg-red-800 text-white" onClick={() => setOpenDialogConfig(true)}>
      <Plus size={20} className="mr-2" />
      <span>Nueva Configuración</span>
    </Button>
  )
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <section>
        <div className="flex items-center gap-2">
          <ListTree className="w-6 h-6 text-slate-700" />
          <h2 className="text-xl font-bold text-slate-700">
            Configuración de Eventos
          </h2>
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
