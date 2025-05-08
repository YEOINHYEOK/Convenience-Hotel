package com.example.hotel2.dto;

public class Response {
    private String result;
    private String message;

    public Response(String result, String message) {
        this.result = result;
        this.message = message;
    }

    // getters and setters
    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
