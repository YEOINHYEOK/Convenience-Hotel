package com.example.hotel2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "set")
public class ResponseDto<D> {
    private boolean result;
    private String message;
    private D data;

    // 성공 메시지와 null 데이터를 반환
    public static <D> ResponseDto<D> setSuccess(String message) {
        return ResponseDto.set(true, message, null);
    }

    // 실패 메시지와 null 데이터를 반환
    public static <D> ResponseDto<D> setFailed(String message) {
        return ResponseDto.set(false, message, null);
    }

    // 성공 메시지와 데이터 반환
    public static <D> ResponseDto<D> setSuccessData(String message, D data) {
        return ResponseDto.set(true, message, data);
    }

    // 실패 메시지와 데이터 반환
    public static <D> ResponseDto<D> setFailedData(String message, D data) {
        return ResponseDto.set(false, message, data);
    }

    // 데이터를 빈 배열로 설정하여 반환
    public static <D> ResponseDto<D> setSuccessEmptyData(String message) {
        return ResponseDto.set(true, message, (D) new Object[0]);
    }

    // 데이터를 빈 객체로 설정하여 반환
    public static <D> ResponseDto<D> setFailedEmptyData(String message) {
        return ResponseDto.set(false, message, (D) new Object());
    }
}
