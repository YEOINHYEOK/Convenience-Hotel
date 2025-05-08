package com.example.hotel2.controller;

import com.example.hotel2.entity.Payment;
import com.example.hotel2.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 결제 완료 처리 (RequestBody를 사용하여 JSON 데이터를 받도록 수정)
    @PostMapping("/complete")
    public String completePayment(@RequestBody Map<String, Object> paymentData) {
        try {
            String impUid = (String) paymentData.get("imp_uid");
            String merchantUid = (String) paymentData.get("merchant_uid");
            Double paidAmount = Double.valueOf(paymentData.get("paid_amount").toString());

            // 결제 정보만 처리하고 결제 상태를 업데이트
            Payment payment = new Payment();
            payment.setImpUid(impUid);
            payment.setMerchantUid(merchantUid);
            payment.setPaidAmount(paidAmount);
            payment.setStatus("PAID"); // 결제 완료 상태로 업데이트

            // 결제 정보 저장
            paymentService.savePayment(payment);

            return "Payment completed successfully!";
        } catch (Exception e) {
            return "Payment completion failed: " + e.getMessage();
        }
    }
}
