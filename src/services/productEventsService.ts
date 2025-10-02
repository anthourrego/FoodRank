import type { IDataQr } from "@/features/private/qr/GenerateQr"
import axios from "axios"


const urlBack = import.meta.env.VITE_URL_BACK
const getProductsEvents = async () => {

  try {
    const resultProducts = await axios.get(`${urlBack}events-products`)
    const { data } = resultProducts
    return data
  } catch (error) {
    console.log(error)
  }

}

const findProductEvents = async ({ branch_id, event_id, product_id }: IDataQr) => {
  try {
    const resultProducts = await axios.get(`${urlBack}events-products/find?idProduct=${product_id}&idEvent=${event_id}&idBranch=${branch_id}`)
    const { data } = resultProducts
    return data
  } catch (error) {
    console.log(error)
  }

}
export {
  getProductsEvents,
  findProductEvents
}