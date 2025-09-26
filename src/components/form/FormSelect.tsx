import { type Control, type FieldPath, type FieldValues, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

import { cn } from "@/lib/utils";

interface Props<T extends FieldValues> {
  control: Control<T>;
  required?: boolean;
  label?: string;
  options: OptionItem[];
  labelItemUnselected?: string;
  name: FieldPath<T>;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  required,
  label,
  labelItemUnselected = "Seleccione",
  options,
  className = "",
  onValueChange,
}: Props<T>) {
  const {
    formState: { errors },
  } = useForm();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(" min-w-auto", className)}>
          <FormLabel className="text-slate-500 text-xs flex flex-row">
            {label}
            {required && (
              <span className="text-red-500 flex flex-row truncate">
                * <FormMessage className="pl-1 text-xs truncate" />
              </span>
            )}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) onValueChange(value);
            }}
            defaultValue={field.value}
            aria-invalid={errors.typeDocument ? "true" : "false"}
            {...field}
          >
            <FormControl>
              <SelectTrigger className="w-full truncate">
                <span className=" text-slate-500 truncate">
                  <span className="capitalize">
                    {" "}
                    {options?.find((item) => item.value == field.value)
                      ?.label || labelItemUnselected}
                  </span>
                </span>
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map((item) => (
                <SelectItem key={String(item.value)} value={String(item.value)}>
                  <span className="truncate capitalize"> {item.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}