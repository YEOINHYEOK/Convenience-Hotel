package com.example.hotel2.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Properties;

public class qr {

    public static void main(String[] args) {
        String qrCodeText = "yih@hk.kr-601"; // QR 코드에 포함할 텍스트(url)
        String recipientEmail = "yjg9993@gmail.com"; // 받는 사람 이메일 주소

        try {
            // QR 코드를 생성하고 이메일을 전송합니다.
            sendEmailWithQRCode(recipientEmail, "Your QR Code", "Here is your QR code.", qrCodeText);
            System.out.println("이메일이 성공적으로 전송되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void sendEmailWithQRCode(String recipient, String subject, String content, String qrCodeText) throws Exception {
        String from = "yjg9993@gmail.com"; // 보내는 사람의 이메일 주소
        String password = "asaz byue pmdr zznz"; // 보내는 사람의 이메일 계정 비밀번호
        String host = "smtp.gmail.com"; // 구글 메일 서버 호스트 이름

        // SMTP 프로토콜 설정
        Properties props = new Properties();
        props.setProperty("mail.smtp.host", host);
        props.setProperty("mail.smtp.port", "587");
        props.setProperty("mail.smtp.auth", "true");
        props.setProperty("mail.smtp.starttls.enable", "true");

        // 보내는 사람 계정 정보 설정
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        // 메일 내용 작성
        Message msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(from));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
        msg.setSubject(subject);

        // QR 코드 이미지를 생성하고 바이트 배열로 변환
        byte[] qrCodeImage = generateQRCodeImage(qrCodeText);

        // 메일 내용 부분 생성
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(content);

        // QR 코드 이미지를 첨부 부분 생성
        MimeBodyPart imageBodyPart = new MimeBodyPart();
        imageBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(qrCodeImage, "image/png")));
        imageBodyPart.setFileName("QRCode.png"); // 파일 이름 설정

        // 멀티파트 설정
        MimeMultipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(imageBodyPart);

        // 멀티파트를 메일 메시지에 추가
        msg.setContent(multipart);

        // 메일 보내기
        Transport.send(msg);
    }

    public static byte[] generateQRCodeImage(String qrCodeText) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, 200, 200);
        BufferedImage image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < 200; x++) {
            for (int y = 0; y < 200; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        // QR 코드를 바이트 배열로 변환
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }
}

