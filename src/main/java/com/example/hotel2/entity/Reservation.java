package com.example.hotel2.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Reservation {

    @Id
    private String reservationCode;  // 예약 코드 (유니크한 값으로 사용)

    private String customerEmail;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int occupants;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;  // 예약 상태를 Enum으로 정의

    @ManyToOne
    @JoinColumn(name = "room_number", referencedColumnName = "roomNumber")
    private RoomEntity room;  // 객실 정보와 연관

    // getters and setters

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public int getOccupants() {
        return occupants;
    }

    public void setOccupants(int occupants) {
        this.occupants = occupants;
    }

    public RoomEntity getRoom() {
        return room;
    }

    public void setRoom(RoomEntity room) {
        this.room = room;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public String getRoomNumber() {
        if (room != null) {
            return room.getRoomNumber();  // room이 null이 아니면 room 번호 반환
        }
        return null;  // room이 null일 경우 null 반환
    }

    public double getTotalPrice() {
        if (checkInDate != null && checkOutDate != null && room != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
            return days * 100.0 * occupants;  // 객실의 가격 계산 예시 (단, pricePerNight을 room에서 받아오지 않음)
        }
        return 0.0;
    }
}

// 예약 상태를 정의하는 enum
enum ReservationStatus {
    PENDING,    // 대기 중
    CONFIRMED,  // 확인됨
    CANCELED,   // 취소됨
    COMPLETED   // 완료됨
}
