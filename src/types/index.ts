export interface Partner {
  id: number
  companyName: string
  tradeName?: string
  email: string
  phone?: string
  city?: string
  state?: string
  latitude: number
  longitude: number
  addressLine?: string
  isVerified: boolean
}

export interface Event {
  id: number
  partnerId: number
  title: string
  description?: string
  startsAt: string
  endsAt?: string
  category?: string
  price?: number
  isActive: boolean
  coverImageUrl?: string
}

export interface Reservation {
  id: number
  partnerId: number
  name?: string
  phone?: string
  people: number
  reservedAt: string
  status: string
  notes?: string
}

export interface Review {
  id: number
  partnerId: number
  userName: string
  rating: number
  text?: string
  createdAt: string
}

export interface Stats {
  views: number
  reservations: number
  events: number
  rating: number
  reviewsCount: number
  revenue: number
}
