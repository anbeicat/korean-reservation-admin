package com.anbeicat.reservationadmin.service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ServiceRequest(
  @NotBlank(message = "서비스명을 입력해 주세요")
  String name,

  @Min(value = 10, message = "소요 시간은 10분 이상이어야 합니다")
  int duration,

  @Min(value = 0, message = "가격은 0원 이상이어야 합니다")
  int price
) {
}
