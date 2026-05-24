package com.anbeicat.reservationadmin.reservation;

import jakarta.validation.constraints.NotNull;

public record ReservationStatusRequest(
  @NotNull(message = "예약 상태를 선택해 주세요")
  ReservationStatus status
) {
}
