import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Empty, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Dayjs } from 'dayjs'
import type { Reservation, ReservationStatus, Service } from '../types'
import { formatWon, nextStatus, statusColor, statusLabel } from '../utils/reservation'

const { Text } = Typography

type ReservationsPageProps = {
  reservations: Reservation[]
  serviceById: Map<string, Service>
  statusFilter: ReservationStatus | 'ALL'
  dateFilterValue: Dayjs | null
  keywordFilter: string
  onKeywordChange: (value: string) => void
  onDateFilterChange: (value: Dayjs | null) => void
  onStatusFilterChange: (value: ReservationStatus | 'ALL') => void
  onResetFilters: () => void
  onOpenCreate: () => void
  onSelectReservation: (reservation: Reservation) => void
  onAdvanceReservation: (id: number) => Promise<void>
  onCancelReservation: (id: number) => Promise<void>
  actionReservationId: number | null
}

export function ReservationsPage({
  reservations,
  serviceById,
  statusFilter,
  dateFilterValue,
  keywordFilter,
  onKeywordChange,
  onDateFilterChange,
  onStatusFilterChange,
  onResetFilters,
  onOpenCreate,
  onSelectReservation,
  onAdvanceReservation,
  onCancelReservation,
  actionReservationId,
}: ReservationsPageProps) {
  // 预约表格列：定义 Ant Design Table 每一列的展示方式。
  const columns: TableProps<Reservation>['columns'] = [
    {
      title: '날짜',
      dataIndex: 'reservationDate',
      width: 130,
    },
    {
      title: '시간',
      dataIndex: 'time',
      width: 90,
      render: (time: string) => <Text strong>{time}</Text>,
    },
    {
      title: '고객',
      dataIndex: 'customer',
      render: (_, reservation) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{reservation.customer}</Text>
          <Text type="secondary">{reservation.phone}</Text>
          <Text type="secondary">{reservation.memo || '요청 메모 없음'}</Text>
        </Space>
      ),
    },
    {
      title: '서비스',
      dataIndex: 'serviceId',
      render: (serviceId: string) => serviceById.get(serviceId)?.name,
    },
    {
      title: '상태',
      dataIndex: 'status',
      render: (status: ReservationStatus) => <Tag color={statusColor[status]}>{statusLabel[status]}</Tag>,
    },
    {
      title: '금액',
      dataIndex: 'serviceId',
      render: (serviceId: string) => formatWon(serviceById.get(serviceId)?.price ?? 0),
    },
    {
      title: '작업',
      key: 'action',
      render: (_, reservation) => (
        <Space>
          <Button size="small" onClick={() => onSelectReservation(reservation)}>
            상세
          </Button>
          <Button
            size="small"
            disabled={!nextStatus[reservation.status]}
            loading={actionReservationId === reservation.id}
            onClick={() => onAdvanceReservation(reservation.id)}
          >
            다음
          </Button>
          <Button
            size="small"
            danger
            disabled={reservation.status === 'CANCELED'}
            loading={actionReservationId === reservation.id}
            onClick={() => onCancelReservation(reservation.id)}
          >
            취소
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="예약 목록"
      extra={
        <Space>
          <Input.Search
            allowClear
            value={keywordFilter}
            placeholder="고객명 또는 연락처"
            onChange={(event) => onKeywordChange(event.target.value)}
          />
          <DatePicker
            value={dateFilterValue}
            placeholder="날짜 선택"
            onChange={(value) => onDateFilterChange(value)}
          />
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="status-select"
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'REQUESTED', label: '요청' },
              { value: 'CONFIRMED', label: '확정' },
              { value: 'COMPLETED', label: '완료' },
              { value: 'CANCELED', label: '취소' },
            ]}
          />
          <Button onClick={onResetFilters}>초기화</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreate}>
            예약 추가
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={reservations}
        locale={{
          emptyText: (
            <Empty
              description={
                <Space orientation="vertical" size={4}>
                  <Text strong>조건에 맞는 예약이 없습니다</Text>
                  <Text type="secondary">검색어, 날짜 또는 상태 필터를 다시 확인해 주세요</Text>
                </Space>
              }
            />
          ),
        }}
        pagination={{ pageSize: 6 }}
        scroll={{ x: 940 }}
      />
    </Card>
  )
}
