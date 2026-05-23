import type { Dayjs } from 'dayjs'

// 页面类型：控制左侧菜单切换后显示哪个页面。
export type ViewKey = 'dashboard' | 'reservations' | 'services' | 'customers'

// 预约状态：保留英文常量，方便以后和后端 API 对接。
export type ReservationStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'

// 业务类型：服务项目、预约、顾客。
export type Service = {
  id: string
  name: string
  duration: number
  price: number
  bookings: number
  status: 'ACTIVE' | 'INACTIVE'
}

export type Reservation = {
  id: number
  reservationDate: string
  time: string
  customer: string
  phone: string
  serviceId: string
  status: ReservationStatus
  memo?: string
}

export type Customer = {
  name: string
  phone: string
  visits: number
  lastVisit: string
}

export type ReservationSummary = {
  today: number
  confirmed: number
  revenue: number
  cancelRate: number
  activeServices: number
  totalServices: number
}

export type NewReservationFormValues = {
  customer: string
  phone: string
  serviceId: string
  date: Dayjs
  time: Dayjs
  memo?: string
}

export type ServiceFormValues = {
  name: string
  duration: number
  price: number
}
