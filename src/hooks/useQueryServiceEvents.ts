import apiClient from "@/api/axiosInstance"

import { EventsServices } from "@/services/EventsServices"
import { useQuery, useQueryClient } from "@tanstack/react-query"


export const useQueryServiceEvents = () => {
  const queryClient = useQueryClient()
  
  const eventsService = new EventsServices(apiClient)


  const GetEvents = () => useQuery({
    queryKey: ['events-active'],
    queryFn: ({signal}) => eventsService.getEvents({signal}),
  })

  const GetProductsByEvent = (eventId: number) => useQuery({
    queryKey: ['products-by-event', eventId],
    queryFn: ({signal}) => eventsService.getProductsByEvent({signal, eventId}),
  })


  return {
    GetEvents,
    GetProductsByEvent
  }
}