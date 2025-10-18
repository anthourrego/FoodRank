export type EventRow = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  city: { id: number; name: string }
}