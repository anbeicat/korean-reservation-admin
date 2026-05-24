import { useState } from 'react'
import { App as AntdApp, Spin } from 'antd'
import './App.css'
import { AppShell } from './components/AppShell'
import { ReservationDetailDrawer } from './components/ReservationDetailDrawer'
import { ReservationFormModal } from './components/ReservationFormModal'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { useReservations } from './hooks/useReservations'
import { useServices } from './hooks/useServices'
import { useWorkspaceData } from './hooks/useWorkspaceData'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { ServicesPage } from './pages/ServicesPage'
import type { Customer, NewReservationFormValues, Reservation, Service, ViewKey } from './types'
import { statusLabel } from './utils/reservation'

type ReservationAdminProps = {
  initialReservations: Reservation[]
  initialServices: Service[]
  customers: Customer[]
}

function ReservationAdmin({ initialReservations, initialServices, customers }: ReservationAdminProps) {
  const { message } = AntdApp.useApp()
  const [activeView, setActiveView] = useState<ViewKey>('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)

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
    updateReservation,
    resetReservationFilters,
    handleDateFilterChange,
  } = useReservations({
    initialReservations,
    onStatusChanged: (status) => message.success(`예약 상태가 ${statusLabel[status]} 상태로 변경되었습니다`),
    onCreated: () => {
      setIsModalOpen(false)
      setActiveView('reservations')
      message.success('새 예약이 등록되었습니다')
    },
    onUpdated: () => {
      setIsModalOpen(false)
      setEditingReservation(null)
      message.success('예약 정보가 수정되었습니다')
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
    updateService,
    toggleServiceStatus,
  } = useServices({
    initialServices,
    onCreated: () => message.success('새 서비스가 등록되었습니다'),
    onUpdated: () => message.success('서비스 정보가 수정되었습니다'),
    onStatusChanged: () => message.success('서비스 상태가 변경되었습니다'),
    onError: (errorMessage) => message.error(errorMessage),
  })

  const summary = useDashboardSummary({ reservations, services, activeServices, serviceById })
  const isSavingReservation = editingReservation ? reservationActionId === editingReservation.id : isCreatingReservation
  const reservationModalServices = editingReservation ? services : activeServices

  function openCreateReservationModal() {
    setEditingReservation(null)
    setIsModalOpen(true)
  }

  function openEditReservationModal(reservation: Reservation) {
    setEditingReservation(reservation)
    setIsModalOpen(true)
  }

  async function submitReservation(values: NewReservationFormValues) {
    if (editingReservation) {
      return updateReservation(editingReservation.id, values)
    }

    return createReservation(values)
  }

  return (
    <>
      <AppShell activeView={activeView} onViewChange={setActiveView}>
        {activeView === 'dashboard' && (
          <DashboardPage
            summary={summary}
            reservations={reservations}
            services={services}
            serviceById={serviceById}
            onNewReservation={openCreateReservationModal}
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
            onOpenCreate={openCreateReservationModal}
            onOpenEdit={openEditReservationModal}
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
            onUpdateService={updateService}
            onToggleServiceStatus={toggleServiceStatus}
          />
        )}

        {activeView === 'customers' && <CustomersPage customers={customers} />}
      </AppShell>

      <ReservationFormModal
        open={isModalOpen}
        services={reservationModalServices}
        editingReservation={editingReservation}
        loading={isSavingReservation}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingReservation(null)
        }}
        onSubmit={submitReservation}
      />

      <ReservationDetailDrawer
        reservation={selectedReservation}
        serviceById={serviceById}
        onClose={() => setSelectedReservation(null)}
        onEdit={openEditReservationModal}
        onAdvance={advanceReservation}
        onCancelReservation={cancelReservation}
        actionReservationId={reservationActionId}
      />
    </>
  )
}

function App() {
  const { workspaceData, isLoadingWorkspace } = useWorkspaceData()

  return (
    <AntdApp>
      {isLoadingWorkspace || !workspaceData ? (
        <div className="app-loading">
          <Spin size="large" tip="데이터를 불러오는 중입니다" />
        </div>
      ) : (
        <ReservationAdmin
          initialReservations={workspaceData.reservations}
          initialServices={workspaceData.services}
          customers={workspaceData.customers}
        />
      )}
    </AntdApp>
  )
}

export default App
