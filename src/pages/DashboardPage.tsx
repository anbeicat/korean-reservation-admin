import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Progress, Space, Statistic, Tag, Typography } from 'antd'
import type { Reservation, ReservationSummary, Service } from '../types'
import { formatWon, statusColor, statusLabel } from '../utils/reservation'

const { Text } = Typography

type DashboardPageProps = {
  summary: ReservationSummary
  reservations: Reservation[]
  services: Service[]
  serviceById: Map<string, Service>
  onNewReservation: () => void
}

export function DashboardPage({
  summary,
  reservations,
  services,
  serviceById,
  onNewReservation,
}: DashboardPageProps) {
  // 进度条基准值：避免服务列表为空时出现无效百分比。
  const maxBookings = Math.max(...services.map((service) => service.bookings), 1)

  return (
    <Space orientation="vertical" size={16} className="full-width">
      <div className="metric-grid">
        <Card>
          <Statistic title="오늘 예약" value={summary.today} suffix="건" />
        </Card>
        <Card>
          <Statistic title="확정 예약" value={summary.confirmed} suffix="건" />
        </Card>
        <Card>
          <Statistic title="예상 매출" value={summary.revenue} formatter={() => formatWon(summary.revenue)} />
        </Card>
        <Card>
          <Statistic title="취소율" value={summary.cancelRate} suffix="%" />
        </Card>
        <Card>
          <Statistic title="운영 서비스" value={summary.activeServices} suffix={`/ ${summary.totalServices}개`} />
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card
          title="오늘 일정"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={onNewReservation}>
              새 예약
            </Button>
          }
        >
          <Space orientation="vertical" size={10} className="full-width">
            {reservations
              .slice()
              .sort((a, b) => `${a.reservationDate} ${a.time}`.localeCompare(`${b.reservationDate} ${b.time}`))
              .map((reservation) => {
                const service = serviceById.get(reservation.serviceId)

                return (
                  <div className="schedule-row" key={reservation.id}>
                    <div>
                      <Text strong className="schedule-time">
                        {reservation.time}
                      </Text>
                      <br />
                      <Text type="secondary">{reservation.reservationDate}</Text>
                    </div>
                    <div>
                      <Text strong>{reservation.customer}</Text>
                      <br />
                      <Text type="secondary">
                        {service?.name} · {service?.duration}분
                      </Text>
                    </div>
                    <Tag color={statusColor[reservation.status]}>{statusLabel[reservation.status]}</Tag>
                  </div>
                )
              })}
          </Space>
        </Card>

        <Card title="서비스별 예약 현황">
          <Space orientation="vertical" size={16} className="full-width">
            {services.map((service) => (
              <div key={service.id}>
                <Flex justify="space-between" align="center">
                  <Text strong>{service.name}</Text>
                  <Text type="secondary">{service.bookings}건</Text>
                </Flex>
                <Progress percent={Math.round((service.bookings / maxBookings) * 100)} showInfo={false} />
              </div>
            ))}
          </Space>
        </Card>
      </div>
    </Space>
  )
}
