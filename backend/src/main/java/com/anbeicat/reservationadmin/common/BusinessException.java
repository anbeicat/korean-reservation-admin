package com.anbeicat.reservationadmin.common;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {

  private final String code;
  private final HttpStatus status;

  public BusinessException(String message, String code, HttpStatus status) {
    super(message);
    this.code = code;
    this.status = status;
  }

  public String code() {
    return code;
  }

  public HttpStatus status() {
    return status;
  }
}
