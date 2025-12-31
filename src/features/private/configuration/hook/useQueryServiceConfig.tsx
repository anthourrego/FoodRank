import apiClient from "@/api/axiosInstance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ConfigurationService } from "../services/ConfigurationService"
import type { TypeFormSchemaConfiguration } from "../models/FormSchemaConfiguration"
import { toast } from "sonner"

export const useQueryServiceConfig = () => {
  const queryClient = useQueryClient()
  
  const configurationService = new ConfigurationService(apiClient)


  const mutateCreateConfiguration = useMutation({
    mutationFn: (configuration: TypeFormSchemaConfiguration) => configurationService.createConfiguration(configuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] })
    },
    onError: (error) => {
      const errorMessage =  error?.message || "Error al crear la configuración"
      toast.error(errorMessage)
    }
  })

  const GetConfigurations = (eventId?: number)=>useQuery({
    queryKey: eventId ? ['configurations', eventId] : ['configurations'],
    queryFn: ({signal}) => configurationService.getConfigurations({signal, eventId}),
  })

  const GetConfigurationEvent = (eventId: number) => useQuery({
    queryKey: ['configuration-event', eventId],
    queryFn: ({signal}) => configurationService.showConfigurationEvent({signal, eventId}),
    enabled: eventId !== undefined && eventId !== null,
  })



  return {
    mutateCreateConfiguration,
    GetConfigurations,
    GetConfigurationEvent
  }
}