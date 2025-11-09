import type{  Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { cn } from "@/lib/utils";
import { ComboboxFormControl } from "../ui/ComboboxFormControl";

interface Props<T extends FieldValues> {
  control: Control<T>;
  required?: boolean;
  label: string;
  items: OptionItem[];
  name: FieldPath<T>;
  textUnselected: string;
  className?: string;
  showTextError?: boolean;
  disabled?: boolean;
  onSearchChange?: (param: string) => void;
}

export function FormCombobox<T extends FieldValues>({
  control,
  required = false,
  label,
  items,
  name,
  textUnselected,
  className = "",
  showTextError = true,
  disabled = false,
  onSearchChange,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("flex flex-col min-w-40", className)}>
          <FormLabel className="text-slate-500 text-xs">
            <span className="truncate">{label}</span>
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <ComboboxFormControl
            nameInputForm={name}
            disabled={disabled}
            value={field.value}
            onSelect={(value) => {
              field.onChange(String(value));
            }}
            onSearchChange={onSearchChange}
            items={items}
            selectItemMsg={textUnselected}
            className={
              fieldState.error ? "border-red-500 focus:border-red-500" : ""
            }
          />
          <FormMessage className="text-red-500 text-xs mt-0" />
        </FormItem>
      )}
    />
  );
}