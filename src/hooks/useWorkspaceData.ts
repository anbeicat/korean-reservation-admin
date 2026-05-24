import { useEffect, useState } from 'react'
import { workspaceApi } from '../api/reservationApi'
import type { Customer, Reservation, Service } from '../types'

type WorkspaceData = {
  reservations: Reservation[]
  services: Service[]
  customers: Customer[]
}

export function useWorkspaceData() {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadWorkspaceData() {
      try {
        const response = await workspaceApi.getInitialData()

        if (isMounted) {
          setWorkspaceData(response.data)
        }
      } finally {
        if (isMounted) {
          setIsLoadingWorkspace(false)
        }
      }
    }

    loadWorkspaceData()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    workspaceData,
    isLoadingWorkspace,
  }
}
