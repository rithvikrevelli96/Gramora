package com.gramora.app.network;

public class ApiResponse {
    public boolean success;
    public String message;
    public String id; // only used for upload

    // ✅ Empty constructor (needed for Retrofit/Gson)
    public ApiResponse() {
    }

    // ✅ Full constructor (optional, useful if you want to create objects manually)
    public ApiResponse(boolean success, String message, String id) {
        this.success = success;
        this.message = message;
        this.id = id;
    }

    // ✅ Getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}