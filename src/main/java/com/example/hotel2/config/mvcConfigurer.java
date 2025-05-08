package com.example.hotel2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class mvcConfigurer implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 모든 도메인 허용
        registry.addMapping("/**").allowedOriginPatterns("*") .allowedOrigins("http://localhost:3000") // 클라이언트의 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
        }
    }

