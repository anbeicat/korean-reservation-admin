import { useMemo, useState } from 'react'
import type { Dayjs } from 'dayjs'
import { createReservationMock, updateReservationStatusMock } from '../api/reservationApi'
import type { NewReservationFormValues, Reservation, ReservationStatus } from '../types'
import { nextStatus } from '../utils/reservation'

type UseReservationsParams = {
  initialReservations: Reservation[]
  onStatusChanged?: (status: ReservationStatus) => void
  onCreated?: () => void
}

export function useReservations({ initialReservations, onStatusChanged, onCreated }: UseReservationsParams) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [dateFilterValue, setDateFilterValue] = useState<Dayjs | null>(null)
  const [keywordFilter, setKeywordFilter] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // 派生数据：根据当前状态、日期、关键词筛选条件得到表格要显示的预约。
  const filteredReservations = useMemo(() => {
    const normalizedKeyword = keywordFilter.trim().toLowerCase()

    return reservations
      .filter((reservation) => {
        const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter
        const matchesDate = !dateFilter || reservation.reservationDate === dateFilter
        const matchesKeyword =
          !normalizedKeyword ||
          reservation.customer.toLowerCase().includes(normalizedKeyword) ||
          reservation.phone.includes(normalizedKeyword)

        return matchesStatus && matchesDate && matchesKeyword
      })
      .sort((a, b) => `${a.reservationDate} ${a.time}`.localeCompare(`${b.reservationDate} ${b.time}`))
  }, [reservations, statusFilter, dateFilter, keywordFilter])

  // 状态流转：请求 -> 确定 -> 完成。
  function advanceReservation(id: number) {
    const reservation = reservations.find((item) => item.id === id)
    const status = reservation ? nextStatus[reservation.status] : undefined

    if (status) {
      updateReservationStatus(id, status)
    }
  }

  // 预约取消：只把当前选中的预约改成取消状态。
  function cancelReservation(id: number) {
    updateReservationStatus(id, 'CANCELED')
  }

  // 状态更新：同时更新列表和当前详情抽屉中的预约。
  function updateReservationStatus(id: number, status: ReservationStatus) {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id ? updateReservationStatusMock(reservation, status) : reservation,
      ),
    )
    setSelectedReservation((current) => (current?.id === id ? updateReservationStatusMock(current, status) : current))
    onStatusChanged?.(status)
  }

  // 新增预约：通过 API 适配层创建预约对象，再追加到列表 state。
  function createReservation(values: NewReservationFormValues) {
    const createdReservation = createReservationMock(values)

    setReservations((current) => [...current, createdReservation])
    onCreated?.()
  }

  // 筛选重置：清空关键词、日期和状态筛选。
  function resetReservationFilters() {
    setKeywordFilter('')
    setDateFilter(null)
    setDateFilterValue(null)
    setStatusFilter('ALL')
  }

  function handleDateFilterChange(value: Dayjs | null) {
    setDateFilterValue(value)
    setDateFilter(value ? value.format('YYYY-MM-DD') : null)
  }

  return {
    reservations,
    filteredReservations,
    statusFilter,
    dateFilterValue,
    keywordFilter,
    selectedReservation,
    setStatusFilter,
    setKeywordFilter,
    setSelectedReservation,
    advanceReservation,
    cancelReservation,
    createReservation,
    resetReservationFilters,
    handleDateFilterChange,
  }
}
