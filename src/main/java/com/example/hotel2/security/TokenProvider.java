package com.example.hotel2.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class TokenProvider {

    @Value("${jwt.secret-key}")
    private String SECURITY_KEY;  // 보안 키는 환경 변수나 properties 파일에서 관리하는 것이 좋습니다.

    // JWT 생성 메서드
    public String createJwt(String email, int duration) {
        try {
            // 현재 시간 기준으로 duration만큼 뒤로 만료시간 설정
            Instant now = Instant.now();
            Instant exprTime = now.plusSeconds(duration);

            // JWT Claim 설정
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exprTime))
                    .build();

            // JWT 서명
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),  // 헤더 설정
                    claimsSet
            );

            // HMAC 서명을 사용하여 JWT 서명
            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes(StandardCharsets.UTF_8));
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            e.printStackTrace();  // 예외 발생 시 로그 출력
            return null;
        }
    }

    // JWT 검증 메서드
    public String validateJwt(String token) {
        try {
            // 서명 확인을 통한 JWT 검증
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes(StandardCharsets.UTF_8));

            // 서명 검증
            if (signedJWT.verify(verifier)) {
                // 만료 시간 검증
                if (signedJWT.getJWTClaimsSet().getExpirationTime().before(new Date())) {
                    return null;  // 만료된 토큰은 무효 처리
                }
                return signedJWT.getJWTClaimsSet().getSubject();  // 유효한 토큰일 경우 subject 반환
            } else {
                // 서명이 유효하지 않은 경우
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 발생 시 로그 출력
            return null;
        }
    }
}
