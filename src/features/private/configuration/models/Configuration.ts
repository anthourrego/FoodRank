export interface ConfigurationModel {
  id: number
  key: string
  value: string
  eventId: number
  type: 'text'|'image'|'boolean'|'number'|'banner'
  description: string
  isActive: 1 | 0
}