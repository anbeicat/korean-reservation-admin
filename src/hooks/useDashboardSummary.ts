import { useMemo } from 'react'
import type { Reservation, Service } from '../types'

type UseDashboardSummaryParams = {
  reservations: Reservation[]
  services: Service[]
  activeServices: Service[]
  serviceById: Map<string, Service>
}

export function useDashboardSummary({
  reservations,
  services,
  activeServices,
  serviceById,
}: UseDashboardSummaryParams) {
  // Dashboard 摘要：真实项目中通常来自统计 API，这里先用前端数据模拟。
  return useMemo(() => {
    const canceled = reservations.filter((reservation) => reservation.status === 'CANCELED').length
    const revenue = reservations
      .filter((reservation) => reservation.status !== 'CANCELED')
      .reduce((sum, reservation) => sum + (serviceById.get(reservation.serviceId)?.price ?? 0), 0)

    return {
      today: reservations.length,
      confirmed: reservations.filter((reservation) => reservation.status === 'CONFIRMED').length,
      revenue,
      cancelRate: reservations.length ? Math.round((canceled / reservations.length) * 100) : 0,
      activeServices: activeServices.length,
      totalServices: services.length,
    }
  }, [reservations, serviceById, activeServices.length, services.length])
}
