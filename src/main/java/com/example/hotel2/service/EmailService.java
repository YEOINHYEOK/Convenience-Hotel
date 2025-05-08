//package com.example.hotel2.service;
//
//import jakarta.mail.*;
//import jakarta.mail.internet.InternetAddress;
//import jakarta.mail.internet.MimeMessage;
//
//import java.util.Properties;
//
//public class EmailService {
//
//    public void sendEmail(String recipient, String subject, String content) throws Exception {
//        String to = recipient; // 받는 사람의 이메일 주소
//        String from = "yjg9993@gmail.com"; // 보내는 사람의 이메일 주소
//        String password = "asaz byue pmdr zznz"; // 보내는 사람의 이메일 계정 비밀번호
//        String host = "smtp.gmail.com"; // 구글 메일 서버 호스트 이름
//
//        // SMTP 프로토콜 설정
//        Properties props = new Properties();
//        props.setProperty("mail.smtp.host", host);
//        props.setProperty("mail.smtp.port", "587");
//        props.setProperty("mail.smtp.auth", "true");
//        props.setProperty("mail.smtp.starttls.enable", "true");
//
//        // 보내는 사람 계정 정보 설정
//        Session session = Session.getInstance(props, new Authenticator() {
//            protected PasswordAuthentication getPasswordAuthentication() {
//                return new PasswordAuthentication(from, password);
//            }
//        });
//
//        // 메일 내용 작성
//        Message msg = new MimeMessage(session);
//        msg.setFrom(new InternetAddress(from));
//        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
//        msg.setSubject(subject);
//        msg.setText(content);
//
//        // 메일 보내기
//        Transport.send(msg);
//
//    }
//
////    public static void main(String[] args) throws Exception {
////        String to = "yjg9993@gmail.com"; // 받는 사람의 이메일 주소
////        String from = "yjg9993@gmail.com"; // 보내는 사람의 이메일 주소
////        String password = "asaz byue pmdr zznz"; // 보내는 사람의 이메일 계정 비밀번호
////        String host = "smtp.gmail.com"; // 구글 메일 서버 호스트 이름
////
////        // SMTP 프로토콜 설정
////        Properties props = new Properties();
////        props.setProperty("mail.smtp.host", host);
////        props.setProperty("mail.smtp.port", "587");
////        props.setProperty("mail.smtp.auth", "true");
////        props.setProperty("mail.smtp.starttls.enable", "true");
////
////        // 보내는 사람 계정 정보 설정
////        Session session = Session.getInstance(props, new Authenticator() {
////            protected PasswordAuthentication getPasswordAuthentication() {
////                return new PasswordAuthentication(from, password);
////            }
////        });
////
////        // 메일 내용 작성
////        Message msg = new MimeMessage(session);
////        msg.setFrom(new InternetAddress(from));
////        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
////        msg.setSubject("메일 제목");
////        msg.setText("메일 내용");
////
////        // 메일 보내기
////        Transport.send(msg);
////    }
//}