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

  
}


