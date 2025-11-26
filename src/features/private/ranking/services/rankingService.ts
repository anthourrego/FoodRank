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

  async getRankingPaginated(event_id: number, page: number = 1, perPage: number = 10) {
    const result = await axios.get(`${this.urlBack}reviews/ranking-list/event/${event_id}`, {
      params: {
        paginate: true,
        page,
        rows: perPage
      }
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


