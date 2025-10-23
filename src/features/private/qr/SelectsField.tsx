import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MapPin, User, Send } from "lucide-react";

import type { IDataQr } from "./GenerateQr";
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents";
import type { EventRow } from "../manage-events/models/EventRow";
import { toast } from "sonner";
import { useParams } from "react-router";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  disabled?: boolean;
}

interface SelectsFieldProps {
  generateQr: (val: IDataQr | undefined) => void;
}

export default function SelectsField({ generateQr }: SelectsFieldProps) {
  const { eventId } = useParams();

  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const [restaurantesSelect, setRestaurantesSelect] = useState<Option[]>([]);
  const [branchsRestaurantSelect, setBranchsRestaurantSelect] = useState<
    Option[]
  >([]);

  const { GetAllEvents, GetProductsByEvent } = useQueryServiceEvents();

  const { data: dataListEvent } = GetAllEvents();

  const { data: dataProductsByEvent } = GetProductsByEvent(
    selectedEventId ? +selectedEventId : 0,
    { enabled: !!selectedEventId }
  );

  const events: EventRow[] = useMemo(
    () => dataListEvent?.data ?? [],
    [dataListEvent]
  );

  useEffect(() => {
    if (eventId && events.length) {
      const eventFind = events.find((ev) => ev.id == +eventId);
      if (eventFind) {
        setSelectedEventId("" + eventFind.id);
      }
    }
  }, [events, eventId]);

  useEffect(() => {
    if (dataProductsByEvent?.data) {
      const restaurants: Option[] = dataProductsByEvent.data.map((it) => {
        return {
          label: `${it.restaurant_product.name} (${it.restaurant_product.restaurant.name})`,
          value: it.restaurant_product.id + "",
        };
      });
      setRestaurantesSelect(restaurants);
    }
  }, [dataProductsByEvent]);

  useEffect(() => {
    if (selectedRestaurant && dataProductsByEvent?.data) {
      const restaurantFind = dataProductsByEvent.data.find(
        (it) => it.restaurant_product.id + "" == selectedRestaurant
      );
      if (restaurantFind) {
        const branchs: Option[] = restaurantFind.branchs_product.map((it) => {
          return {
            label: it.branch.address,
            value: it.branch.id + "",
          };
        });
        setBranchsRestaurantSelect(branchs);

        setSelectedProductId(restaurantFind.product_id + "");
      }
    }
  }, [selectedRestaurant]);

  const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    icon: Icon,
    gradientFrom,
    gradientTo,
    disabled,
  }) => (
    <div className="relative group w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} <span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        ></div>
        <div className="relative bg-white border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300 shadow-sm">
          <div className="flex items-center px-3 sm:px-4 py-3">
            <Icon className="h-5 w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
            <select
              disabled={disabled}
              value={value}
              onChange={onChange}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none appearance-none cursor-pointer text-sm sm:text-base"
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-5 w-5 text-gray-400 pointer-events-none flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="via-blue-50 to-indigo-100 mb-5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <SelectField
              label="Eventos"
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSelectedRestaurant("");
              }}
              options={events.map((even) => {
                return {
                  label: even.name,
                  value: even.id + "",
                };
              })}
              placeholder="Selecciona un evento"
              icon={MapPin}
              gradientFrom="from-emerald-400"
              gradientTo="to-cyan-400"
            />
          </div>

          <div className="flex-1">
            <SelectField
              label="Restaurantes"
              value={selectedRestaurant}
              onChange={(e) => {
                setSelectedRestaurant(e.target.value);
                setSelectedBranch("");
              }}
              options={restaurantesSelect}
              placeholder="Selecciona restaurante"
              icon={MapPin}
              gradientFrom="from-emerald-400"
              gradientTo="to-cyan-400"
              disabled={selectedEventId.trim() == ""}
            />
          </div>

          <div className="flex-1">
            <SelectField
              label="Sucursal"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              options={branchsRestaurantSelect}
              placeholder="Elige sucursal"
              icon={User}
              gradientFrom="from-purple-400"
              gradientTo="to-pink-400"
              disabled={selectedRestaurant.trim() == ""}
            />
          </div>

          <div className="w-full lg:w-auto">
            <button
              onClick={() => {
                if (
                  selectedBranch.trim() == "" ||
                  selectedProductId.trim() == "" ||
                  selectedEventId.trim() == ""
                ) {
                  generateQr(undefined);
                  toast.warning("Llene todos los campos");
                  return;
                }

                generateQr({
                  branch_id: selectedBranch,
                  product_id: selectedProductId,
                  event_id: selectedEventId,
                });
              }}
              className="w-full lg:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              <span className="lg:hidden">Generar QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
