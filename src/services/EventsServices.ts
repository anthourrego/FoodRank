import type { AxiosInstance } from "axios"


export class EventsServices {

    private endpoint = "/eventss"
    private apiClient: AxiosInstance

    constructor(apiClient: AxiosInstance) {
        this.apiClient = apiClient
    }


    async getEvents({signal}: {signal: AbortSignal}) {
        const response = await this.apiClient.get(`${this.endpoint}/active`, {signal})
        return response.data
    }

    async getProductsByEvent({signal, eventId}: {signal: AbortSignal, eventId: number}) {
        const response = await this.apiClient.get(`${this.endpoint}/products-event/${eventId}`, {signal})
        return response.data
    }



}