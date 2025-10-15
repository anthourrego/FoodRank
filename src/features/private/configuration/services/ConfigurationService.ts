import type { AxiosInstance } from "axios"
import type { TypeFormSchemaConfiguration } from "../models/FormSchemaConfiguration"

export class ConfigurationService {

    private endpoint = "/configurations"
    private apiClient: AxiosInstance

    constructor(apiClient: AxiosInstance) {
        this.apiClient = apiClient
    }

    async createConfiguration(configuration: TypeFormSchemaConfiguration) {
        const response = await this.apiClient.postForm(`${this.endpoint}`, configuration)
        return response.data
    }

    async getConfigurations({signal}: {signal: AbortSignal}) {
        const response = await this.apiClient.get(`${this.endpoint}`, {signal})
        return response.data
    }

    async showConfigurationEvent({signal, eventId}: {signal: AbortSignal, eventId: number}) {
        const response = await this.apiClient.get(`${this.endpoint}/event/${eventId}`, {signal})
        return response.data
    }



}