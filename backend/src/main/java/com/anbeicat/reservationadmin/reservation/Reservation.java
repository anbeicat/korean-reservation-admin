package com.anbeicat.reservationadmin.reservation;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

public record Reservation(
  Long id,
  LocalDate reservationDate,
  @JsonFormat(pattern = "HH:mm")
  LocalTime time,
  String customer,
  String phone,
  String serviceId,
  ReservationStatus status,
  String memo
) {

  public Reservation withStatus(ReservationStatus nextStatus) {
    return new Reservation(id, reservationDate, time, customer, phone, serviceId, nextStatus, memo);
  }
}
