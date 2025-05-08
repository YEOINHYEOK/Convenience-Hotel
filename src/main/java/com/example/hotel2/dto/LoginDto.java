package com.example.hotel2.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    @NotBlank   // *spring-boot-starter-validation, 필수값
    private String email;
    @NotBlank
    private  String password;
}
