package com.example.hotel2.controller;

import com.example.hotel2.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CheckInController {

    private final ReservationService reservationService;

    @Autowired
    public CheckInController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * QR 코드에서 URL로 전달된 이메일과 방 번호를 처리
     * @param email 고객 이메일
     * @param roomNumber 방 번호
     * @return 체크인 성공 또는 실패 메시지
     */
    @GetMapping("/checkin/{email}-{roomNumber}")
    public ResponseEntity<String> handleCheckin(
            @PathVariable String email,
            @PathVariable String roomNumber) {  // roomNumber를 int로 변경

        try {
            // 이메일과 방 번호를 사용해 예약 데이터 확인
            boolean isCheckinValid = reservationService.validateCheckin(email, roomNumber);

            if (isCheckinValid) {
                return ResponseEntity.ok("Check-in successful for " + email + " and room " + roomNumber);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid check-in details for " + email + " and room " + roomNumber);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing check-in for " + email + " and room " + roomNumber);
        }
    }
}
