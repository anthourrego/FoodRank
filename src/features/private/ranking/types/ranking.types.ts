export type RankingItem = {
  product_name: string
  product_image: string
  avg_rating: number
  total_reviews: number
  total_comments?: number
  restaurant_name: string
  detail?: Record<string, number>
  event_product_id?: number
}

export type EventSummary = {
  id: number
  name: string
}

export type ReviewItem = {
  id: number
  rating: number
  comment: string | null
  ip: string
  created_at: string
  product_name: string
  product_id: number
  product_image: string
  restaurant_name: string
  restaurant_id: number
}

export type PaginatedRankingResponse = {
  current_page: number
  data: ReviewItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type ViewMode = 'cards' | 'table'

