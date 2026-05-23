import type { Customer, Reservation, Service } from '../types'

// Mock 数据：后续接后端时会替换成 API 返回的数据。
export const services: Service[] = [
  { id: 'hair-cut', name: '헤어컷', duration: 45, price: 35000, bookings: 8, status: 'ACTIVE' },
  { id: 'color', name: '컬러 시술', duration: 120, price: 120000, bookings: 4, status: 'ACTIVE' },
  { id: 'perm', name: '디지털 펌', duration: 150, price: 180000, bookings: 3, status: 'ACTIVE' },
  { id: 'scalp', name: '두피 케어', duration: 60, price: 65000, bookings: 5, status: 'ACTIVE' },
]

export const initialReservations: Reservation[] = [
  {
    id: 1,
    reservationDate: '2026-05-23',
    time: '10:00',
    customer: '김민지',
    phone: '010-1122-3344',
    serviceId: 'hair-cut',
    status: 'CONFIRMED',
    memo: '첫 방문',
  },
  {
    id: 2,
    reservationDate: '2026-05-23',
    time: '11:30',
    customer: '박지훈',
    phone: '010-2233-4455',
    serviceId: 'scalp',
    status: 'REQUESTED',
    memo: '두피가 민감함',
  },
  {
    id: 3,
    reservationDate: '2026-05-23',
    time: '13:00',
    customer: '이서연',
    phone: '010-3344-5566',
    serviceId: 'color',
    status: 'CONFIRMED',
    memo: '애쉬 브라운',
  },
  {
    id: 4,
    reservationDate: '2026-05-23',
    time: '15:30',
    customer: '최유나',
    phone: '010-4455-6677',
    serviceId: 'perm',
    status: 'CANCELED',
    memo: '일정 변경',
  },
  {
    id: 5,
    reservationDate: '2026-05-23',
    time: '17:00',
    customer: '정하민',
    phone: '010-5566-7788',
    serviceId: 'hair-cut',
    status: 'COMPLETED',
  },
]

export const customers: Customer[] = [
  { name: '김민지', phone: '010-1122-3344', visits: 3, lastVisit: '2026-05-22' },
  { name: '박지훈', phone: '010-2233-4455', visits: 1, lastVisit: '2026-05-22' },
  { name: '이서연', phone: '010-3344-5566', visits: 6, lastVisit: '2026-05-22' },
  { name: '최유나', phone: '010-4455-6677', visits: 2, lastVisit: '2026-05-21' },
  { name: '정하민', phone: '010-5566-7788', visits: 4, lastVisit: '2026-05-22' },
]
