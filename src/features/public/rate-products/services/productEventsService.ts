import axios from "axios"

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
export {
  getProductsEvents
}