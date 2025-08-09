

import { findProductEvents } from "../service/productEventsService"
import type { IDataScan } from "../rate-products-voting/page/RateProductsVoting"

export const useFilterProductsEvents = ()=>{
  

  async function filterProductToRate({id_event,id_product}:IDataScan){
    const result = await findProductEvents({id_event,id_product})
    
    return result
  }

  return {
    
    filterProductToRate
  }
}