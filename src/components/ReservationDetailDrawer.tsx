import { Button, Descriptions, Drawer, Space, Tag } from 'antd'
import type { Reservation, Service } from '../types'
import { formatWon, nextStatus, statusColor, statusLabel } from '../utils/reservation'

type ReservationDetailDrawerProps = {
  reservation: Reservation | null
  serviceById: Map<string, Service>
  onClose: () => void
  onAdvance: (id: number) => void
  onCancelReservation: (id: number) => void
}

export function ReservationDetailDrawer({
  reservation,
  serviceById,
  onClose,
  onAdvance,
  onCancelReservation,
}: ReservationDetailDrawerProps) {
  return (
    <Drawer title="예약 상세" width={420} open={Boolean(reservation)} onClose={onClose}>
      {reservation && (
        <Space orientation="vertical" size={16} className="full-width">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="예약일">{reservation.reservationDate}</Descriptions.Item>
            <Descriptions.Item label="예약 시간">{reservation.time}</Descriptions.Item>
            <Descriptions.Item label="고객명">{reservation.customer}</Descriptions.Item>
            <Descriptions.Item label="연락처">{reservation.phone}</Descriptions.Item>
            <Descriptions.Item label="서비스">{serviceById.get(reservation.serviceId)?.name}</Descriptions.Item>
            <Descriptions.Item label="금액">
              {formatWon(serviceById.get(reservation.serviceId)?.price ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Tag color={statusColor[reservation.status]}>{statusLabel[reservation.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="요청 메모">{reservation.memo || '요청 메모 없음'}</Descriptions.Item>
          </Descriptions>

          <Space>
            <Button type="primary" disabled={!nextStatus[reservation.status]} onClick={() => onAdvance(reservation.id)}>
              다음 상태로 변경
            </Button>
            <Button
              danger
              disabled={reservation.status === 'CANCELED'}
              onClick={() => onCancelReservation(reservation.id)}
            >
              예약 취소
            </Button>
          </Space>
        </Space>
      )}
    </Drawer>
  )
}
