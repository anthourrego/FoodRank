import type { AxiosInstance } from "axios"


export class CitiesServices {

  private endpoint = "/cities"
  private apiClient: AxiosInstance

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient
  }


  async getCities({ signal }: { signal: AbortSignal }) {
    const response = await this.apiClient.get(`${this.endpoint}`, { signal })
    return response.data
  }





}