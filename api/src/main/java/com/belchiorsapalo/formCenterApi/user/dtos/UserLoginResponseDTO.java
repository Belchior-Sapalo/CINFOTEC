package com.belchiorsapalo.formCenterApi.user.dtos;

import java.util.UUID;

import com.belchiorsapalo.formCenterApi.user.model.UserRole;

public record UserLoginResponseDTO(String token, UserRole role, UUID id) {
}
