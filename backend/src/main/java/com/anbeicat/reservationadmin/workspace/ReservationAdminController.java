package com.anbeicat.reservationadmin.workspace;

import com.anbeicat.reservationadmin.common.ApiResponse;
import com.anbeicat.reservationadmin.customer.Customer;
import com.anbeicat.reservationadmin.reservation.Reservation;
import com.anbeicat.reservationadmin.reservation.ReservationRequest;
import com.anbeicat.reservationadmin.reservation.ReservationStatusRequest;
import com.anbeicat.reservationadmin.service.ServiceItem;
import com.anbeicat.reservationadmin.service.ServiceRequest;
import com.anbeicat.reservationadmin.service.ServiceStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReservationAdminController {

  private final ReservationAdminService reservationAdminService;

  public ReservationAdminController(ReservationAdminService reservationAdminService) {
    this.reservationAdminService = reservationAdminService;
  }

  @GetMapping("/workspace")
  public ApiResponse<WorkspaceResponse> getWorkspace() {
    return ApiResponse.of(reservationAdminService.getWorkspace());
  }

  @GetMapping("/reservations")
  public ApiResponse<List<Reservation>> getReservations() {
    return ApiResponse.of(reservationAdminService.listReservations());
  }

  @PostMapping("/reservations")
  public ApiResponse<Reservation> createReservation(@Valid @RequestBody ReservationRequest request) {
    return ApiResponse.of(reservationAdminService.createReservation(request));
  }

  @PatchMapping("/reservations/{id}")
  public ApiResponse<Reservation> updateReservation(
    @PathVariable long id,
    @Valid @RequestBody ReservationRequest request
  ) {
    return ApiResponse.of(reservationAdminService.updateReservation(id, request));
  }

  @PatchMapping("/reservations/{id}/status")
  public ApiResponse<Reservation> updateReservationStatus(
    @PathVariable long id,
    @Valid @RequestBody ReservationStatusRequest request
  ) {
    return ApiResponse.of(reservationAdminService.updateReservationStatus(id, request.status()));
  }

  @GetMapping("/services")
  public ApiResponse<List<ServiceItem>> getServices() {
    return ApiResponse.of(reservationAdminService.listServices());
  }

  @PostMapping("/services")
  public ApiResponse<ServiceItem> createService(@Valid @RequestBody ServiceRequest request) {
    return ApiResponse.of(reservationAdminService.createService(request));
  }

  @PatchMapping("/services/{id}")
  public ApiResponse<ServiceItem> updateService(
    @PathVariable String id,
    @Valid @RequestBody ServiceRequest request
  ) {
    return ApiResponse.of(reservationAdminService.updateService(id, request));
  }

  @PatchMapping("/services/{id}/status")
  public ApiResponse<ServiceItem> updateServiceStatus(
    @PathVariable String id,
    @Valid @RequestBody ServiceStatusRequest request
  ) {
    return ApiResponse.of(reservationAdminService.updateServiceStatus(id, request.status()));
  }

  @GetMapping("/customers")
  public ApiResponse<List<Customer>> getCustomers() {
    return ApiResponse.of(reservationAdminService.listCustomers());
  }
}
