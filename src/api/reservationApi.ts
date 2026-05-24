import { customers, initialReservations, services } from '../data/mockData'
import type {
  Customer,
  NewReservationFormValues,
  Reservation,
  ReservationStatus,
  Service,
  ServiceFormValues,
} from '../types'

const API_BASE_URL = 'http://127.0.0.1:8080/api'
const MOCK_API_DELAY = 350

type ApiResponse<T> = {
  data: T
}

type WorkspaceData = {
  reservations: Reservation[]
  services: Service[]
  customers: Customer[]
}

type ReservationPayload = {
  customer: string
  phone: string
  serviceId: string
  reservationDate: string
  time: string
  memo?: string
}

class ApiHttpError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiHttpError'
  }
}

function waitMockApi() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_API_DELAY)
  })
}

function toReservationPayload(values: NewReservationFormValues): ReservationPayload {
  return {
    customer: values.customer,
    phone: values.phone,
    serviceId: values.serviceId,
    reservationDate: values.date.format('YYYY-MM-DD'),
    time: values.time.format('HH:mm'),
    memo: values.memo,
  }
}

async function requestApi<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const body = await response.json()

  if (!response.ok) {
    throw new ApiHttpError(body.message || 'API 요청에 실패했습니다')
  }

  return body
}

async function withMockFallback<T>(apiRequest: () => Promise<ApiResponse<T>>, mockRequest: () => Promise<ApiResponse<T>>) {
  try {
    return await apiRequest()
  } catch (error) {
    if (error instanceof ApiHttpError) {
      throw error
    }

    return mockRequest()
  }
}

function getMockWorkspace(): WorkspaceData {
  return {
    reservations: initialReservations,
    services,
    customers,
  }
}

export const workspaceApi = {
  async getInitialData(): Promise<ApiResponse<WorkspaceData>> {
    return withMockFallback(
      () => requestApi<WorkspaceData>('/workspace'),
      async () => ({ data: getMockWorkspace() }),
    )
  },
}

export const reservationApi = {
  // POST /api/reservations
  async create(values: NewReservationFormValues): Promise<ApiResponse<Reservation>> {
    return withMockFallback(
      () =>
        requestApi<Reservation>('/reservations', {
          method: 'POST',
          body: JSON.stringify(toReservationPayload(values)),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            id: Date.now(),
            reservationDate: values.date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm'),
            customer: values.customer,
            phone: values.phone,
            serviceId: values.serviceId,
            status: 'REQUESTED',
            memo: values.memo,
          },
        }
      },
    )
  },

  // PATCH /api/reservations/{id}/status
  async updateStatus(reservation: Reservation, status: ReservationStatus): Promise<ApiResponse<Reservation>> {
    return withMockFallback(
      () =>
        requestApi<Reservation>(`/reservations/${reservation.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            ...reservation,
            status,
          },
        }
      },
    )
  },

  // PATCH /api/reservations/{id}
  async update(reservation: Reservation, values: NewReservationFormValues): Promise<ApiResponse<Reservation>> {
    return withMockFallback(
      () =>
        requestApi<Reservation>(`/reservations/${reservation.id}`, {
          method: 'PATCH',
          body: JSON.stringify(toReservationPayload(values)),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            ...reservation,
            reservationDate: values.date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm'),
            customer: values.customer,
            phone: values.phone,
            serviceId: values.serviceId,
            memo: values.memo,
          },
        }
      },
    )
  },
}

export const serviceApi = {
  // POST /api/services
  async create(values: ServiceFormValues): Promise<ApiResponse<Service>> {
    return withMockFallback(
      () =>
        requestApi<Service>('/services', {
          method: 'POST',
          body: JSON.stringify(values),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            id: `service-${Date.now()}`,
            name: values.name,
            duration: values.duration,
            price: values.price,
            bookings: 0,
            status: 'ACTIVE',
          },
        }
      },
    )
  },

  // PATCH /api/services/{id}
  async update(service: Service, values: ServiceFormValues): Promise<ApiResponse<Service>> {
    return withMockFallback(
      () =>
        requestApi<Service>(`/services/${service.id}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            ...service,
            name: values.name,
            duration: values.duration,
            price: values.price,
          },
        }
      },
    )
  },

  // PATCH /api/services/{id}/status
  async toggleStatus(service: Service): Promise<ApiResponse<Service>> {
    const status = service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

    return withMockFallback(
      () =>
        requestApi<Service>(`/services/${service.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      async () => {
        await waitMockApi()

        return {
          data: {
            ...service,
            status,
          },
        }
      },
    )
  },
}
