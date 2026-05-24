package com.anbeicat.reservationadmin.workspace;

import com.anbeicat.reservationadmin.customer.Customer;
import com.anbeicat.reservationadmin.reservation.Reservation;
import com.anbeicat.reservationadmin.service.ServiceItem;
import java.util.List;

public record WorkspaceResponse(
  List<Reservation> reservations,
  List<ServiceItem> services,
  List<Customer> customers
) {
}
