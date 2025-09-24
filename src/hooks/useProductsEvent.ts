
import { useEffect, useState } from "react"
import { getProductsEvents } from "../services/productEventsService"
import type { EventProduct } from "@/models/interfaces"

export const useProductsEvents = ()=>{
  const [productsEvents,setProductEvents]  = useState<EventProduct[]>([])

  async function productsOnEvents(){
    const result = await getProductsEvents()
    setProductEvents(result)
  }
  useEffect(()=>{
    productsOnEvents()
  },[])
  return {
    productsEvents
  }
}