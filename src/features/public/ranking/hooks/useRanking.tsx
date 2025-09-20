import { useState } from "react"
import { RankingService } from "../services/rankingService"


export const useRanking = () => {
  const [ranking, setRanking] = useState<any[]>([])
  const rankingService = new RankingService()

  async function getRanking(event_id: number) {
    const result = await rankingService.getRanking(event_id)
    const dataRanking = result.data
    setRanking(dataRanking)
  }
  
  return {
    ranking,
    getRanking
  }
}