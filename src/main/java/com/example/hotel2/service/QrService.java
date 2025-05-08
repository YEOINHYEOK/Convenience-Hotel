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
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Properties;

@Service
public class QrService {

    public void sendEmailWithQRCode(String recipient, String subject, String content, String qrCodeText) throws Exception {
        String from = "yjg9993@gmail.com"; // 보내는 사람 이메일
        String password = "asaz byue pmdr zznz"; // 앱 비밀번호 사용
        String host = "smtp.gmail.com"; // Gmail SMTP 서버 호스트

        // SMTP 서버 설정
        Properties props = new Properties();
        props.setProperty("mail.smtp.host", host);
        props.setProperty("mail.smtp.port", "587");
        props.setProperty("mail.smtp.auth", "true");
        props.setProperty("mail.smtp.starttls.enable", "true");

        // 인증 정보
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        // 이메일 메시지 설정
        Message msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(from));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
        msg.setSubject(subject);

        // QR 코드 이미지 생성
        byte[] qrCodeImage = generateQRCodeImage(qrCodeText);

        // 이메일 내용 생성
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(content);

        // QR 코드 이미지 첨부
        MimeBodyPart imageBodyPart = new MimeBodyPart();
        imageBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(qrCodeImage, "image/png")));
        imageBodyPart.setFileName("QRCode.png");

        // 멀티파트 이메일 설정
        MimeMultipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(imageBodyPart);

        // 이메일 전송
        msg.setContent(multipart);
        Transport.send(msg);
    }

    public byte[] generateQRCodeImage(String qrCodeText) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, 200, 200);
        BufferedImage image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < 200; x++) {
            for (int y = 0; y < 200; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }
}
