import { useState } from 'react'
import { App as AntdApp } from 'antd'
import './App.css'
import { getReservationWorkspaceMock } from './api/reservationApi'
import { AppShell } from './components/AppShell'
import { ReservationDetailDrawer } from './components/ReservationDetailDrawer'
import { ReservationFormModal } from './components/ReservationFormModal'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { useReservations } from './hooks/useReservations'
import { useServices } from './hooks/useServices'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { ServicesPage } from './pages/ServicesPage'
import type { ViewKey } from './types'
import { statusLabel } from './utils/reservation'

const reservationWorkspace = getReservationWorkspaceMock()

function ReservationAdmin() {
  const { message } = AntdApp.useApp()
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    reservations,
    filteredReservations,
    statusFilter,
    dateFilterValue,
    keywordFilter,
    selectedReservation,
    isCreatingReservation,
    reservationActionId,
    setStatusFilter,
    setKeywordFilter,
    setSelectedReservation,
    advanceReservation,
    cancelReservation,
    createReservation,
    resetReservationFilters,
    handleDateFilterChange,
  } = useReservations({
    initialReservations: reservationWorkspace.reservations,
    onStatusChanged: (status) => message.success(`예약 상태가 ${statusLabel[status]} 상태로 변경되었습니다`),
    onCreated: () => {
      setIsModalOpen(false)
      setActiveView('reservations')
      message.success('새 예약이 등록되었습니다')
    },
    onError: (errorMessage) => message.error(errorMessage),
  })

  const {
    services,
    serviceById,
    activeServices,
    isCreatingService,
    serviceActionId,
    createService,
    toggleServiceStatus,
  } = useServices({
    initialServices: reservationWorkspace.services,
    onCreated: () => message.success('새 서비스가 등록되었습니다'),
    onStatusChanged: () => message.success('서비스 상태가 변경되었습니다'),
    onError: (errorMessage) => message.error(errorMessage),
  })

  const summary = useDashboardSummary({ reservations, services, activeServices, serviceById })

  return (
    <>
      <AppShell activeView={activeView} onViewChange={setActiveView}>
        {activeView === 'dashboard' && (
          <DashboardPage
            summary={summary}
            reservations={reservations}
            services={services}
            serviceById={serviceById}
            onNewReservation={() => setIsModalOpen(true)}
          />
        )}

        {activeView === 'reservations' && (
          <ReservationsPage
            reservations={filteredReservations}
            serviceById={serviceById}
            statusFilter={statusFilter}
            dateFilterValue={dateFilterValue}
            keywordFilter={keywordFilter}
            onKeywordChange={setKeywordFilter}
            onDateFilterChange={handleDateFilterChange}
            onStatusFilterChange={setStatusFilter}
            onResetFilters={resetReservationFilters}
            onOpenCreate={() => setIsModalOpen(true)}
            onSelectReservation={setSelectedReservation}
            onAdvanceReservation={advanceReservation}
            onCancelReservation={cancelReservation}
            actionReservationId={reservationActionId}
          />
        )}

        {activeView === 'services' && (
          <ServicesPage
            services={services}
            isCreatingService={isCreatingService}
            actionServiceId={serviceActionId}
            onCreateService={createService}
            onToggleServiceStatus={toggleServiceStatus}
          />
        )}

        {activeView === 'customers' && <CustomersPage customers={reservationWorkspace.customers} />}
      </AppShell>

      <ReservationFormModal
        open={isModalOpen}
        services={activeServices}
        loading={isCreatingReservation}
        onCancel={() => setIsModalOpen(false)}
        onCreate={createReservation}
      />

      <ReservationDetailDrawer
        reservation={selectedReservation}
        serviceById={serviceById}
        onClose={() => setSelectedReservation(null)}
        onAdvance={advanceReservation}
        onCancelReservation={cancelReservation}
        actionReservationId={reservationActionId}
      />
    </>
  )
}

function App() {
  return (
    <AntdApp>
      <ReservationAdmin />
    </AntdApp>
  )
}

export default App
