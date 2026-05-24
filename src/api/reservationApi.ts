import { customers, initialReservations, services } from '../data/mockData'
import type { NewReservationFormValues, Reservation, ReservationStatus, Service, ServiceFormValues } from '../types'

const MOCK_API_DELAY = 350

type ApiResponse<T> = {
  data: T
}

function waitMockApi() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_API_DELAY)
  })
}

// API 适配层：现在返回 mock 数据，后续可以在这里替换成 fetch / axios 请求。
export const workspaceApi = {
  getInitialData(): ApiResponse<{
    reservations: Reservation[]
    services: Service[]
    customers: typeof customers
  }> {
    return {
      data: {
        reservations: initialReservations,
        services,
        customers,
      },
    }
  },
}

export const reservationApi = {
  // POST /api/reservations
  async create(values: NewReservationFormValues): Promise<ApiResponse<Reservation>> {
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

  // PATCH /api/reservations/{id}/status
  async updateStatus(
    reservation: Reservation,
    status: ReservationStatus,
  ): Promise<ApiResponse<Reservation>> {
    await waitMockApi()

    return {
      data: {
        ...reservation,
        status,
      },
    }
  },

  // PATCH /api/reservations/{id}
  async update(
    reservation: Reservation,
    values: NewReservationFormValues,
  ): Promise<ApiResponse<Reservation>> {
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
}

export const serviceApi = {
  // POST /api/services
  async create(values: ServiceFormValues): Promise<ApiResponse<Service>> {
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

  // PATCH /api/services/{id}
  async update(service: Service, values: ServiceFormValues): Promise<ApiResponse<Service>> {
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

  // PATCH /api/services/{id}/status
  async toggleStatus(service: Service): Promise<ApiResponse<Service>> {
    await waitMockApi()

    return {
      data: {
        ...service,
        status: service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      },
    }
  },
}
