package com.example.hotel2.service;

import com.example.hotel2.entity.RoomEntity;
import com.example.hotel2.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public RoomEntity findRoomByEmailAndRoomNumber(String customerEmail, String roomNumber) {
        return roomRepository.findByCustomerEmailAndRoomNumber(customerEmail, roomNumber);
    }

    public RoomEntity saveRoom(RoomEntity room) {
        return roomRepository.save(room);
    }

    public Map<String, Object> processCheckInOut(String qrCodeData, String actionType) {
        Map<String, Object> response = new HashMap<>();
        String[] qrDataParts = qrCodeData.split("-");
        String customerEmail = qrDataParts[0];
        String roomNumber = qrDataParts[1];

        Optional<RoomEntity> roomOpt = roomRepository.findByRoomNumberAndCustomerEmail(roomNumber, customerEmail);

        if (roomOpt.isPresent()) {
            RoomEntity room = roomOpt.get();
            if ("CHECK_IN".equals(actionType)) {
                room.setStatus("CHECK_IN");
                response.put("result", true);
                response.put("message", "체크인이 완료되었습니다.");
            } else if ("CHECK_OUT".equals(actionType)) {
                room.setStatus("CHECK_OUT");
                response.put("result", true);
                response.put("message", "체크아웃이 완료되었습니다.");
            } else {
                response.put("result", false);
                response.put("message", "유효하지 않은 요청입니다.");
            }
            roomRepository.save(room);
        } else {
            response.put("result", false);
            response.put("message", "예약 정보를 찾을 수 없습니다.");
        }
        log.info((String) "message: " + response.get("message") + "result: "+ response.get("result"));
        return response;
    }
}

