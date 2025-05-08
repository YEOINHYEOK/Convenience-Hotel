package com.example.hotel2.service;

import com.example.hotel2.dto.ReservationDto;
import com.example.hotel2.dto.ResponseDto;
import com.example.hotel2.entity.RoomEntity;
import com.example.hotel2.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * 예약 요청 처리
     *
     * @param reservationDto 예약 요청 데이터
     * @return 예약 성공 또는 실패 응답
     */
    public ResponseDto<?> reserveRoom(ReservationDto reservationDto) {
        try {
            List<RoomEntity> availableRooms = findAvailableRooms(
                    reservationDto.getCheckInDate(), reservationDto.getCheckOutDate()
            );

            if (availableRooms.isEmpty()) {
                return ResponseDto.setFailed("No available rooms for the selected dates.");
            }

            RoomEntity selectedRoom = selectRoom(availableRooms);
            updateRoomWithReservationDetails(selectedRoom, reservationDto);

            roomRepository.save(selectedRoom);

            return ResponseDto.setSuccessData("Reservation confirmed.", selectedRoom);
        } catch (Exception e) {
            return ResponseDto.setFailed("An error occurred during reservation: " + e.getMessage());
        }
    }

    /**
     * 체크인 요청 유효화
     *
     * @param email 고객 이메일
     * @param roomNumber 방 번호 (String)
     * @return 체크인 유효 여부
     */
    public boolean validateCheckin(String email, String roomNumber) {
        // 이메일과 방 번호로 방 정보를 조회
        Optional<RoomEntity> roomEntity = Optional.ofNullable(roomRepository.findByCustomerEmailAndRoomNumber(email, roomNumber));

        // 방이 존재하고 상태가 "RESERVED"일 때만 유효
        return roomEntity.isPresent() && "RESERVED".equals(roomEntity.get().getStatus());
    }

    /**
     * 고객 이메일로 예약 정보 조회
     *
     * @param customerEmail 고객 이메일
     * @return 예약 목록
     */
    public List<ReservationDto> getReservationsByCustomerEmail(String customerEmail) {
        List<RoomEntity> reservedRooms = roomRepository.findByCustomerEmailAndStatusIn(
                customerEmail, Arrays.asList("RESERVED", "CHECK_IN", "CHECK_OUT")
        );
        return reservedRooms.stream()
                .map(this::convertRoomEntityToReservationDto)
                .collect(Collectors.toList());
    }

    private List<RoomEntity> findAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate) {
        return roomRepository.findAvailableRooms(checkInDate, checkOutDate);
    }

    private RoomEntity selectRoom(List<RoomEntity> availableRooms) {
        Random random = new Random();
        return availableRooms.get(random.nextInt(availableRooms.size()));
    }

    private void updateRoomWithReservationDetails(RoomEntity room, ReservationDto reservationDto) {
        room.setStatus("RESERVED");
        room.setCustomerEmail("yih@hk.kr");
        room.setCustomerName(reservationDto.getCustomerName());
        room.setCheckInDate(reservationDto.getCheckInDate());
        room.setCheckOutDate(reservationDto.getCheckOutDate());
        room.setOccupants(reservationDto.getOccupants());
    }

    private ReservationDto convertRoomEntityToReservationDto(RoomEntity roomEntity) {
        return new ReservationDto(
                roomEntity.getRoomNumber(),
                roomEntity.getStatus(),
                roomEntity.getCheckInDate(),
                roomEntity.getCheckOutDate(),
                roomEntity.getOccupants(),
                roomEntity.getCustomerEmail(),
                roomEntity.getCustomerName()
        );
    }
}
