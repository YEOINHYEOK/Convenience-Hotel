package com.example.hotel2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "room")
public class RoomEntity {
    @Id
    private String roomNumber;
    private String status;
    private String customerEmail;
    private String customerName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer occupants;

}
