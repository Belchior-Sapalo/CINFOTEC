package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Size;

public record UpdatePasswordDTO(
        String password,
        @Size(min = 6, message = "A nova senha deve ter, no mínimo, 6 caracteres")
        String newPassword
) {
}
