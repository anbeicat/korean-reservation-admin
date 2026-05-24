import { useEffect } from 'react'
import { Alert, Button, DatePicker, Flex, Form, Input, Modal, Select, Space, TimePicker, Typography } from 'antd'
import dayjs from 'dayjs'
import type { NewReservationFormValues, Reservation, Service } from '../types'
import { formatWon } from '../utils/reservation'

const { Text } = Typography

type ReservationFormModalProps = {
  open: boolean
  services: Service[]
  editingReservation: Reservation | null
  loading: boolean
  onCancel: () => void
  onSubmit: (values: NewReservationFormValues) => Promise<boolean>
}

export function ReservationFormModal({
  open,
  services,
  editingReservation,
  loading,
  onCancel,
  onSubmit,
}: ReservationFormModalProps) {
  const [form] = Form.useForm<NewReservationFormValues>()
  const selectedServiceId = Form.useWatch('serviceId', form)
  const selectedService = services.find((service) => service.id === selectedServiceId)
  const isEditMode = Boolean(editingReservation)

  useEffect(() => {
    if (!open) {
      form.resetFields()
      return
    }

    if (editingReservation) {
      form.setFieldsValue({
        customer: editingReservation.customer,
        phone: editingReservation.phone,
        serviceId: editingReservation.serviceId,
        date: dayjs(editingReservation.reservationDate),
        time: dayjs(`${editingReservation.reservationDate}T${editingReservation.time}`),
        memo: editingReservation.memo,
      })
    } else {
      form.resetFields()
    }
  }, [editingReservation, form, open])

  return (
    <Modal title={isEditMode ? '예약 수정' : '새 예약 등록'} open={open} onCancel={onCancel} footer={null} destroyOnHidden>
      <Form
        layout="vertical"
        form={form}
        onFinish={async (values) => {
          const isSaved = await onSubmit(values)

          if (isSaved) {
            form.resetFields()
          }
        }}
      >
        <Form.Item name="customer" label="고객명" rules={[{ required: true, message: '고객명을 입력해 주세요' }]}>
          <Input placeholder="예: 한소라" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="연락처"
          rules={[
            {
              required: true,
              pattern: /^010-\d{4}-\d{4}$/,
              message: '010-1234-5678 형식으로 입력해 주세요',
            },
          ]}
        >
          <Input placeholder="예: 010-6677-8899" />
        </Form.Item>
        <Form.Item name="serviceId" label="서비스" rules={[{ required: true, message: '서비스를 선택해 주세요' }]}>
          <Select
            options={services.map((service) => ({
              value: service.id,
              label: `${service.name} · ${formatWon(service.price)}`,
            }))}
          />
        </Form.Item>
        {selectedService && (
          <Alert
            type="info"
            showIcon
            message="선택한 서비스"
            description={
              <Space orientation="vertical" size={2}>
                <Text>{selectedService.name}</Text>
                <Text type="secondary">
                  {selectedService.duration}분 소요 · {formatWon(selectedService.price)}
                </Text>
              </Space>
            }
          />
        )}
        <Flex gap={12}>
          <Form.Item name="date" label="날짜" className="form-half" rules={[{ required: true }]}>
            <DatePicker className="full-width" />
          </Form.Item>
          <Form.Item name="time" label="시간" className="form-half" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="full-width" />
          </Form.Item>
        </Flex>
        <Form.Item name="memo" label="요청 메모">
          <Input.TextArea rows={3} placeholder="고객 요청사항을 입력해 주세요" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {isEditMode ? '예약 수정' : '예약 등록'}
        </Button>
      </Form>
    </Modal>
  )
}
