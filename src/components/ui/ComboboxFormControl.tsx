import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "./form";
import { ScrollArea } from "./scroll-area";
import type{ Control, FieldValues } from "react-hook-form";

interface ComboboxProps<T extends FieldValues> {
  value?: string;
  onSelect: (value: string | undefined) => void;
  items: OptionItem[];
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  onSearchChange?: (e: string) => void;
  nameInputForm: Control<T> | string;
  disabled?: boolean;
}

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function ComboboxFormControl<T extends FieldValues>({
  value,
  onSelect,
  items,
  searchPlaceholder = "...",
  noResultsMsg = "No se encontraron resultados",
  selectItemMsg = "Seleccione un item",
  className,
  unselect = false,
  unselectMsg = "Ninguno",
  onSearchChange,
  disabled = false,
}: ComboboxProps<T>) {
  const [filterValues, setFilterValues] = useState<OptionItem[]>([]);
  const [originValues, setOriginValues] = useState<OptionItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const filterItems = [...items].slice(0, 12);
    setFilterValues(filterItems);
    setOriginValues(items);
  }, [items]);
  const handleOnSearchChange = useDebouncedCallback((e: string) => {
    if (e === "") {
      setFilterValues(originValues.slice(0, 12));
      return;
    }
    if (onSearchChange) {
      onSearchChange(e);
    }
    const searchTerm = e.toLowerCase();
    const newFilterValues = originValues
      .filter((item) => item.label.toLowerCase().includes(searchTerm))
      .slice(0, 12);
    setFilterValues(newFilterValues);
  }, 500);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "justify-between gap-1 has-[>svg]:px-1",
              "text-muted-foreground",
              "text-slate-500",
              value === "" && "font-normal",
              className
            )}
          >
            <span className="truncate">
              {value
                ? items.find((item) => String(item.value) === String(value))
                    ?.label
                : selectItemMsg}
            </span>

            <ChevronsUpDown className="relative  opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        style={popOverStyles}
        className="p-0 popover-content-width-same-as-its-trigger min-w-50"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleOnSearchChange}
          />
          <CommandList>
            <ScrollArea className="max-h-[220px] overflow-auto">
              <CommandEmpty>{noResultsMsg}</CommandEmpty>
              <CommandGroup>
                {unselect && (
                  <CommandItem
                    key="unselect"
                    value=""
                    onSelect={() => {
                      onSelect("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {unselectMsg}
                  </CommandItem>
                )}
                {filterValues.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onSelect(String(item.value));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}