import type { TypeFormSchemaManageEvents } from "@/features/private/manage-events/models/FormSchemaManageEvents"
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

    async createEvent(data: TypeFormSchemaManageEvents) {
        const response = await this.apiClient.post(`${this.endpoint}`, data)
        return response.data
    }

    async updateEvent(id: number, data: Partial<{
        name: string
        description: string
        start_date: string
        end_date: string
        is_active: boolean
        city_id: number
    }>) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, data)
        return response.data
    }



}