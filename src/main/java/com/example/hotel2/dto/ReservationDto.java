package com.example.hotel2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDto {
    private String roomNumber;
    private String status;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int occupants;
    private String customerEmail;
    private String customerName;

    public ReservationDto(String roomNumber, String customerEmail, String status, LocalDate checkInDate, LocalDate checkOutDate, Integer occupants, String customerEmail1, String customerName) {
    }
}
