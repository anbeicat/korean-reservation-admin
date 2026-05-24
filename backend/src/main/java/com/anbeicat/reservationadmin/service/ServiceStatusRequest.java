package com.anbeicat.reservationadmin.service;

import jakarta.validation.constraints.NotNull;

public record ServiceStatusRequest(
  @NotNull(message = "서비스 상태를 선택해 주세요")
  ServiceStatus status
) {
}
