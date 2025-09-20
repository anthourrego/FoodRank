import axios from "axios"

export class RankingEventProductService {

  private urlBack

  constructor() {
    this.urlBack = import.meta.env.VITE_URL_BACK
  }

  async getRanking(eventProductId: number) {
    const result = await axios.get(`${this.urlBack}reviews/ranking/event-product/${eventProductId}`)
    return result
  }

  
}


