import { useState } from "react"
import { RankingEventProductService } from "../services/rankingEventProduct"



export const useRankingEventProduct = () => {
  const [rankingEventProduct, setRankingEventProduct] = useState<any[]>([])
  const rankingEventProductService = new RankingEventProductService()

  async function getRanking(eventProductId: number) {
    const result = await rankingEventProductService.getRanking(eventProductId)
    const dataRanking = result.data
    setRankingEventProduct(dataRanking)
  }
  
  return {
    rankingEventProduct,
    getRanking
  }
}