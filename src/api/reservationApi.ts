import { customers, initialReservations, services } from '../data/mockData'
import type { NewReservationFormValues, Reservation, ReservationStatus, Service, ServiceFormValues } from '../types'

const MOCK_API_DELAY = 350

function waitMockApi() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_API_DELAY)
  })
}

// API 适配层：现在返回 mock 数据，后续可以在这里替换成 fetch / axios 请求。
export function getReservationWorkspaceMock() {
  return {
    reservations: initialReservations,
    services,
    customers,
  }
}

// 预约新增 API：目前在前端生成数据，接后端后改成 POST /reservations。
export async function createReservationMock(values: NewReservationFormValues): Promise<Reservation> {
  await waitMockApi()

  return {
    id: Date.now(),
    reservationDate: values.date.format('YYYY-MM-DD'),
    time: values.time.format('HH:mm'),
    customer: values.customer,
    phone: values.phone,
    serviceId: values.serviceId,
    status: 'REQUESTED',
    memo: values.memo,
  }
}

// 预约状态更新 API：目前只返回更新后的对象，接后端后改成 PATCH /reservations/{id}/status。
export async function updateReservationStatusMock(
  reservation: Reservation,
  status: ReservationStatus,
): Promise<Reservation> {
  await waitMockApi()

  return {
    ...reservation,
    status,
  }
}

// 服务新增 API：目前在前端生成服务，接后端后改成 POST /services。
export async function createServiceMock(values: ServiceFormValues): Promise<Service> {
  await waitMockApi()

  return {
    id: `service-${Date.now()}`,
    name: values.name,
    duration: values.duration,
    price: values.price,
    bookings: 0,
    status: 'ACTIVE',
  }
}

// 服务上下架 API：模拟韩国门店后台里常见的 활성/비활성 状态切换。
export async function toggleServiceStatusMock(service: Service): Promise<Service> {
  await waitMockApi()

  return {
    ...service,
    status: service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
  }
}
