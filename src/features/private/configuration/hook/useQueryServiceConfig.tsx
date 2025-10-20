import apiClient from "@/api/axiosInstance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ConfigurationService } from "../services/ConfigurationService"
import type { TypeFormSchemaConfiguration } from "../models/FormSchemaConfiguration"

export const useQueryServiceConfig = () => {
  const queryClient = useQueryClient()
  
  const configurationService = new ConfigurationService(apiClient)


  const mutateCreateConfiguration = useMutation({
    mutationFn: (configuration: TypeFormSchemaConfiguration) => configurationService.createConfiguration(configuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const GetConfigurations = ()=>useQuery({
    queryKey: ['configurations'],
    queryFn: ({signal}) => configurationService.getConfigurations({signal}),
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