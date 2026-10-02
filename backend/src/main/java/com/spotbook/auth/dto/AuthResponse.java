package com.spotbook.auth.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {}
