import { Badge } from "@/components/ui/badge"
import { Calendar, Sparkles } from "lucide-react"

interface HeaderProps {
  activeEventsCount: number
}


export const Header = ({ activeEventsCount }: HeaderProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Calendar className="w-10 h-10 text-red-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Eventos Gastronómicos
          </h1>
          <Sparkles className="w-10 h-10 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
          Descubre y participa en los mejores eventos degastronomía
        </p>

        {/* Estadísticas rápidas */}
        <div className="flex gap-4 justify-center mt-6">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-base">
            {activeEventsCount} Evento{activeEventsCount !== 1 ? "s" : ""} Activo{activeEventsCount !== 1 ? "s" : ""}
          </Badge>

        </div>
      </div>
    </div>
  )
}
