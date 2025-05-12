package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Email;

public record UpdateEmailDTO(
        @Email(message = "O email precisa ser válido")
        String email,
        String password
) {
}
