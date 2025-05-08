package com.example.hotel2.controller;

import com.example.hotel2.service.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class QrController {

    @Autowired
    private QrService qrService;

    @PostMapping("/send-email")
    public String sendEmailWithQRCode(@RequestBody EmailRequest emailRequest) {
        try {
            qrService.sendEmailWithQRCode(emailRequest.getRecipient(),
                    emailRequest.getSubject(),
                    emailRequest.getContent(),
                    emailRequest.getQrCodeText());
            return "QR 코드와 이메일이 성공적으로 전송되었습니다.";
        } catch (Exception e) {
            e.printStackTrace();
            return "이메일 전송 중 오류가 발생했습니다.";
        }
    }
}

class EmailRequest {
    private String recipient;
    private String subject;
    private String content;
    private String qrCodeText;

    // Getters and Setters
    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getQrCodeText() {
        return qrCodeText;
    }

    public void setQrCodeText(String qrCodeText) {
        this.qrCodeText = qrCodeText;
    }
}
