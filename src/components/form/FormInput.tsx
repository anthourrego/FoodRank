import { type Control, type FieldPath, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { type HTMLInputTypeAttribute } from "react";

import { cn } from "@/lib/utils";
interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  required?: boolean;
  label?: string;
  type: HTMLInputTypeAttribute | undefined;
  placeholder?: string | undefined;
  name: FieldPath<T>;
  className?: string;
}
export function FormInput<T extends FieldValues>({
  control,
  required = false,
  label,
  type,
  placeholder = "",
  name,
  className = "",
  ...props
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("min-w-auto", className)}>
          <FormLabel className="text-slate-500 text-xs truncate" htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              id={name}
              {...props}
              className={cn(
                "bg-white placeholder:text-slate-300",
                fieldState.error && "border-red-500 focus:border-red-500"
              )}
            />
          </FormControl>
          <FormMessage className="text-red-500 text-xs mt-1" />
        </FormItem>
      )}
    />
  );
}