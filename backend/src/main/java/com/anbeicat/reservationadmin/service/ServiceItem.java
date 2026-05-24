package com.anbeicat.reservationadmin.service;

public record ServiceItem(
  String id,
  String name,
  int duration,
  int price,
  int bookings,
  ServiceStatus status
) {

  public ServiceItem withStatus(ServiceStatus nextStatus) {
    return new ServiceItem(id, name, duration, price, bookings, nextStatus);
  }
}
