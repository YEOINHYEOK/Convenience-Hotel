package com.example.hotel2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Hotel2Application {

	public static void main(String[] args) {
		SpringApplication.run(Hotel2Application.class, args);
	}

}
