package com.example.phongvupcbe.exception;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ErrorDetail {
    private LocalDateTime timestamp;
    private String message;

    private String details;

    public ErrorDetail(LocalDateTime timestamp, String message, String details) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }
}