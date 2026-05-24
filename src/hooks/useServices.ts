import { useMemo, useState } from 'react'
import { serviceApi } from '../api/reservationApi'
import type { Service, ServiceFormValues } from '../types'

type UseServicesParams = {
  initialServices: Service[]
  onCreated?: () => void
  onUpdated?: () => void
  onStatusChanged?: () => void
  onError?: (message: string) => void
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage
}

export function useServices({ initialServices, onCreated, onUpdated, onStatusChanged, onError }: UseServicesParams) {
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
      const response = await serviceApi.create(values)

      setServices((current) => [...current, response.data])
      onCreated?.()
      return true
    } catch (error) {
      onError?.(getErrorMessage(error, '새 서비스 등록에 실패했습니다'))
      return false
    } finally {
      setIsCreatingService(false)
    }
  }

  // 服务编辑：修改服务名称、时长和价格。
  async function updateService(serviceId: string, values: ServiceFormValues) {
    const service = services.find((item) => item.id === serviceId)

    if (!service) {
      onError?.('서비스 정보를 찾을 수 없습니다')
      return false
    }

    setServiceActionId(serviceId)

    try {
      const response = await serviceApi.update(service, values)

      setServices((current) => current.map((item) => (item.id === serviceId ? response.data : item)))
      onUpdated?.()
      return true
    } catch (error) {
      onError?.(getErrorMessage(error, '서비스 정보 수정에 실패했습니다'))
      return false
    } finally {
      setServiceActionId(null)
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
      const response = await serviceApi.toggleStatus(service)

      setServices((current) => current.map((item) => (item.id === serviceId ? response.data : item)))
      onStatusChanged?.()
    } catch (error) {
      onError?.(getErrorMessage(error, '서비스 상태 변경에 실패했습니다'))
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
    updateService,
    toggleServiceStatus,
  }
}
