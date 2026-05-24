import { useMemo, useState } from 'react'
import { createServiceMock, toggleServiceStatusMock } from '../api/reservationApi'
import type { Service, ServiceFormValues } from '../types'

type UseServicesParams = {
  initialServices: Service[]
  onCreated?: () => void
  onStatusChanged?: () => void
  onError?: (message: string) => void
}

export function useServices({ initialServices, onCreated, onStatusChanged, onError }: UseServicesParams) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isCreatingService, setIsCreatingService] = useState(false)
  const [serviceActionId, setServiceActionId] = useState<string | null>(null)

  // 查询用 Map：通过预约里的 serviceId 快速找到服务名称和价格。
  const serviceById = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]))
  }, [services])

  const activeServices = useMemo(() => {
    return services.filter((service) => service.status === 'ACTIVE')
  }, [services])

  // 服务新增：通过 API 适配层生成服务对象，后续接后端时由 API 返回。
  async function createService(values: ServiceFormValues) {
    setIsCreatingService(true)

    try {
      const createdService = await createServiceMock(values)

      setServices((current) => [...current, createdService])
      onCreated?.()
      return true
    } catch {
      onError?.('새 서비스 등록에 실패했습니다')
      return false
    } finally {
      setIsCreatingService(false)
    }
  }

  // 服务状态切换：用于模拟店主临时停用或恢复服务项目。
  async function toggleServiceStatus(serviceId: string) {
    const service = services.find((item) => item.id === serviceId)

    if (!service) {
      onError?.('서비스 정보를 찾을 수 없습니다')
      return
    }

    setServiceActionId(serviceId)

    try {
      const updatedService = await toggleServiceStatusMock(service)

      setServices((current) => current.map((item) => (item.id === serviceId ? updatedService : item)))
      onStatusChanged?.()
    } catch {
      onError?.('서비스 상태 변경에 실패했습니다')
    } finally {
      setServiceActionId(null)
    }
  }

  return {
    services,
    serviceById,
    activeServices,
    isCreatingService,
    serviceActionId,
    createService,
    toggleServiceStatus,
  }
}
