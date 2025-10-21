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

    async getAllEvents({signal}: {signal: AbortSignal}) {
        const response = await this.apiClient.get(`${this.endpoint}`, {signal})
        return response.data
    }

    async getProductsByEvent({signal, eventId}: {signal: AbortSignal, eventId: number}) {
        const response = await this.apiClient.get(`${this.endpoint}/products-event/${eventId}`, {signal})
        return response.data
    }

    async addProductToEvent(eventId: number, productId: number) {
        const response = await this.apiClient.post(`${this.endpoint}/products-event/${eventId}`, { product_id: productId })
        return response.data
    }

    async removeProductFromEvent(eventId: number, productId: number) {
        const response = await this.apiClient.delete(`${this.endpoint}/products-event/${eventId}/${productId}`)
        return response.data
    }

    async saveBranchesForProductEvent(eventId: number, productId: number, branchIds: number[]) {
        const response = await this.apiClient.post(`${this.endpoint}/products-event/${eventId}/${productId}/branches`, { branch_ids: branchIds })
        return response.data
    }

    async createEvent(data: TypeFormSchemaManageEvents) {
        const response = await this.apiClient.post(`${this.endpoint}`, data)
        return response.data
    }

    async updateEvent(data: TypeFormSchemaManageEvents) {
        const response = await this.apiClient.put(`${this.endpoint}/${data.id}`, data)
        return response.data
    }



}