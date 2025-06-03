package com.belchiorsapalo.formCenterApi.PasswordReset.dtos;

import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        String password,
        @Size(min = 6, message = "A nova senha deve ter, no mínimo, 6 caracteres")
        String newPassword,
        String token
) {
}
