package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdatePhoneDTO(
        @NotNull(message = "O número não pode ser nulo")
        @Pattern(regexp = "^9\\d{8}", message = "O número de telefone deve possuir 9 dígitos e começar com 9")
        String phoneNumber
) {
}
