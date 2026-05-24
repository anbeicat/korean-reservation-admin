import type { ReservationStatus, ViewKey } from '../types'

export const businessHours = {
  openHour: 10,
  closeHour: 19,
  intervalMinutes: 5,
}

// 状态显示设置：状态值保留英文，页面显示韩文标签。
export const statusColor: Record<ReservationStatus, string> = {
  REQUESTED: 'gold',
  CONFIRMED: 'green',
  COMPLETED: 'blue',
  CANCELED: 'red',
}

export const statusLabel: Record<ReservationStatus, string> = {
  REQUESTED: '요청',
  CONFIRMED: '확정',
  COMPLETED: '완료',
  CANCELED: '취소',
}

export const nextStatus: Partial<Record<ReservationStatus, ReservationStatus>> = {
  REQUESTED: 'CONFIRMED',
  CONFIRMED: 'COMPLETED',
}

export function formatWon(value: number) {
  return `₩${value.toLocaleString('ko-KR')}`
}

export function isValidBusinessTime(hour: number, minute: number) {
  const totalMinutes = hour * 60 + minute
  const openMinutes = businessHours.openHour * 60
  const closeMinutes = businessHours.closeHour * 60

  return (
    totalMinutes >= openMinutes &&
    totalMinutes < closeMinutes &&
    minute % businessHours.intervalMinutes === 0
  )
}

export function viewTitle(view: ViewKey) {
  const titleMap: Record<ViewKey, string> = {
    dashboard: '대시보드',
    reservations: '예약 관리',
    services: '서비스 관리',
    customers: '고객 관리',
  }

  return titleMap[view]
}
