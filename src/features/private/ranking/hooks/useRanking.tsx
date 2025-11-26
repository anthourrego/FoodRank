import { useState, useCallback, useMemo } from "react"
import { RankingService } from "../services/rankingService"
import type { RankingItem, PaginatedRankingResponse } from "../types/ranking.types"


export const useRanking = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [paginatedRanking, setPaginatedRanking] = useState<PaginatedRankingResponse>({
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 10,
    prev_page_url: null,
    to: 0,
    total: 0
  })
  const [isLoadingExport, setIsLoadingExport] = useState(false)
  
  const rankingService = useMemo(() => new RankingService(), [])

  const getRanking = useCallback(async (event_id: number) => {
    const result = await rankingService.getRanking(event_id)
    const dataRanking = result.data
    setRanking(dataRanking)
  }, [rankingService])

  const getRankingPaginated = useCallback(async (event_id: number, page: number = 1, perPage: number = 10) => {
    const result = await rankingService.getRankingPaginated(event_id, page, perPage)
    setPaginatedRanking(result.data)
  }, [rankingService])

  const exportToExcel = useCallback(async (event_id: number, eventName: string) => {
    try {
      setIsLoadingExport(true)
      const result = await rankingService.exportRankingToExcel(event_id)
      
      // Descargar el archivo Excel generado por el backend
      const url = window.URL.createObjectURL(new Blob([result.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `ranking_${eventName}_${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exportando a Excel:', error)
      throw error
    } finally {
      setIsLoadingExport(false)
    }
  }, [rankingService])
  
  return {
    ranking,
    paginatedRanking,
    isLoadingExport,
    getRanking,
    getRankingPaginated,
    exportToExcel
  }
}