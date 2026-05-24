package com.anbeicat.reservationadmin.customer;

import java.time.LocalDate;

public record Customer(
  String name,
  String phone,
  int visits,
  LocalDate lastVisit
) {
}
