import { type Control, type FieldPath, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

import { cn } from "@/lib/utils";
interface Props<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<T>;
  required?: boolean;
  label?: string;
  placeholder?: string | undefined;
  name: FieldPath<T>;
  className?: string;
}
export function FormTextarea<T extends FieldValues>({
  control,
  required = false,
  label,
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
            {required && <span className="text-red-500 ml-1">*</span> }
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              id={name}
              {...props}
              className={cn(
                "bg-white placeholder:text-slate-300 resize-vertical",
                fieldState.error && "border-red-500 focus:border-red-500"
              )}
            />
          </FormControl>
          <FormMessage className="text-red-500 text-xs mt-0" />
        </FormItem>
      )}
    />
  );
}