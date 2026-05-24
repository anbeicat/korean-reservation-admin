package com.anbeicat.reservationadmin.workspace;

import com.anbeicat.reservationadmin.common.BusinessException;
import com.anbeicat.reservationadmin.customer.Customer;
import com.anbeicat.reservationadmin.reservation.Reservation;
import com.anbeicat.reservationadmin.reservation.ReservationRequest;
import com.anbeicat.reservationadmin.reservation.ReservationStatus;
import com.anbeicat.reservationadmin.service.ServiceItem;
import com.anbeicat.reservationadmin.service.ServiceRequest;
import com.anbeicat.reservationadmin.service.ServiceStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ReservationAdminService {

  private static final LocalTime OPEN_TIME = LocalTime.of(10, 0);
  private static final LocalTime CLOSE_TIME = LocalTime.of(19, 0);
  private static final int RESERVATION_INTERVAL_MINUTES = 5;

  private final AtomicLong reservationSequence = new AtomicLong(5);
  private final List<ServiceItem> services = new ArrayList<>();
  private final List<Reservation> reservations = new ArrayList<>();
  private final List<Customer> customers = new ArrayList<>();

  public ReservationAdminService() {
    services.add(new ServiceItem("hair-cut", "헤어컷", 45, 35000, 8, ServiceStatus.ACTIVE));
    services.add(new ServiceItem("color", "컬러 시술", 120, 120000, 4, ServiceStatus.ACTIVE));
    services.add(new ServiceItem("perm", "디지털 펌", 150, 180000, 3, ServiceStatus.ACTIVE));
    services.add(new ServiceItem("scalp", "두피 케어", 60, 65000, 5, ServiceStatus.ACTIVE));

    reservations.add(new Reservation(1L, LocalDate.parse("2026-05-23"), LocalTime.parse("10:00"), "김민지", "010-1122-3344", "hair-cut", ReservationStatus.CONFIRMED, "첫 방문"));
    reservations.add(new Reservation(2L, LocalDate.parse("2026-05-23"), LocalTime.parse("11:30"), "박지훈", "010-2233-4455", "scalp", ReservationStatus.REQUESTED, "두피가 민감함"));
    reservations.add(new Reservation(3L, LocalDate.parse("2026-05-23"), LocalTime.parse("13:00"), "이서연", "010-3344-5566", "color", ReservationStatus.CONFIRMED, "애쉬 브라운"));
    reservations.add(new Reservation(4L, LocalDate.parse("2026-05-23"), LocalTime.parse("15:30"), "최유나", "010-4455-6677", "perm", ReservationStatus.CANCELED, "일정 변경"));
    reservations.add(new Reservation(5L, LocalDate.parse("2026-05-23"), LocalTime.parse("17:00"), "정하민", "010-5566-7788", "hair-cut", ReservationStatus.COMPLETED, null));

    customers.add(new Customer("김민지", "010-1122-3344", 3, LocalDate.parse("2026-05-22")));
    customers.add(new Customer("박지훈", "010-2233-4455", 1, LocalDate.parse("2026-05-22")));
    customers.add(new Customer("이서연", "010-3344-5566", 6, LocalDate.parse("2026-05-22")));
    customers.add(new Customer("최유나", "010-4455-6677", 2, LocalDate.parse("2026-05-21")));
    customers.add(new Customer("정하민", "010-5566-7788", 4, LocalDate.parse("2026-05-22")));
  }

  public WorkspaceResponse getWorkspace() {
    return new WorkspaceResponse(listReservations(), listServices(), listCustomers());
  }

  public List<Reservation> listReservations() {
    return List.copyOf(reservations);
  }

  public List<ServiceItem> listServices() {
    return List.copyOf(services);
  }

  public List<Customer> listCustomers() {
    return List.copyOf(customers);
  }

  public Reservation createReservation(ReservationRequest request) {
    validateServiceExists(request.serviceId());
    validateBusinessTime(request.time());
    validateReservationSlot(request.reservationDate(), request.time(), null);

    var reservation = new Reservation(
      reservationSequence.incrementAndGet(),
      request.reservationDate(),
      request.time(),
      request.customer(),
      request.phone(),
      request.serviceId(),
      ReservationStatus.REQUESTED,
      request.memo()
    );

    reservations.add(reservation);
    return reservation;
  }

  public Reservation updateReservation(long id, ReservationRequest request) {
    validateServiceExists(request.serviceId());
    validateBusinessTime(request.time());
    validateReservationSlot(request.reservationDate(), request.time(), id);

    var current = findReservation(id);
    var updated = new Reservation(
      current.id(),
      request.reservationDate(),
      request.time(),
      request.customer(),
      request.phone(),
      request.serviceId(),
      current.status(),
      request.memo()
    );

    replaceReservation(updated);
    return updated;
  }

  public Reservation updateReservationStatus(long id, ReservationStatus status) {
    var updated = findReservation(id).withStatus(status);
    replaceReservation(updated);
    return updated;
  }

  public ServiceItem createService(ServiceRequest request) {
    var service = new ServiceItem(
      "service-" + System.currentTimeMillis(),
      request.name(),
      request.duration(),
      request.price(),
      0,
      ServiceStatus.ACTIVE
    );

    services.add(service);
    return service;
  }

  public ServiceItem updateService(String id, ServiceRequest request) {
    var current = findService(id);
    var updated = new ServiceItem(
      current.id(),
      request.name(),
      request.duration(),
      request.price(),
      current.bookings(),
      current.status()
    );

    replaceService(updated);
    return updated;
  }

  public ServiceItem updateServiceStatus(String id, ServiceStatus status) {
    var updated = findService(id).withStatus(status);
    replaceService(updated);
    return updated;
  }

  private Reservation findReservation(long id) {
    return reservations.stream()
      .filter((reservation) -> reservation.id() == id)
      .findFirst()
      .orElseThrow(() -> new BusinessException("예약 정보를 찾을 수 없습니다", "RESERVATION_NOT_FOUND", HttpStatus.NOT_FOUND));
  }

  private ServiceItem findService(String id) {
    return services.stream()
      .filter((service) -> service.id().equals(id))
      .findFirst()
      .orElseThrow(() -> new BusinessException("서비스 정보를 찾을 수 없습니다", "SERVICE_NOT_FOUND", HttpStatus.NOT_FOUND));
  }

  private void validateServiceExists(String serviceId) {
    findService(serviceId);
  }

  private void validateBusinessTime(LocalTime time) {
    var isOpen = !time.isBefore(OPEN_TIME) && time.isBefore(CLOSE_TIME);
    var hasValidInterval = time.getMinute() % RESERVATION_INTERVAL_MINUTES == 0;

    if (!isOpen || !hasValidInterval) {
      throw new BusinessException(
        "영업시간은 10:00부터 19:00까지이며 5분 단위로 예약할 수 있습니다",
        "INVALID_BUSINESS_TIME",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private void validateReservationSlot(LocalDate date, LocalTime time, Long excludeReservationId) {
    var hasConflict = reservations.stream().anyMatch((reservation) -> {
      var isSameReservation = excludeReservationId != null && reservation.id().equals(excludeReservationId);
      var isCanceled = reservation.status() == ReservationStatus.CANCELED;

      return !isSameReservation &&
        !isCanceled &&
        reservation.reservationDate().equals(date) &&
        reservation.time().equals(time);
    });

    if (hasConflict) {
      throw new BusinessException("이미 같은 시간에 예약이 있습니다", "RESERVATION_SLOT_CONFLICT", HttpStatus.CONFLICT);
    }
  }

  private void replaceReservation(Reservation updated) {
    reservations.replaceAll((reservation) -> reservation.id().equals(updated.id()) ? updated : reservation);
  }

  private void replaceService(ServiceItem updated) {
    services.replaceAll((service) -> service.id().equals(updated.id()) ? updated : service);
  }
}
