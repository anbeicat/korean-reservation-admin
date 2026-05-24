package com.anbeicat.reservationadmin.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiError> handleBusinessException(BusinessException exception) {
    return ResponseEntity
      .status(exception.status())
      .body(new ApiError(exception.getMessage(), exception.code()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException exception) {
    var message = exception.getBindingResult().getFieldErrors().stream()
      .findFirst()
      .map((error) -> error.getDefaultMessage())
      .orElse("요청값을 다시 확인해 주세요");

    return ResponseEntity.badRequest().body(new ApiError(message, "VALIDATION_ERROR"));
  }
}
