import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  as = "input",
  rows,
  className = "",
}) => {
  const baseClassName = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
    error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300"
  } ${className}`;

  const Component = as;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        id={id}
        name={name}
        type={as === "input" ? type : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={baseClassName}
        placeholder={placeholder}
        rows={as === "textarea" ? rows : undefined}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center animate-fade-in"
        >
          <AlertCircle size={16} className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
