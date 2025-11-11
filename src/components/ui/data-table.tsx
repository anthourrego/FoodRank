import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  btnCreate?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  btnCreate = null,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 h-11">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Buscar..."
            value={globalFilter ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setGlobalFilter(event.target.value)
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-full"
          />
        </div>
        <div>
          {
            btnCreate && (btnCreate)
          }
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-gray-500 uppercase tracking-wider px-6 "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-between py-4">
        {/* Información de registros */}
        <div className="text-sm text-gray-600">
          {(() => {
            const filteredRows = table.getFilteredRowModel().rows;
            const totalRows = filteredRows.length;
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const startRow = totalRows > 0 ? pageIndex * pageSize + 1 : 0;
            const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
            
            if (totalRows === 0) {
              return "No hay resultados";
            }
            
            return `Mostrando ${startRow} a ${endRow} de ${totalRows} resultados`;
          })()}
        </div>
        
        {/* Controles de paginación */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          
          {/* Números de página */}
          <div className="flex items-center space-x-1">
            {(() => {
              const pageCount = table.getPageCount();
              const currentPage = table.getState().pagination.pageIndex;
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
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(pageCount - 2, currentPage + 1);
                
                // Ajustar si estamos cerca del inicio
                if (currentPage <= 2) {
                  end = Math.min(4, pageCount - 2);
                }
                
                // Ajustar si estamos cerca del final
                if (currentPage >= pageCount - 3) {
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
                const isActive = pageNumber === currentPage;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNumber)}
                    className={isActive ? "" : ""}
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
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
