package com.example.hotel2.repository;

import com.example.hotel2.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    // 기본적인 CRUD 메서드를 제공합니다.
}
