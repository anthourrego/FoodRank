import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./input";

interface DataTableServerProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  total: number;
  from: number;
  to: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  isLoading?: boolean;
  manualSorting?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

export function DataTableServer<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  total,
  from,
  to,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  searchValue = "",
  isLoading = false,
  manualSorting = false,
  enableSearch = false,
  searchPlaceholder = "Buscar...",
}: DataTableServerProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Sincronizar el valor local cuando cambia el prop (ej: al abrir modal)
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    manualPagination: true,
    manualSorting: manualSorting,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      if (onSortingChange) {
        onSortingChange(newSorting);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePageChange = (newPageIndex: number) => {
    onPaginationChange(newPageIndex, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPaginationChange(0, newPageSize);
  };

  const handleSearchChange = (value: string) => {
    // Actualizar estado local inmediatamente para que el input sea responsivo
    setLocalSearchValue(value);
    
    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Debounce: esperar 500ms después de que el usuario deje de escribir
    // Solo entonces actualizamos el estado del padre
    const timeout = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 500);
    
    setSearchTimeout(timeout);
  };

  return (
    <div>
      {/* Barra de búsqueda */}
      {enableSearch && (
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  
                  return (
                    <TableHead
                      key={header.id}
                      className="text-sm font-bold text-gray-900 px-6 py-4"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={canSort ? "flex items-center gap-2 cursor-pointer select-none hover:text-gray-700" : ""}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <span className="ml-1">
                              {sortDirection === false ? (
                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                              ) : sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4 text-gray-700" />
                              ) : (
                                <ArrowDown className="w-4 h-4 text-gray-700" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4">
        {/* Información de registros */}
        <div className="text-sm text-gray-600">
          {total > 0 ? `Mostrando ${from} a ${to} de ${total} registros` : 'No hay registros'}
        </div>

        {/* Controles de paginación */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {/* Números de página */}
          <div className="flex items-center gap-1">
            {(() => {
              const pages: (number | string)[] = [];
              
              // Si hay pocas páginas, mostrar todas
              if (pageCount <= 7) {
                for (let i = 0; i < pageCount; i++) {
                  pages.push(i);
                }
              } else {
                // Mostrar primera página
                pages.push(0);
                
                // Calcular rango de páginas alrededor de la actual
                let start = Math.max(1, pageIndex - 1);
                let end = Math.min(pageCount - 2, pageIndex + 1);
                
                // Ajustar si estamos cerca del inicio
                if (pageIndex <= 2) {
                  end = Math.min(4, pageCount - 2);
                }
                
                // Ajustar si estamos cerca del final
                if (pageIndex >= pageCount - 3) {
                  start = Math.max(1, pageCount - 5);
                }
                
                // Agregar elipsis y páginas intermedias
                if (start > 1) {
                  pages.push("...");
                }
                
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }
                
                if (end < pageCount - 2) {
                  pages.push("...");
                }
                
                // Mostrar última página
                if (pageCount > 1) {
                  pages.push(pageCount - 1);
                }
              }
              
              return pages.map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                
                const pageNumber = page as number;
                const isActive = pageNumber === pageIndex;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-full ${isActive ? "" : ""}`}
                  >
                    {pageNumber + 1}
                  </Button>
                );
              });
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="rounded-full"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Por página:</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

