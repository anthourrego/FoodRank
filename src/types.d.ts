interface Restaurant {
  name: string
  locations: string[]
  addresses: string[]
  socialMedia: {
    instagram: string
    facebook: string
  }
  owner: string
}

interface Product {
  id: number
  name: string
  image: string
  description: string
  restaurant: Restaurant
  rating: number
  totalRatings: number
}


