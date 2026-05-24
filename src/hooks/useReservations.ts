import { useMemo, useState } from 'react'
import type { Dayjs } from 'dayjs'
import { createReservationMock, updateReservationMock, updateReservationStatusMock } from '../api/reservationApi'
import type { NewReservationFormValues, Reservation, ReservationStatus } from '../types'
import { nextStatus } from '../utils/reservation'

type UseReservationsParams = {
  initialReservations: Reservation[]
  onStatusChanged?: (status: ReservationStatus) => void
  onCreated?: () => void
  onUpdated?: () => void
  onError?: (message: string) => void
}

export function useReservations({
  initialReservations,
  onStatusChanged,
  onCreated,
  onUpdated,
  onError,
}: UseReservationsParams) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [dateFilterValue, setDateFilterValue] = useState<Dayjs | null>(null)
  const [keywordFilter, setKeywordFilter] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isCreatingReservation, setIsCreatingReservation] = useState(false)
  const [reservationActionId, setReservationActionId] = useState<number | null>(null)

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
  async function advanceReservation(id: number) {
    const reservation = reservations.find((item) => item.id === id)
    const status = reservation ? nextStatus[reservation.status] : undefined

    if (status) {
      await updateReservationStatus(id, status)
    }
  }

  // 预约取消：只把当前选中的预约改成取消状态。
  async function cancelReservation(id: number) {
    await updateReservationStatus(id, 'CANCELED')
  }

  // 状态更新：同时更新列表和当前详情抽屉中的预约。
  async function updateReservationStatus(id: number, status: ReservationStatus) {
    const reservation = reservations.find((item) => item.id === id)

    if (!reservation) {
      onError?.('예약 정보를 찾을 수 없습니다')
      return
    }

    setReservationActionId(id)

    try {
      const updatedReservation = await updateReservationStatusMock(reservation, status)

      setReservations((current) => current.map((item) => (item.id === id ? updatedReservation : item)))
      setSelectedReservation((current) => (current?.id === id ? updatedReservation : current))
      onStatusChanged?.(status)
    } catch {
      onError?.('예약 상태 변경에 실패했습니다')
    } finally {
      setReservationActionId(null)
    }
  }

  // 新增预约：通过 API 适配层创建预约对象，再追加到列表 state。
  async function createReservation(values: NewReservationFormValues) {
    setIsCreatingReservation(true)

    try {
      const createdReservation = await createReservationMock(values)

      setReservations((current) => [...current, createdReservation])
      onCreated?.()
      return true
    } catch {
      onError?.('새 예약 등록에 실패했습니다')
      return false
    } finally {
      setIsCreatingReservation(false)
    }
  }

  // 预约编辑：保存顾客、服务、日期、时间和备注的修改。
  async function updateReservation(id: number, values: NewReservationFormValues) {
    const reservation = reservations.find((item) => item.id === id)

    if (!reservation) {
      onError?.('예약 정보를 찾을 수 없습니다')
      return false
    }

    setReservationActionId(id)

    try {
      const updatedReservation = await updateReservationMock(reservation, values)

      setReservations((current) => current.map((item) => (item.id === id ? updatedReservation : item)))
      setSelectedReservation((current) => (current?.id === id ? updatedReservation : current))
      onUpdated?.()
      return true
    } catch {
      onError?.('예약 정보 수정에 실패했습니다')
      return false
    } finally {
      setReservationActionId(null)
    }
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
    isCreatingReservation,
    reservationActionId,
    setStatusFilter,
    setKeywordFilter,
    setSelectedReservation,
    advanceReservation,
    cancelReservation,
    createReservation,
    updateReservation,
    resetReservationFilters,
    handleDateFilterChange,
  }
}
