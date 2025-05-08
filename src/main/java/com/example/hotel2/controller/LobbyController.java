package com.example.hotel2.controller;

import com.example.hotel2.dto.CheckInOutRequest;
import com.example.hotel2.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/checkin-checkout")
    public ResponseEntity<Map<String, Object>> checkInOut(@RequestBody CheckInOutRequest request) {
        String actionType = request.getActionType();
        String qrCodeData = request.getQrCodeData();

        Map<String, Object> response = roomService.processCheckInOut(qrCodeData, actionType);
        return ResponseEntity.ok(response);
    }
}

