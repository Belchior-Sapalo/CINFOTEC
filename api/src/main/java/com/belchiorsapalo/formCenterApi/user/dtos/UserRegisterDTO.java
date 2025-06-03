package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterDTO(
        @NotNull(message = "O nome não pode ser nulo")
        @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$", message = "Nome inválido: use apenas letras e espaços")
        @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
        String name,

        @NotNull(message = "O email não pode ser nulo") 
        @Email(message = "O email precisa ser válido") 
        String email,

        @NotNull(message = "O número de BI não pode ser nulo") 
        @Size(min = 14, max = 14, message = "O número de BI deve possuir 14 caracteres") 
        @Pattern(regexp = "^\\d{9}[A-Z]{2}\\d{3}$", message = "O número de BI deve ser válido") 
        String bi,

        @NotNull(message = "O número não pode ser nulo") 
        @Pattern(regexp = "^9\\d{8}", message = "O número de telefone deve possuir 9 dígitos e começar com 9")
        String phoneNumber,

        @NotNull(message = "A senha não pode ser nula") 
        @Size(min = 6, message = "A senha deve ter, no mínimo, 6 caracteres") 
        String password
) {
}
