import axios from "axios"

export class RankingService {

  private urlBack

  constructor() {
    this.urlBack = import.meta.env.VITE_URL_BACK
  }

  async getRanking(event_id: number) {
    const result = await axios.get(`${this.urlBack}reviews/ranking/event/${event_id}`)
    return result
  }

  async getRankingPaginated(event_id: number, page: number = 1, perPage: number = 10, sort?: string, search?: string) {
    const params: Record<string, string | number | boolean> = {
      paginate: true,
      page,
      rows: perPage
    }
    
    if (sort) {
      params.sort = sort
    }

    if (search) {
      params['filter[search]'] = search
    }
    
    const result = await axios.get(`${this.urlBack}reviews/ranking-list/event/${event_id}`, {
      params
    })
    return result
  }

  async exportRankingToExcel(event_id: number) {
    const result = await axios.get(`${this.urlBack}reviews/ranking-list/event/${event_id}/export`, {
      responseType: 'blob'
    })
    return result
  }

  
}


