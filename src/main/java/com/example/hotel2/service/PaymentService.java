package com.example.hotel2.service;

import com.example.hotel2.entity.Payment;
import com.example.hotel2.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public void savePayment(Payment payment) {
        paymentRepository.save(payment);  // 데이터베이스에 결제 정보 저장
    }
}
