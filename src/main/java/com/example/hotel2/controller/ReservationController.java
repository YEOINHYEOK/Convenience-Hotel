package com.example.hotel2.controller;

import com.example.hotel2.dto.ReservationDto;
import com.example.hotel2.dto.ResponseDto;
import com.example.hotel2.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // 예약 처리
    @PostMapping("/reserve")
    public ResponseEntity<?> reserveRoom(@RequestBody ReservationDto reservationDto) {
        // 과거 날짜 예약 방지
        if (reservationDto.getCheckInDate().isBefore(LocalDate.now()) || reservationDto.getCheckOutDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(ResponseDto.setFailed("과거 날짜로 예약할 수 없습니다."));
        }

        // 예약 처리
        ResponseDto<?> response = reservationService.reserveRoom(reservationDto);
        return ResponseEntity.ok(response);
    }

    // 고객 예약 조회
    @GetMapping("/my-reservation")
    public ResponseEntity<?> getCustomerReservations(@RequestParam(value = "customerEmail") String customerEmail) {
        if (customerEmail == null || customerEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ResponseDto.setFailed("이메일이 유효하지 않습니다. (빈 값)"));
        }

        List<ReservationDto> reservations = reservationService.getReservationsByCustomerEmail(customerEmail);
        if (reservations.isEmpty()) {
            return ResponseEntity.ok(ResponseDto.setSuccessData("예약 정보가 없습니다.", new ArrayList<>()));
        }

        return ResponseEntity.ok(ResponseDto.setSuccessData("예약 정보 조회 성공", reservations));
    }
}
