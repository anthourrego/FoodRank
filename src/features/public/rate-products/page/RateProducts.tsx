import { RateProductGrid } from "../components/RateProductGrid"
import { ChevronDown } from "lucide-react";

import { useCheckIsMobile } from "@/hooks/useCheckIsMobile";
import { useParams } from "react-router";
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents";
import LoadingProduct from "../../rate-products-voting/page/LoadingProduct";
import { useQueryServiceConfig } from "@/features/private/configuration/hook/useQueryServiceConfig";
import { useEffect, useState } from "react";
import type { ConfigurationModel } from "@/features/private/configuration/models/Configuration";


function RateProducts(){ 
  const {eventId} = useParams()
  const {showScrollIndicator} = useCheckIsMobile()
  const {GetProductsByEvent} = useQueryServiceEvents()
  const [configurationEvent, setConfigurationEvent] = useState<ConfigurationModel[] | null>(null)
  const {data: productsByEvent, isLoading: isLoadingProductsByEvent, error: errorProductsByEvent, isError: isErrorProductsByEvent, isSuccess: isSuccessProductsByEvent} = GetProductsByEvent(Number(eventId))
  const {GetConfigurationEvent} = useQueryServiceConfig()
  const {data: configurationEventData, isLoading: isLoadingConfigurationEvent, error: errorConfigurationEvent, isError: isErrorConfigurationEvent, isSuccess: isSuccessConfigurationEvent} = GetConfigurationEvent(Number(eventId))

  useEffect(() => {
    if(isSuccessProductsByEvent && isSuccessConfigurationEvent){
      setConfigurationEvent(configurationEventData?.data)
      console.log({configurationEvent:configurationEventData?.data})
    }
  }, [ isSuccessConfigurationEvent])

  if(isLoadingProductsByEvent || isLoadingConfigurationEvent){
    return <LoadingProduct />
  }




  return(
    <div className="w-full h-full overflow-auto bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      
      
      <RateProductGrid productsEvents={productsByEvent?.data || []} configurationEvent={configurationEvent} />
      
      

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-200/40  px-3 py-3 rounded-lg  flex flex-col items-center">
            <div className="relative h-4 w-6 flex flex-col items-center justify-center">
              
              <ChevronDown
                className="w-5 h-5 text-red-600 absolute cascade-arrow-1"
                strokeWidth={2.5}
              />

              
              <ChevronDown
                className="w-5 h-5 text-red-500 absolute cascade-arrow-2"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RateProducts