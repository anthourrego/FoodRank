import axios from "axios"
import type { IDataScan } from "../rate-products-voting/page/RateProductsVoting"

const urlBack = import.meta.env.VITE_URL_BACK
const getProductsEvents = async ()=>{
  
  try{
    const resultProducts  = await axios.get(`${urlBack}events-products`)
    const {data} = resultProducts
    return data
  }catch(error){
    console.log(error)
  }
  
}

const findProductEvents = async({id_event,id_product}:IDataScan)=>{
  try{
    const resultProducts  = await axios.get(`${urlBack}events-products/find?idProduct=${id_product}&idEvent=${id_event}`)
    const {data} = resultProducts
    return data
  }catch(error){
    console.log(error)
  }
  
}
export {
  getProductsEvents,
  findProductEvents
}