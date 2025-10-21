import apiClient from "@/api/axiosInstance"
import type { TypeFormSchemaManageEvents } from "@/features/private/manage-events/models/FormSchemaManageEvents"

import { EventsServices } from "@/services/EventsServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useQueryServiceEvents = () => {
  const queryClient = useQueryClient()
  
  const eventsService = new EventsServices(apiClient)


  const GetEvents = () => useQuery({
    queryKey: ['events-active'],
    queryFn: ({signal}) => eventsService.getEvents({signal}),
  })

  const GetAllEvents = () => useQuery({
    queryKey: ['all-events'],
    queryFn: ({signal}) => eventsService.getAllEvents({signal}),
  })

  const GetProductsByEvent = (eventId: number) => useQuery({
    queryKey: ['products-by-event', eventId],
    queryFn: ({signal}) => eventsService.getProductsByEvent({signal, eventId}),
  })

  const useAddProductToEventMutation = (eventId: number) => useMutation({
    mutationFn:(productId: number)=>eventsService.addProductToEvent(eventId, productId),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['products-by-event', eventId] })
    }
  })

  const useRemoveProductFromEventMutation = (eventId: number) => useMutation({
    mutationFn:(productId: number)=>eventsService.removeProductFromEvent(eventId, productId),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['products-by-event', eventId] })
    }
  })

  const useSaveBranchesForProductEventMutation = (eventId: number, productId: number) => useMutation({
    mutationFn:(branchIds: number[])=>eventsService.saveBranchesForProductEvent(eventId, productId, branchIds),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['products-by-event', eventId] })
    }
  })

  const createEventMutation = useMutation({
    mutationFn:(data:TypeFormSchemaManageEvents)=>eventsService.createEvent(data),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['all-events'] })
    }
  })

  const updateEventMutation = useMutation({
    mutationFn:(data:TypeFormSchemaManageEvents)=>eventsService.updateEvent(data),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['all-events'] })
    }
  })


  return {
    GetEvents,
    GetProductsByEvent,
    GetAllEvents,
    createEventMutation,
    updateEventMutation,
    useAddProductToEventMutation,
    useRemoveProductFromEventMutation,
    useSaveBranchesForProductEventMutation,
  }
}