

import { findProductEvents } from "../service/productEventsService"
import type { IDataQr } from "../qr/GenerateQr"

export const useFilterProductsEvents = () => {

  async function filterProductToRate(dataQr: IDataQr) {
    const result = await findProductEvents(dataQr)

    return result
  }

  return { filterProductToRate }
}