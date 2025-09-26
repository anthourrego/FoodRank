
interface Product {
  id: number
  name: string
  image: string
  description: string
  restaurant: Restaurant
  rating: number
  totalRatings: number
}


interface OptionItem{
  value:string|number,
  label:string
  data?:unknown
}