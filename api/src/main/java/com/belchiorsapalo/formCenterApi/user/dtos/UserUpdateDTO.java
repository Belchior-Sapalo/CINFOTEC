package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
        String name,
        @Email(message = "O email precisa ser válido") 
        String email,
        @Size(min = 14, max = 14, message = "O número de BI deve possuir 14 caracteres") 
        @Pattern(regexp = "^\\d{9}[A-Z]{2}\\d{3}$", message = "O número de BI deve ser válido") 
        String bi,
        @Pattern(regexp = "\\d{9}", message = "O número de telefone deve possuir 9 dígitos") 
        String phoneNumber,

        String password,

        @Size(min = 6, message = "A nova senha deve ter, no mínimo, 6 caracteres") 
        String newPassword
) {
}
