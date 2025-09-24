import axios from "axios"

export class ReviewService {

  private urlBack

  constructor() {
    this.urlBack = import.meta.env.VITE_URL_BACK
  }

  async saveReview(dataVote: any) {
    const result = await axios.post(`${this.urlBack}reviews/save-vote`, dataVote)
    return result
  }

  
}


