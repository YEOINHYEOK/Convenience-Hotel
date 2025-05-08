package com.example.hotel2.service;

import com.example.hotel2.dto.LoginDto;
import com.example.hotel2.dto.LoginResponseDto;
import com.example.hotel2.dto.ResponseDto;
import com.example.hotel2.dto.SignUpDto;
import com.example.hotel2.entity.UserEntity;
import com.example.hotel2.repository.UserRepository;
import com.example.hotel2.security.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenProvider tokenProvider;

    public ResponseDto<?> signUp(SignUpDto dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        String confirmPassword = dto.getConfirmPassword();

        try {
            if(userRepository.existsById(email)) {
                return ResponseDto.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        if(!password.equals(confirmPassword)) {
            return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
        }

        UserEntity userEntity = new UserEntity(dto);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);
        if(!isPasswordMatch) {
            return ResponseDto.setFailed("암호화에 실패하였습니다.");
        }

        userEntity.setPassword(hashedPassword);

        try {
            userRepository.save(userEntity);
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDto.setSuccess("회원 생성에 성공했습니다.");
    }

    public ResponseDto<LoginResponseDto> login(LoginDto dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        UserEntity userEntity;

        try {
            userEntity = userRepository.findById(email).orElse(null);
            if(userEntity == null) {
                return ResponseDto.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = userEntity.getPassword();

            if(!passwordEncoder.matches(password, encodedPassword)) {
                return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        userEntity.setPassword("");

        int exprTime = 3600000;     // 1h
        String token = tokenProvider.createJwt(email, exprTime);
        if(token == null) {
            log.info("토큰 생성에 실패하였습니다.");
//            return ResponseDto.setFailed("토큰 생성에 실패하였습니다.");
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto(token, exprTime, userEntity);

        return ResponseDto.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
    }
}
