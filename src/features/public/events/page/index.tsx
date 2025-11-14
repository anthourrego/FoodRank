import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import { Header } from "../components/Header"
import { Loading } from "@/components/ui/loading"
import { useEffect, useState } from "react"
import { FiltersEvents } from "../components/FiltersEvents"
import { ListEvents } from "../components/ListEvents"
import { Footer } from "@/components/footer"
import { Link, Navigate } from "react-router"
import logo from '@/assets/images/logo.webp'


function TopBar() {
  return (
    <header className="bg-red-800/80 backdrop-blur-sm text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <nav className="flex items-center space-x-8">
            <Link to="/events" className="hover:text-red-200 transition-colors">
              Inicio
            </Link>
          </nav>
          <div className="flex items-center">
            <Link to="/events">
              <img src={logo} alt="Food Rank" className="h-12 w-auto" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

type EventItem = {
  id: number
  name: string
  city: { id: number; name: string }
}

function Events() {
  const [searchTerm, setSearchTerm] = useState("")
  const [citiesEvents, setCitiesEvents] = useState<OptionItem[]>([])
  const [selectedCity, setSelectedCity] = useState<number>(0)
  const [filteredEvents, setFilteredEvents] = useState<OptionItem[]>([])
  const { GetEvents } = useQueryServiceEvents()
  const { data: eventsData, isLoading: isLoadingEvents } = GetEvents()

  useEffect(() => {
    if (eventsData?.data?.length > 0) {
      const listCities = eventsData.data.map((event: EventItem) => {
        return {
          value: event.city.id,
          label: event.city.name,
          data: event.city
        }
      })
      //eliminar duplicados
      const uniqueCities = listCities.filter((city: OptionItem, index: number, self: OptionItem[]) =>
        index === self.findIndex((t: OptionItem) => t.value === city.value)
      )
      setCitiesEvents(uniqueCities)
    }
  }, [eventsData])

  useEffect(() => {
    if (eventsData?.data?.length > 0) {
      const filteredEvents = eventsData.data.filter((event: EventItem) => {
        if (selectedCity === 0 && searchTerm === "") {
          return true
        }
        if (selectedCity !== 0) {
          return event.city.id === selectedCity
        }
        if (searchTerm !== "") {
          return event.name.toLowerCase().includes(searchTerm.toLowerCase())
        }

      })
      setFilteredEvents(filteredEvents)

    }
  }, [selectedCity, searchTerm, eventsData])

  console.log({ filteredEvents, eventsData: eventsData?.data, selectedCity, searchTerm })

  if (isLoadingEvents) return <Loading className="min-h-screen flex items-center justify-center" />

  if(eventsData?.data?.length === 1){
    return <Navigate to={`/events-products/${eventsData?.data[0].id}`} replace />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
      
      <div className="container mx-auto px-4 py-8">

      <Header activeEventsCount={eventsData?.data?.length || 0} />
      <FiltersEvents searchTerm={searchTerm} setSearchTerm={setSearchTerm} cities={citiesEvents} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      <div className="mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold text-gray-900">{filteredEvents.length}</span> evento
          {filteredEvents.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ListEvents filteredEvents={filteredEvents} />
      </div>
      
    </div>
  )
}

export default Events