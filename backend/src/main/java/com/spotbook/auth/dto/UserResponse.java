package com.spotbook.auth.dto;

import com.spotbook.user.UserRole;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        UserRole role
) {}
