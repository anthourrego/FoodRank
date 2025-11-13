import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import { format } from "@formkit/tempo"


import { Link } from "react-router"

interface ListEventsProps {
  filteredEvents: OptionItem[]
}

function CartEmpty() {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron eventos</h3>
        <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
      </CardContent>
    </Card>
  )
}


export function ListEvents({ filteredEvents }: ListEventsProps) {
  console.log({filteredEvents})
  return (
    <>
      {filteredEvents.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
          

              <CardHeader className="pb-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Fecha y hora */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{format((event.start_date),"medium") + " - " + format((event.end_date),"medium")}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        {format((event.start_date),{time:"short"},'en')} - {format((event.end_date),{time:"short"},'en')}
                      </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event?.city?.name}</p>
                    <p className="text-sm text-gray-600">{event?.city?.name}</p>
                  </div>
                </div>

                {/* Participantes */}
                {/* <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Participantes</span>
                      <span className="font-medium text-gray-900">
                        {event.participants}/{event.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-800/80 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>
                </div> */}


                {/* Botón de acción */}
                <Link to={`/events-products/${event.id}`}>
                  <Button className="w-full bg-red-800/80 hover:bg-red-800 text-white group/btn">
                    Ver detalles del evento
                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}