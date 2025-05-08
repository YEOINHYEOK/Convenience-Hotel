package com.example.hotel2.service;

import com.example.hotel2.entity.RoomEntity;
import com.example.hotel2.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationCleanupService {

    @Autowired
    private RoomRepository roomRepository;

    // 매 1분마다 실행되어 만료된 예약을 초기화합니다.
    @Scheduled(cron = "0 * * * * *")  // 매 1분마다 실행
    public void resetExpiredReservations() {
        List<RoomEntity> expiredRooms = roomRepository.findExpiredReservations(LocalDate.now());
        for (RoomEntity room : expiredRooms) {
            room.setStatus("AVAILABLE");
            room.setCustomerEmail(null);
            room.setCustomerName(null);
            room.setCheckInDate(null);
            room.setCheckOutDate(null);
            room.setOccupants(null);
        }
        roomRepository.saveAll(expiredRooms);
    }
}
