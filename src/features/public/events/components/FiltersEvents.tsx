import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, MapPin, Search } from "lucide-react"

interface FiltersEventsProps {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  cities: OptionItem[]
  selectedCity: number
  setSelectedCity: (city: number) => void
}

export function FiltersEvents({ searchTerm, setSearchTerm, cities, selectedCity, setSelectedCity }: FiltersEventsProps) {
  

  return (
    <Card className="mb-8 shadow-lg border">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda por nombre */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Buscar eventos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filtro por ciudad */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Ciudad</Label>
            <Select value={selectedCity.toString()} onValueChange={(value) => setSelectedCity(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona ciudad" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value?.toString()}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {city.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
        </div>

        {/* Botón para limpiar filtros */}
          {(searchTerm || selectedCity !== 0) && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCity(0)
              }}
              className="w-full md:w-auto"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}