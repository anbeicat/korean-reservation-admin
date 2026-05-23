import { useMemo, useState } from 'react'
import { createServiceMock, toggleServiceStatusMock } from '../api/reservationApi'
import type { Service, ServiceFormValues } from '../types'

type UseServicesParams = {
  initialServices: Service[]
  onCreated?: () => void
  onStatusChanged?: () => void
}

export function useServices({ initialServices, onCreated, onStatusChanged }: UseServicesParams) {
  const [services, setServices] = useState<Service[]>(initialServices)

  // 查询用 Map：通过预约里的 serviceId 快速找到服务名称和价格。
  const serviceById = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]))
  }, [services])

  const activeServices = useMemo(() => {
    return services.filter((service) => service.status === 'ACTIVE')
  }, [services])

  // 服务新增：通过 API 适配层生成服务对象，后续接后端时由 API 返回。
  function createService(values: ServiceFormValues) {
    const createdService = createServiceMock(values)

    setServices((current) => [...current, createdService])
    onCreated?.()
  }

  // 服务状态切换：用于模拟店主临时停用或恢复服务项目。
  function toggleServiceStatus(serviceId: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId ? toggleServiceStatusMock(service) : service,
      ),
    )
    onStatusChanged?.()
  }

  return {
    services,
    serviceById,
    activeServices,
    createService,
    toggleServiceStatus,
  }
}
