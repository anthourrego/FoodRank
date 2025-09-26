import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  defaultFormSchemaConfiguration,
  FormSchemaConfiguration,
  type TypeFormSchemaConfiguration,
} from "../models/FormSchemaConfiguration";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";

interface DialogConfigProps {
  openDialogConfig: boolean;
  setOpenDialogConfig: (open: boolean) => void;
}
export const DialogConfig = ({
  openDialogConfig,
  setOpenDialogConfig,
}: DialogConfigProps) => {
  const form = useForm<TypeFormSchemaConfiguration>({
    resolver: zodResolver(FormSchemaConfiguration),
    defaultValues: defaultFormSchemaConfiguration,
  });

  const onSubmit = (data: TypeFormSchemaConfiguration) => {
    console.log(data);
  };

  const optionsType = [
    { value: "text", label: "Texto" },
    { value: "image", label: "Imagen" },
    { value: "boolean", label: "Booleano" },
    { value: "number", label: "Número" },
    { value: "banner", label: "Banner" },
  ];

  return (
    <Dialog open={openDialogConfig} onOpenChange={setOpenDialogConfig}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Configuración</DialogTitle>
              <DialogDescription>
                Ingresar el nombre de la configuración, el valor y el tipo de
                dato.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormInput
                  control={form.control}
                  required={true}
                  label="Nombre"
                  type="text"
                  name="key"
                  placeholder="Nombre"
                />
              </div>
              <div className="grid gap-3">
                <FormInput
                  control={form.control}
                  required={true}
                  label="Valor"
                  type="text"
                  name="value"
                  placeholder="Valor"
                />
              </div>
              <div className="grid gap-3">
                <FormSelect
                  control={form.control}
                  required={true}
                  label="Tipo"
                  name="type"
                  options={optionsType}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};
