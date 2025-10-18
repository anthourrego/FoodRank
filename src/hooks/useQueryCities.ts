import apiClient from "@/api/axiosInstance"
import { CitiesServices } from "@/services/CitiesService"
import { useQuery, useQueryClient } from "@tanstack/react-query"




export const useQueryServiceCities = () => {
  const queryClient = useQueryClient()
  
  const citiesService = new CitiesServices(apiClient)


  const GetCities = () => useQuery({
    queryKey: ['get-cities'],
    queryFn: ({signal}) => citiesService.getCities({signal}),
  })




  return {
    GetCities,
    
  }
}