package com.anbeicat.reservationadmin.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationRequest(
  @NotBlank(message = "고객명을 입력해 주세요")
  String customer,

  @NotBlank(message = "연락처를 입력해 주세요")
  @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "010-1234-5678 형식으로 입력해 주세요")
  String phone,

  @NotBlank(message = "서비스를 선택해 주세요")
  String serviceId,

  @NotNull(message = "날짜를 선택해 주세요")
  LocalDate reservationDate,

  @NotNull(message = "시간을 선택해 주세요")
  LocalTime time,

  String memo
) {
}
