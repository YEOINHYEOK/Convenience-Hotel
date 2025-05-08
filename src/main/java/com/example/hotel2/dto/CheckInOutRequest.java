package com.example.hotel2.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.internal.build.AllowNonPortable;

@AllowNonPortable
@NoArgsConstructor
@Getter
@Setter
public class CheckInOutRequest {
    private String qrCodeData;
    private String actionType; // "CHECK_IN" or "CHECK_OUT"

    // Getters and Setters
}

