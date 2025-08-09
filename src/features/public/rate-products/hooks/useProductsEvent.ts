
import { useEffect, useState } from "react"
import { getProductsEvents } from "../services/productEventsService"

export const useProductsEvents = ()=>{
  const [productsEvents,setProductEvents]  = useState([])

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