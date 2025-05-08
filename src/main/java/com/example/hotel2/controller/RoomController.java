package com.example.hotel2.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("/api/lobby")
public class RoomController {

//    @Autowired
//    private RoomService roomService;
//
//    @PostMapping("/checkin-checkout")
//    public ResponseEntity<?> handleCheckInCheckOut(@RequestBody Map<String, String> requestData) {
//        String qrCodeData = requestData.get("qrCodeData");
//        String[] parts = qrCodeData.split("-");
//
//        if (parts.length != 2) {
//            return ResponseEntity.badRequest().body(Map.of("result", false, "message", "QR 코드 형식이 잘못되었습니다."));
//        }
//
//        String customerEmail = parts[0];
//        String roomNumber = parts[1];
//
//        try {
//            RoomEntity room = roomService.findRoomByEmailAndRoomNumber(customerEmail, roomNumber);
//
//            if (room == null) {
//                return ResponseEntity.badRequest().body(Map.of("result", false, "message", "예약 정보를 찾을 수 없습니다."));
//            }
//
//            String currentStatus = room.getStatus();
//            if ("RESERVED".equals(currentStatus)) {
//                room.setStatus("CHECK_IN");
//            } else if ("CHECK_IN".equals(currentStatus)) {
//                room.setStatus("CHECK_OUT");
//            } else {
//                return ResponseEntity.badRequest().body(Map.of("result", false, "message", "이미 체크아웃 상태입니다."));
//            }
//
//            roomService.saveRoom(room);
//            return ResponseEntity.ok(Map.of("result", true, "status", room.getStatus()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("result", false, "message", "서버 오류가 발생했습니다."));
//        }
//    }
}

