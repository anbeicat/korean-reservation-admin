import { Button, Card, Empty, Form, Input, InputNumber, Modal, Space, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'
import type { Service, ServiceFormValues } from '../types'
import { formatWon } from '../utils/reservation'

const { Text } = Typography

type ServicesPageProps = {
  services: Service[]
  isCreatingService: boolean
  actionServiceId: string | null
  onCreateService: (values: ServiceFormValues) => Promise<boolean>
  onToggleServiceStatus: (serviceId: string) => Promise<void>
}

export function ServicesPage({
  services,
  isCreatingService,
  actionServiceId,
  onCreateService,
  onToggleServiceStatus,
}: ServicesPageProps) {
  const [keyword, setKeyword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<ServiceFormValues>()

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(keyword.trim().toLowerCase()))

  const columns: TableProps<Service>['columns'] = [
    {
      title: '서비스명',
      dataIndex: 'name',
      render: (name: string, service) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary">{service.duration}분 소요</Text>
        </Space>
      ),
    },
    {
      title: '가격',
      dataIndex: 'price',
      render: (price: number) => formatWon(price),
    },
    {
      title: '오늘 예약',
      dataIndex: 'bookings',
      render: (bookings: number) => `${bookings}건`,
    },
    {
      title: '상태',
      dataIndex: 'status',
      render: (status: Service['status']) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>{status === 'ACTIVE' ? '운영중' : '중지'}</Tag>
      ),
    },
    {
      title: '작업',
      key: 'action',
      render: (_, service) => (
        <Button loading={actionServiceId === service.id} onClick={() => onToggleServiceStatus(service.id)}>
          {service.status === 'ACTIVE' ? '중지' : '재개'}
        </Button>
      ),
    },
  ]

  return (
    <>
      <Card
        title="서비스 목록"
        extra={
          <Space>
            <Input.Search
              allowClear
              value={keyword}
              placeholder="서비스명 검색"
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              서비스 추가
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredServices}
          locale={{
            emptyText: <Empty description="조건에 맞는 서비스가 없습니다" />,
          }}
          pagination={false}
        />
      </Card>

      <Modal title="서비스 추가" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} destroyOnHidden>
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            const isCreated = await onCreateService(values)

            if (isCreated) {
              form.resetFields()
              setIsModalOpen(false)
            }
          }}
        >
          <Form.Item name="name" label="서비스명" rules={[{ required: true, message: '서비스명을 입력해 주세요' }]}>
            <Input placeholder="예: 케라틴 클리닉" />
          </Form.Item>
          <Form.Item name="duration" label="소요 시간" rules={[{ required: true, message: '소요 시간을 입력해 주세요' }]}>
            <InputNumber min={10} step={5} addonAfter="분" className="full-width" />
          </Form.Item>
          <Form.Item name="price" label="가격" rules={[{ required: true, message: '가격을 입력해 주세요' }]}>
            <InputNumber min={0} step={1000} addonBefore="₩" className="full-width" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isCreatingService}>
            서비스 등록
          </Button>
        </Form>
      </Modal>
    </>
  )
}
