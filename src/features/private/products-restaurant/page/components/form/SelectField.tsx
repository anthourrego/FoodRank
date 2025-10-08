import { AlertCircle } from "lucide-react";

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { id: number | string; name: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  options,
  placeholder = "Seleccionar...",
  required = false,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
        error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
      }`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
        <AlertCircle size={16} className="mr-1 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);
