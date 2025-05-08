package com.example.hotel2.repository;

import com.example.hotel2.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, String> {

    @Query("SELECT r FROM RoomEntity r WHERE r.status = 'AVAILABLE' " +
            "AND (r.checkOutDate IS NULL OR r.checkInDate > :checkOutDate " +
            "OR r.checkInDate IS NULL OR r.checkOutDate < :checkInDate)")
    List<RoomEntity> findAvailableRooms(@Param("checkInDate") LocalDate checkInDate,
                                        @Param("checkOutDate") LocalDate checkOutDate);

    List<RoomEntity> findByCustomerEmail(String customerEmail);

    // 만료된 예약을 찾는 쿼리 메서드
    @Query("SELECT r FROM RoomEntity r WHERE r.checkOutDate < :today AND r.status = 'RESERVED'")
    List<RoomEntity> findExpiredReservations(@Param("today") LocalDate today);

    // 특정 이메일과 상태를 기반으로 예약 조회
    List<RoomEntity> findByCustomerEmailAndStatus(String customerEmail, String status);

    RoomEntity findByCustomerEmailAndRoomNumber(String customerEmail, String roomNumber);  // roomNumber는 String

    Optional<RoomEntity> findByRoomNumberAndCustomerEmail(String roomNumber, String customerEmail);  // roomNumber는 String

    List<RoomEntity> findByCustomerEmailAndStatusIn(String customerEmail, List<String> statuses);
}
